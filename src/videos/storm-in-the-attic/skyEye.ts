// THE HANDYMAN #2: the sky dome (pale, hot, cloudless) and the EYE that opens in it on "And the sky looks back".
// The eye is a painted almond (cartoon ink lid line, pale iris with lightning veins) on a camera-facing plane far away;
// its opening is quantised into 24 cached textures. Outside the lids the plane is transparent, so the sky shows.
import * as THREE from "three";
import { ctex, rng } from "../../engine/paint";
import { NOINK } from "../../engine/ink";
import { V3 } from "../../engine/camera";

const STEPS = 24;
const INK = "#241726";

/** vertical sky gradient (zenith -> horizon haze) */
const skyTex = () => ctex("e2sky", 16, 512, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, "#7f9fd0"); gr.addColorStop(0.35, "#a9c1e2"); gr.addColorStop(0.5, "#efe8d4"); gr.addColorStop(0.56, "#f3e6c6"); gr.addColorStop(1, "#d9c9a4");
  g.fillStyle = gr; g.fillRect(0, 0, 16, 512);
});

/** almond eye opened by `open` (0..1); `bolt` brightens the lightning veins */
const eyeTex = (open: number, bolt: boolean) => ctex(`e2eye_${Math.round(open * STEPS)}_${bolt ? 1 : 0}`, 1024, 512, (g) => {
  const W = 1024, cy = 262, k = Math.round(open * STEPS) / STEPS;
  g.clearRect(0, 0, W, 512);
  if (k <= 0) return;
  const up = 250 * k, lo = 175 * k, L = 70, R = 954;
  const lens = () => { g.beginPath(); g.moveTo(L, cy); g.quadraticCurveTo(W / 2, cy - up * 1.55, R, cy); g.quadraticCurveTo(W / 2, cy + lo * 1.55, L, cy); g.closePath(); };
  g.save(); lens(); g.clip();
  // sclera, pale and cold, shaded under the upper lid
  g.fillStyle = "#eef2fa"; g.fillRect(0, 0, W, 512);
  const sh = g.createLinearGradient(0, cy - up, 0, cy + lo); sh.addColorStop(0, "rgba(70,80,120,0.55)"); sh.addColorStop(0.45, "rgba(70,80,120,0.05)"); sh.addColorStop(1, "rgba(70,80,120,0.18)");
  g.fillStyle = sh; g.fillRect(0, 0, W, 512);
  // iris: storm blue, lighter centre; lightning veins
  const ix = W / 2, iy = cy + 4, ir = 165;
  const ig = g.createRadialGradient(ix, iy, 20, ix, iy, ir);
  ig.addColorStop(0, "#d9e8ff"); ig.addColorStop(0.45, "#8fb0e6"); ig.addColorStop(0.85, "#4d6fae"); ig.addColorStop(1, "#2c3f72");
  g.fillStyle = ig; g.beginPath(); g.arc(ix, iy, ir, 0, Math.PI * 2); g.fill();
  const r = rng(7777);
  g.lineCap = "round"; g.lineJoin = "round";
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + r() * 0.3;
    let x = ix + Math.cos(a) * 58, y = iy + Math.sin(a) * 58;
    g.beginPath(); g.moveTo(x, y);
    for (let s = 0; s < 5; s++) { const rr = 58 + (s + 1) * 20; const aa = a + (r() - 0.5) * 0.35; x = ix + Math.cos(aa) * rr; y = iy + Math.sin(aa) * rr; g.lineTo(x, y); }
    g.strokeStyle = bolt ? "rgba(255,252,220,0.95)" : "rgba(235,243,255,0.55)"; g.lineWidth = bolt ? 7 : 4; g.stroke();
  }
  // pupil + highlights
  g.fillStyle = "#141a33"; g.beginPath(); g.arc(ix, iy, 56, 0, Math.PI * 2); g.fill();
  g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.ellipse(ix - 52, iy - 58, 26, 18, -0.5, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(ix + 40, iy + 34, 9, 0, Math.PI * 2); g.fill();
  g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.arc(ix, iy, ir, 0, Math.PI * 2); g.stroke();
  g.restore();
  // lid lines (thick upper lid, thin lower lid) and a few lashes
  g.strokeStyle = INK; g.lineCap = "round";
  g.lineWidth = 22; g.beginPath(); g.moveTo(L, cy); g.quadraticCurveTo(W / 2, cy - up * 1.55, R, cy); g.stroke();
  g.lineWidth = 10; g.beginPath(); g.moveTo(L, cy); g.quadraticCurveTo(W / 2, cy + lo * 1.55, R, cy); g.stroke();
  g.lineWidth = 12;
  for (let i = 1; i < 8; i++) {
    const u = i / 8, x = (1 - u) * (1 - u) * L + 2 * u * (1 - u) * (W / 2) + u * u * R, y = (1 - u) * (1 - u) * cy + 2 * u * (1 - u) * (cy - up * 1.55) + u * u * cy;
    const nx = (u - 0.5) * 0.9, len = 34 + 26 * Math.sin(Math.PI * u);
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + nx * len, y - len); g.stroke();
  }
});

export class SkyEye {
  dome: THREE.Mesh; eye: THREE.Mesh;
  private domeMat: THREE.MeshBasicMaterial; private eyeMat: THREE.MeshBasicMaterial;
  constructor(parent: THREE.Object3D, readonly center: V3, readonly width: number) {
    this.domeMat = new THREE.MeshBasicMaterial({ map: skyTex(), side: THREE.BackSide, fog: false, depthWrite: false });
    this.dome = new THREE.Mesh(new THREE.SphereGeometry(1600, 48, 24), this.domeMat);
    this.dome.layers.set(NOINK); this.dome.renderOrder = -10; this.dome.frustumCulled = false;
    this.eyeMat = new THREE.MeshBasicMaterial({ map: eyeTex(0, false), transparent: true, fog: false, depthWrite: false });
    this.eye = new THREE.Mesh(new THREE.PlaneGeometry(width, width / 2), this.eyeMat);
    this.eye.layers.set(NOINK); this.eye.renderOrder = -9; this.eye.position.set(...center);
    parent.add(this.dome, this.eye);
  }
  /** dim = 0 (hot noon) .. 1 (cold, threatened); open 0..1; bolt = veins flash */
  set(cam: THREE.Camera, dim: number, open: number, bolt: boolean) {
    this.dome.position.copy(cam.position);
    const c = 1 - 0.32 * dim;
    this.domeMat.color.setRGB(c * (1 - 0.1 * dim), c * (1 - 0.04 * dim), c);
    this.eye.visible = open > 0.01;
    if (this.eye.visible) { this.eyeMat.map = eyeTex(open, bolt); this.eye.lookAt(cam.position); }
  }
  /** a point on the lower lid (where the single drop forms at the very end) */
  lowerLid(): V3 {
    this.eye.updateMatrixWorld(true);
    const p = this.eye.localToWorld(new THREE.Vector3(0, -0.139 * this.width, 0)); // lowest point of the lower lid when fully open
    return [p.x, p.y, p.z];
  }
}
