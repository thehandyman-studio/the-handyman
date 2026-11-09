// Episode 7 world: ONE scene graph for every shot - the elevator car at the origin, the 12th-floor hall and the shaft
// around it, the underground city (with the copy of the building at COPY_AT) and, far away at SURF, the building above
// with its street at dusk. update() shows the right place for the shot, poses the moving parts from story.ts, places
// the handyman (and the other one), and sets light, fog and grade. Pure function of (segment, frame).
import * as THREE from "three";
import { ShortWorld, FrameInfo } from "../../engine/Shell";
import { Rig, LightPreset } from "../../engine/light";
import { NOINK } from "../../engine/ink";
import { Cast } from "../../engine/people";
import { GradeParams } from "../../engine/grade";
import { ElevatorCar, Shaft, buildHall } from "./elevatorSet";
import { buildHero, buildSurface, Hero } from "./buildingSet";
import { buildUnderCity, UnderCity, COPY_AT } from "./undercity";
import { SHOTS, ACT, SURF, X, doorsAt, coverAt, driverAt, glow13, displayAt, lightAt, pressedAt, depthAt, lobbyOn } from "./story";

const base = (o: Partial<LightPreset>): LightPreset => ({
  az: 0, el: 40, lit: [1.4, 1.25, 1.05], shade: [0.36, 0.3, 0.32], lift: [0.05, 0.04, 0.05], lambert: 0.42, sideK: 0.82, term: 0.24,
  bounce: [0.03, 0.02, 0.0], sat: 1.0, charTint: [1.02, 0.96, 0.88], charShade: 0.86, charGrad: 0.08, bodyGrad: 0.22, sideTint: [0.9, 0.88, 0.95],
  sunCol: "#ffe2b8", sunI: 2.4, sky: "#e8d2b0", ground: "#5a4030", hemiI: 0.6, bias: -0.0003, normalBias: 0.01, ...o,
});
/** warm ceiling light inside the car (scaled by the flicker) */
const CAR_L = base({});
/** car with the doors open on the city: cold blue light pouring in, warm lamp behind */
const OPEN_L = base({ lit: [0.95, 1.05, 1.3], shade: [0.24, 0.27, 0.4], lift: [0.04, 0.05, 0.09], charTint: [0.86, 0.94, 1.1], charShade: 0.8, sideTint: [0.8, 0.86, 1.0], sunCol: "#b8c8ee", sky: "#8090b0", ground: "#30343c" });
/** the city: blue-grey cave light from above, deep cool shadows (warm only in the windows and lamps) */
const CITY_L = base({ lit: [0.78, 0.88, 1.1], shade: [0.16, 0.19, 0.29], lift: [0.03, 0.04, 0.07], lambert: 0.5, sat: 0.9, charTint: [0.84, 0.92, 1.08], charShade: 0.78, charGrad: 0.1, sideTint: [0.78, 0.84, 1.0], sunCol: "#a9bce6", sunI: 2.0, sky: "#56627a", ground: "#22252c", hemiI: 0.45, bias: -0.0004, normalBias: 0.02 });
/** the building above at dusk: warm low sun, violet shade */
const SURF_L = base({ lit: [1.45, 1.08, 0.82], shade: [0.3, 0.24, 0.42], lift: [0.05, 0.04, 0.09], bounce: [0.06, 0.03, 0.02], charTint: [1.04, 0.92, 0.84], sunCol: "#ffc890", sky: "#9a7aa8", ground: "#3a2a30", bias: -0.0004, normalBias: 0.02 });
/** close on the copy's lobby window: the warm lobby light on the other one */
const LOBBY_L = base({ lit: [1.25, 1.08, 0.88], shade: [0.3, 0.26, 0.3], charTint: [1.05, 0.95, 0.84], charShade: 0.88 });

const CAR_G: GradeParams = { ky: [0.02, 0.11, 0.28, 0.57, 0.82, 0.94, 1], sat: [0.85, 1.0, 1.06], tintS: [0.02, 0.0], tintM: [-0.005, 0.008], tintH: [-0.025, 0.02], vig: [0.34, 0.42] };
const CITY_G: GradeParams = { ky: [0.015, 0.09, 0.24, 0.52, 0.79, 0.93, 1], sat: [0.78, 0.92, 1.02], tintS: [0.045, -0.03], tintM: [0.012, -0.01], tintH: [-0.02, 0.025], vig: [0.38, 0.46] };
const SURF_G: GradeParams = { ky: [0.02, 0.11, 0.28, 0.57, 0.82, 0.94, 1], sat: [0.85, 1.0, 1.08], tintS: [0.035, -0.01], tintM: [0.0, 0.006], tintH: [-0.03, 0.025], vig: [0.32, 0.42] };

const SUN_CAR = new THREE.Vector3(0.15, 1, 0.25).normalize();
const SUN_OPEN = new THREE.Vector3(0.1, 0.55, 1).normalize();
const SUN_CITY = new THREE.Vector3(-0.35, 0.85, -0.4).normalize();
const SUN_SHAFT = new THREE.Vector3(-0.6, 0.4, 0.7).normalize();
const SHAFT_L = base({ lit: [1.25, 1.1, 0.95], shade: [0.22, 0.2, 0.26], sunI: 2.2 });
const SUN_SURF = new THREE.Vector3(-0.8, 0.32, 0.5).normalize();

