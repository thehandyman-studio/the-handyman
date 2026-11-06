// Characters in any world: flat cartoon cards (toon.ts drawings) standing at world positions, yaw-turned to the
// camera, lit by cardShade (engine/cards.ts). Deterministic per frame: blinks come from the seed + time.
import * as THREE from "three";
import { Pool, Actor } from "./cards";
import { bodyFront, Outfit, Expr, FrontOpts } from "./toon";
import { V3 } from "./camera";
import { bodyHuman, HumanOpts } from "./human";

export type Person = {
  outfit: Outfit; pos: V3; seed: number;
  expr?: Expr; mode?: FrontOpts["mode"]; look?: number; wave?: number;
  /** 0..1 fade (memory ghosts); 1 = solid */ alpha?: number;
  /** uniform size factor (1 = 2.16 m card) */ scale?: number;
  /** flat dark silhouette instead of the coloured drawing (hypothesis shots) */ silhouette?: string;
  /** mrABSURDLY human drawing (human.ts) instead of the classic bodyFront; expr/look/seed above still apply */
  human?: HumanOpts;
  /** drawing resolution factor for this card (default = the cast's k; giant close-ups need ~2-3) */ res?: number;
  /** face the camera fully (giants seen from far below/above); pos is then the pivot point, pivot = its height on the card in metres (unscaled) */
  billboard?: "full"; pivot?: number;
};
/** cache key for a human pose: continuous values rounded so identical frames share one canvas */
const humanKey = (h: HumanOpts) => JSON.stringify(h, (_k, v) => (typeof v === "number" ? Math.round(v * 100) / 100 : v));

/** deterministic blink: closed for 4 frames every 0.5-2.3 s */
export const blinkAt = (seed: number, t: number) => {
  const per = 0.5 + 1.8 * ((Math.sin(seed * 91.7) + 1) / 2), ph = (seed * 0.37) % per;
  return ((t + ph) % per) < 4 / 30;
};

export class Cast {
  private pool = new Pool();
  private actors: Actor[] = [];
  /** autoRes: draw every card at the resolution its on-screen size needs (sharp close-ups); off = fixed k (Mary Celeste) */
  constructor(private parent: THREE.Object3D, max = 16, private autoRes = false) {
    for (let i = 0; i < max; i++) this.actors.push(new Actor(parent));
  }
  private wp = new THREE.Vector3();
  /** drawing scale for a card: projected card height in output pixels (2560 = the 2K export) / 1000 design units, stepped */
  private resFor(p: Person, cam: THREE.Camera) {
    const pc = cam as THREE.PerspectiveCamera, s = (p.scale ?? 1) * (this.parent.getWorldScale(new THREE.Vector3()).x);
    this.wp.set(p.pos[0], p.pos[1] + 1.0, p.pos[2]); this.parent.localToWorld(this.wp);
    const d = Math.max(0.3, this.wp.distanceTo(cam.position)), px = (2560 * 2.16 * s) / (2 * d * Math.tan(((pc.fov ?? 40) * Math.PI) / 360));
    const need = px / 1000, steps = [0.35, 0.5, 0.7, 1.0, 1.4, 1.9, 2.6];
    return steps.find((x) => x >= need) ?? steps[steps.length - 1];
  }
  /** place `people` for this frame (others hidden); t = seconds (blinks) */
  private q = new THREE.Quaternion(); private e = new THREE.Euler();
  update(people: Person[], cam: THREE.Camera, t: number, k = 0.7) {
    people.slice(0, this.actors.length).forEach((p, i) => {
      const kk = this.autoRes ? Math.max(this.resFor(p, cam), p.res ?? 0) : p.res ?? k, W = Math.round(600 * kk), H = Math.round(1000 * kk);
      const blink = blinkAt(p.seed, t);
      const opts: FrontOpts = { mode: p.mode ?? "stand", expr: p.expr ?? "neutral", blink, seed: p.seed, look: p.look ?? 0, wave: p.wave };
      const key = `${JSON.stringify(p.outfit)}|${opts.expr}|${opts.mode}|${blink}|${p.seed}|${p.look ?? 0}|${p.wave ?? "-"}|${p.silhouette ?? ""}`
        + (p.human ? `|H${humanKey(p.human)}` : "");
      this.actors[i].r = this.pool.req(key, W, H, kk, (pen) => {
        if (p.human) bodyHuman(pen, p.outfit, { ...p.human, expr: p.human.expr ?? opts.expr, look: p.human.look ?? opts.look, blink, seed: p.seed });
        else bodyFront(pen, p.outfit, opts);
        if (p.silhouette) { const g = pen.g; g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
          g.globalCompositeOperation = "source-atop"; g.fillStyle = p.silhouette; g.fillRect(0, 0, W, H); g.restore(); }
      });
    });
    this.pool.flush();
    this.actors.forEach((a, i) => {
      const p = people[i];
      a.mesh.visible = !!p;
      if (!p) return;
      a.bind();
      a.mesh.position.set(...p.pos);
      const s = p.scale ?? 1;
      a.mesh.scale.set(s, s, s);
      // face the camera in WORLD space, then undo the parent's own heading (cards on a turned boat/ship)
      const wp = this.parent.localToWorld(new THREE.Vector3(...p.pos));
      this.parent.getWorldQuaternion(this.q); const parentYaw = this.e.setFromQuaternion(this.q, "YXZ").y;
      a.mesh.rotation.set(0, Math.atan2(cam.position.x - wp.x, cam.position.z - wp.z) - parentYaw, 0);
      if (p.billboard === "full") { // turn fully to the camera about the pivot (e.g. a giant's face in a hole)
        a.mesh.lookAt(cam.position);
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(a.mesh.quaternion);
        a.mesh.position.addScaledVector(up, -(p.pivot ?? 0) * s);
      }
      const al = p.alpha ?? 1;
      a.mat.transparent = al < 1; a.mat.opacity = al; a.mat.depthWrite = al > 0.6; a.mat.needsUpdate = a.mat.transparent !== (al < 1);
    });
  }
}
