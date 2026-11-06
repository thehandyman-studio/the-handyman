// Big crowds ("thousands of people"): instanced billboards. Every (look, pose) pair is drawn ONCE with bodyHuman into
// its own small texture and owns one InstancedMesh; each frame the people are sorted into the meshes of their current
// pose and turned to the camera. Same card lighting as the hero cards (cardShade), NOINK layer, no shadows.
// Heroes near the camera stay full Actors (people.ts); the field is for the mass behind them.
import * as THREE from "three";
import { Pen, Outfit } from "./toon";
import { bodyHuman, HumanOpts } from "./human";
import { cardShade } from "./cardshade";
import { NOINK } from "./ink";
import { SU } from "./cards";

export type CrowdPose = { name: string; opts: HumanOpts; /** keep only the top share of the drawing (people looking out of windows) */ crop?: number };
export type CrowdMember = { pos: [number, number, number]; look: number; pose: number; scale?: number; /** mirror the drawing */ flip?: boolean; /** fixed heading instead of facing the camera */ yaw?: number };

export class Crowd {
  private meshes: THREE.InstancedMesh[] = [];
  private m = new THREE.Matrix4(); private q = new THREE.Quaternion(); private s = new THREE.Vector3(); private p = new THREE.Vector3();
  private camL = new THREE.Vector3(); private yAxis = new THREE.Vector3(0, 1, 0);
  readonly looks: number; readonly poses: number;
  /** members closer than this to the camera (parent units) are skipped */ near = 4;
  constructor(private parent: THREE.Object3D, outfits: Outfit[], poses: CrowdPose[], max: number, res = 0.28) {
    this.looks = outfits.length; this.poses = poses.length;
    const geo = new THREE.PlaneGeometry(600 * SU, 1000 * SU); geo.translate(0, (975 - 500) * SU, 0);
    const W = Math.round(600 * res), H = Math.round(1000 * res);
    outfits.forEach((o, li) => poses.forEach((ps) => {
      const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
      const g = cv.getContext("2d")!; g.setTransform(res, 0, 0, res, 0, 0);
      bodyHuman(new Pen(g), o, { seed: 900 + li, ...ps.opts });
      if (ps.crop) { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, Math.round(H * ps.crop), W, H); }
      const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
      const mat = cardShade(new THREE.MeshLambertMaterial({ map: tex, alphaTest: 0.5, side: THREE.DoubleSide }));
      const mesh = new THREE.InstancedMesh(geo, mat, max);
      mesh.count = 0; mesh.frustumCulled = false; mesh.layers.set(NOINK); mesh.renderOrder = 1;
      parent.add(mesh); this.meshes.push(mesh);
    }));
  }
  /** place the members for this frame; look = outfit index, pose = pose index */
  update(members: CrowdMember[], cam: THREE.Camera) {
    this.parent.updateMatrixWorld();
    this.camL.copy(cam.position); this.parent.worldToLocal(this.camL);
    for (const mesh of this.meshes) mesh.count = 0;
    for (const mb of members) {
      if (Math.hypot(this.camL.x - mb.pos[0], this.camL.z - mb.pos[2]) < this.near) continue; // nobody right in the lens
      const mesh = this.meshes[(mb.look % this.looks) * this.poses + (mb.pose % this.poses)];
      if (mesh.count >= mesh.instanceMatrix.count) continue;
      const yaw = mb.yaw ?? Math.atan2(this.camL.x - mb.pos[0], this.camL.z - mb.pos[2]);
      this.q.setFromAxisAngle(this.yAxis, yaw); this.p.set(...mb.pos); this.s.setScalar(mb.scale ?? 1); if (mb.flip) this.s.x *= -1;
      this.m.compose(this.p, this.q, this.s);
      mesh.setMatrixAt(mesh.count++, this.m);
    }
    for (const mesh of this.meshes) mesh.instanceMatrix.needsUpdate = true;
  }
}
