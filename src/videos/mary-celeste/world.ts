// Mary Celeste world: one three.js scene posed per (scene id, frame) - a pure function of both.
// Sea + sky + light rig (engine), the Mary Celeste in her two states, the Dei Gratia, the New York pier, the jolly
// boat of the hypothesis, the interiors and the chart (sets.ts), and the people (cast.ts). Each shot shows one set.
import * as THREE from "three";
import { ShortWorld, FrameInfo } from "../../engine/Shell";
import { Ocean, Sky } from "../../engine/sea";
import { Rig } from "../../engine/light";
import { NOINK } from "../../engine/ink";
import { Ship, MARY_CELESTE, DEI_GRATIA, jollyBoat } from "../../engine/ship";
import { Cast } from "../../engine/people";
import { harbour } from "../../engine/sets";
import { lam } from "../../engine/geo";
import { runKeys } from "../../engine/camera";
import { FPS } from "../../engine/timeline";
import { DEFS, SCENES, dofAt, depX, SetName } from "./scenes";
import { LOOKS } from "./looks";
import { buildSets, Sets } from "./sets";

export class MaryWorld implements ShortWorld {
  root = new THREE.Group();
  private ocean: Ocean; private sky: Sky; private rig: Rig;
  private found: Ship; private departure: Ship; private dei: Ship;
  private harbor = new THREE.Group(); private boat = new THREE.Group();
  private sets: Sets;
  private castFound: Cast; private castDep: Cast; private castDei: Cast; private castBoat: Cast;
  private sunCache = new Map<number, THREE.Vector3>();
  private focus = new THREE.Vector3();
  private bgDark = new THREE.Color("#15120f");

  constructor() {
    this.sky = new Sky(this.root);
    this.rig = new Rig(this.root);
    this.ocean = new Ocean(this.root);
    this.found = new Ship(MARY_CELESTE, "found");
    this.departure = new Ship(MARY_CELESTE, "departure");
    this.dei = new Ship(DEI_GRATIA, "departure");
    this.dei.boat.visible = true;
    this.root.add(this.found.root, this.departure.root, this.dei.root, this.harbor, this.boat);
    harbour(this.harbor, -60, 80, -4.6);
    const jb = jollyBoat(lam("boatWhite", () => ({ color: "#d9d2c0" })), lam("boatTrim", () => ({ color: "#6b4a30" })));
    this.boat.add(jb);
    this.castFound = new Cast(this.found.root, 10);
    this.castDep = new Cast(this.departure.root, 10);
    this.castDei = new Cast(this.dei.root, 2);
    this.castBoat = new Cast(this.boat, 10);
    this.sets = buildSets(this.root);
  }

  /** sun direction for a scene: camera-relative, frozen per scene (average view direction over the scene) */
  private sunDir(id: number) {
    let v = this.sunCache.get(id);
    if (v) return v;
    const s = SCENES[id - 1], d = DEFS[id], L = LOOKS[d.look(s.a)].light;
    let fx = 0, fz = 0;
    for (let f = s.a; f < s.b; f += 3) {
      const c = runKeys(d.keys, f), x = c.look[0] - c.pos[0], z = c.look[2] - c.pos[2], n = Math.hypot(x, z) || 1;
      fx += x / n; fz += z / n;
    }
    v = Rig.sunDir(fx, fz, d.sunAz ?? L.az, d.sunEl ?? L.el);
    this.sunCache.set(id, v);
    return v;
  }

  private showSet(set: SetName) {
    const outdoor = set === "sea" || set === "harbor";
    this.ocean.mesh.visible = outdoor;
    this.sets.cabin.visible = set === "cabin"; this.sets.store.visible = set === "store";
    this.sets.hold.visible = set === "hold"; this.sets.chart.visible = set === "chart";
    this.harbor.visible = set === "harbor";
    return outdoor;
  }

  update(id: number, f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene): FrameInfo {
    const t = f / FPS, d = DEFS[id], look = LOOKS[d.look(f)], set = d.set(f);
    // ---- camera ----
    const c = runKeys(d.keys, f);
    cam.position.set(...c.pos); cam.up.set(0, 1, 0); cam.lookAt(...c.look); cam.rotateZ(c.roll);
    cam.fov = c.fov; cam.near = set === "sea" || set === "harbor" ? 0.2 : 0.05; cam.far = 3000; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    cam.layers.enable(NOINK);
    const outdoor = this.showSet(set);
    // ---- sea, ships, boat ----
    this.ocean.ampK = d.seaK ?? 1;
    this.ocean.setLook(look.sea);
    if (outdoor) this.ocean.update(cam.position.x, cam.position.z, t);
    const h = (x: number, z: number) => this.ocean.height(x, z, t);
    this.found.root.visible = outdoor && d.mary === "found";
    this.departure.root.visible = outdoor && d.mary === "departure";
    if (d.mary === "found") this.found.pose(0, 0, 0, h, t, 1);
    else this.departure.pose(depX(f), 0, 0, h, t, 0.5);
    if (d.dei && outdoor) {
      this.dei.root.visible = true;
      const [x, , z] = d.dei.pos, yaw = d.dei.yaw, v = d.dei.speed;
      this.dei.pose(x + Math.cos(yaw) * v * t, z + Math.sin(yaw) * v * t, yaw, h, t + 3.1);
    } else this.dei.root.visible = false;
    const bp = d.boat?.(f);
    this.boat.visible = outdoor && !!bp;
    if (bp) {
      const y = h(bp.pos[0], bp.pos[2]);
      this.boat.position.set(bp.pos[0], y - 0.35, bp.pos[2]); this.boat.rotation.set(0.04 * Math.sin(t * 1.3), bp.yaw, 0.05 * Math.sin(t * 1.7));
    }
    this.root.updateMatrixWorld(true);
    // ---- people ----
    const cast = d.cast?.(f) ?? {};
    this.castFound.update(d.mary === "found" && outdoor ? cast.mary ?? [] : [], cam, t);
    this.castDep.update(d.mary === "departure" && outdoor ? cast.mary ?? [] : [], cam, t);
    this.castDei.update(this.dei.root.visible ? cast.dei ?? [] : [], cam, t);
    this.castBoat.update(this.boat.visible ? cast.boat ?? [] : [], cam, t, 0.5);
    // swinging cabin lamp (the ship still rolls)
    this.sets.lamp.rotation.set(0.12 * Math.sin(t * 1.1), 0, 0.09 * Math.sin(t * 0.8 + 1));
    this.sets.water.position.y = 0.32 + 0.015 * Math.sin(t * 1.4);
    // ---- light + sky ----
    const dof = dofAt(id, f);
    this.focus.set(...(dof.focus ?? c.look));
    if (d.mary === "departure" && dof.focus) this.focus.x += depX(f);
    const dist = cam.position.distanceTo(this.focus);
    this.rig.apply(look.light, this.sunDir(id), this.focus, THREE.MathUtils.clamp(dist * 1.1 + (outdoor ? 10 : 4), outdoor ? 18 : 6, 140));
    if (outdoor) this.sky.update(cam, scene, look.sky, t);
    else { scene.fog = new THREE.Fog(look.sky.fog, look.sky.fogNear, look.sky.fogFar); scene.background = this.bgDark; }
    this.sky.setVisible(outdoor);
    return { focus: this.focus, cInf: dof.cInf, grade: look.grade, gradeAmount: look.gradeAmount };
  }
}