export class ElevatorWorld implements ShortWorld {
  root = new THREE.Group();
  private car = new ElevatorCar();
  private hall = buildHall();
  private shaft = new Shaft();
  private city: UnderCity = buildUnderCity();
  private copy: Hero = buildHero();
  private above: Hero = buildHero();
  private street = buildSurface();
  private rig = new Rig(this.root);
  private cast: Cast;
  private focus = new THREE.Vector3();
  private carCasts: THREE.Object3D[] | null = null;
  private lit = base({});
  private fogCity = new THREE.Fog("#2a3444", 45, 560);
  private fogSurf = new THREE.Fog("#7a5a78", 160, 1400);
  private bgCity = new THREE.Color("#2a3444"); private bgBlack = new THREE.Color("#0c0a0c"); private bgSurf = new THREE.Color("#5a4a6a");
  constructor() {
    this.root.add(this.car.root, this.hall, this.shaft.root, this.city.root, this.copy.root, this.above.root, this.street);
    this.copy.root.position.set(...COPY_AT); this.copy.root.rotation.y = Math.PI;
    this.above.root.position.set(...SURF); this.street.position.set(...SURF);
    this.cast = new Cast(this.root, 3, true);
    this.root.traverse((o) => { if (o.layers.isEnabled(NOINK)) return; });
  }
  update(seg: number, f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene): FrameInfo {
    const r = SHOTS.inSeg(seg, f), x = r.x as X, env = x.env;
    // ---- camera ----
    const c = SHOTS.cam(r, f);
    cam.position.set(...c.pos); cam.up.set(0, 1, 0); cam.lookAt(...c.look); cam.rotateZ(c.roll);
    cam.fov = c.fov; cam.near = env === "city" || env === "surface" ? 0.05 : 0.02; cam.far = 4000; cam.updateProjectionMatrix(); cam.updateMatrixWorld(); cam.layers.enable(NOINK);
    // ---- places ----
    this.hall.visible = env === "hall";
    this.shaft.root.visible = env === "shaft";
    this.city.root.visible = env === "city"; this.copy.root.visible = env === "city";
    this.above.root.visible = env === "surface"; this.street.visible = env === "surface";
    this.car.root.visible = env !== "surface";
    this.shaft.at(depthAt(f));
    if (this.carCasts === null) { this.carCasts = []; this.car.root.traverse((o) => { if ((o as THREE.Mesh).isMesh) this.carCasts!.push(o); }); }
    for (const o of this.carCasts) o.castShadow = env !== "shaft"; // the car must not darken the shaft walls
    // ---- moving parts ----
    const d = displayAt(f), lamp = lightAt(f);
    this.car.pose({ doors: doorsAt(f), cover: coverAt(f), glow13: glow13(f), pressed: pressedAt(f), display: d.v, dispOn: d.on, light: lamp, driver: driverAt(f) });
    const lob = lobbyOn(f);
    this.copy.car.pose({ doors: 1, cover: 0, glow13: 0.8 * lob, pressed: 0, display: "13", dispOn: lob, light: lob, driver: null }); this.copy.setLobby(lob);
    this.above.car.pose({ doors: 1, cover: 0, glow13: 0, pressed: 0, display: "1", dispOn: 1, light: 1, driver: null }); this.above.setLobby(1);
    this.city.setGlow(x.glow ?? 1);
    // ---- characters ----
    const who = (x.who ?? []).filter((w) => w !== "leo2" || lob > 0.5);
    this.root.updateMatrixWorld(true);
    this.cast.update(ACT.people(f, who), cam, f / 30);
    // ---- light, fog, background ----
    this.focus.set(...(r.focus?.(f) ?? c.look));
    const dist = cam.position.distanceTo(this.focus), rad = Math.max(4, Math.min(320, dist * 1.4));
    const kind = x.light ?? (env === "city" ? "city" : env === "surface" ? "surface" : "car");
    if (kind === "car") { // the ceiling lamp drives the key light
      Object.assign(this.lit, CAR_L);
      const k = 0.35 + 0.65 * lamp; this.lit.lit = [CAR_L.lit[0] * k, CAR_L.lit[1] * k, CAR_L.lit[2] * k]; this.lit.sunI = CAR_L.sunI * k;
      this.rig.apply(this.lit, SUN_CAR, this.focus, Math.max(rad, 5));
    } else if (kind === "open") this.rig.apply(OPEN_L, SUN_OPEN, this.focus, Math.max(rad, 6));
    else if (kind === "shaft") this.rig.apply(SHAFT_L, SUN_SHAFT, this.focus, 30);
    else if (kind === "lobby") this.rig.apply(LOBBY_L, SUN_OPEN, this.focus, 12);
    else if (kind === "surface") this.rig.apply(SURF_L, SUN_SURF, this.focus, rad);
    else this.rig.apply(CITY_L, SUN_CITY, this.focus, rad);
    scene.fog = env === "city" ? this.fogCity : env === "surface" ? this.fogSurf : null;
    scene.background = env === "city" ? this.bgCity : env === "surface" ? this.bgSurf : this.bgBlack;
    const grade = kind === "city" || kind === "open" ? CITY_G : kind === "surface" ? SURF_G : CAR_G; // by light, so the loop end = frame 0
    return { focus: this.focus, cInf: r.dof ?? 0, grade };
  }
}
