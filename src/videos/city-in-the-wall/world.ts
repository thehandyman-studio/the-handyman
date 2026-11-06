// "The City Hidden Inside a Wall" world: ONE scene graph with the room (real scale, far away at ROOM) and the miniature
// city. City shots: the city at 1:1 around the origin. Room shots: the same city group scaled 1:60 and placed right
// behind the hole in the room wall, so Leo sees the real thing through the opening. Pure function of (segment, frame).
import * as THREE from "three";
import { ShortWorld, FrameInfo } from "../../engine/Shell";
import { Rig, LightPreset } from "../../engine/light";
import { NOINK } from "../../engine/ink";
import { Cast } from "../../engine/people";
import { Crowd, CrowdMember, CrowdPose } from "../../engine/crowd";
import { crowdHuman } from "../../engine/castbible";
import { GRADES, GradeParams } from "../../engine/grade";
import { Outfit } from "../../engine/toon";
import { rng } from "../../engine/paint";
import { buildCity, poseImpact, poseCars, carPos, CitySet, HOLE_C, SQUARE } from "./citySet";
import { PLAZA_KEEP_OUT } from "./lookdev/cityV2";
import { buildRoom, RoomSet, ROOM, SCALE, WALL_Z, WALL_T, HOLE_Y } from "./roomSet";
import { SHOTS, ACT, setCar } from "./story";

const CITY_L: LightPreset = {
  az: 0, el: 40, lit: [1.25, 1.08, 0.9], shade: [0.26, 0.22, 0.32], lift: [0.05, 0.04, 0.08], lambert: 0.45, sideK: 0.8, term: 0.25,
  bounce: [0.03, 0.02, 0.0], sat: 1.05, charTint: [1.04, 0.95, 0.86], charShade: 0.84, charGrad: 0.08, bodyGrad: 0.22, sideTint: [0.85, 0.82, 0.95],
  sunCol: "#ffe3b8", sunI: 2.6, sky: "#5a4a66", ground: "#2a2026", hemiI: 0.45, bias: -0.0004, normalBias: 0.02,
};
const ROOM_L: LightPreset = {
  az: 0, el: 40, lit: [1.5, 1.42, 1.28], shade: [0.42, 0.4, 0.46], lift: [0.06, 0.06, 0.09], lambert: 0.4, sideK: 0.84, term: 0.25,
  bounce: [0.02, 0.015, 0.0], sat: 1.05, charTint: [1.0, 0.96, 0.92], charShade: 0.88, charGrad: 0.07, bodyGrad: 0.2, sideTint: [0.94, 0.92, 0.98],
  sunCol: "#fff1dc", sunI: 2.4, sky: "#f1e6d6", ground: "#8a6a50", hemiI: 0.7, bias: -0.0003, normalBias: 0.01,
};
const SUN_CITY = new THREE.Vector3(0.12, 0.62, 1).normalize(); // light pours in through the hole
const SUN_ROOM = new THREE.Vector3(0.75, 0.55, 0.45).normalize(); // window to the right of the camera
const BG = new THREE.Color("#1d161c");

// crowd: 10 looks x 6 poses (walk cycle 4, standing, ducking)
const POSES: CrowdPose[] = [
  ...[0, 0.25, 0.5, 0.75].map((ph, i): CrowdPose => ({ name: "walk" + i, opts: { legs: "walk", phase: ph } })),
  { name: "stand", opts: { legs: "stand" } },
  { name: "duck", opts: { legs: "wide", gesture: "scared", expr: "scared", lookUp: 1 } },
];

/** look-dev options (default = the approved test v1 look) */
export type CityWorldOpts = {
  build?: () => CitySet; light?: LightPreset; grade?: GradeParams; fog?: [string, number, number]; bg?: string;
  /** lens blur multiplier in the city (look-dev: stronger, more cinematic depth of field) */ dofK?: number;
  /** extra crowd members (seated people, people in windows) */ extra?: (t: number) => CrowdMember[];
  /** per-frame hook (light beams facing the camera, window glow per shot) */ tick?: (cam: THREE.Camera, t: number, shot: string, inCity: boolean) => void;
  looks?: Outfit[]; poses?: CrowdPose[];
  /** v2 crowd: pavement height, mirroring, size variation, standing variants, talking groups */
  crowdV2?: { pave: number; stand: number[]; carry: number; duck: number };
  /** pedestrians' distance from the street centre (default 3) */ walkSide?: number;
  /** story crowd beats (seconds): everyone freezes, looks up (a wave from the wall back), waves; pose indices;
   *  back = offset to the back-view versions of stand/look/wave (camera behind the crowd) */
  crowdFx?: { freeze: number; look: number; wave: number; lookPose: number; waveA: number; waveB: number; back: number };
  /** story hook every frame (sign, opposite wall, giant ...) */
  scene?: (w: { city: CitySet; room: RoomSet }, f: number, shot: string, cam: THREE.Camera) => void;
};
export class CityWorld implements ShortWorld {
  root = new THREE.Group();
  private city: CitySet; private room: RoomSet; private rig = new Rig(this.root);
  private cityCast: Cast; private roomCast: Cast; private crowd: Crowd;
  private holeSky = new THREE.Color(); private focus = new THREE.Vector3(); private fog = new THREE.Fog("#2a1f26", 60, 300); private fogShot = new THREE.Fog("#2a1f26", 60, 300);
  private seeds: { kind: number; a: number; b: number; c: number; look: number }[] = [];
  private roomCasts: THREE.Object3D[] | null = null;
  constructor(private o: CityWorldOpts = {}) {
    this.city = (o.build ?? buildCity)(); this.room = buildRoom();
    if (o.fog) this.fog = new THREE.Fog(o.fog[0], o.fog[1], o.fog[2]);
    this.root.add(this.city.root, this.room.root);
    this.cityCast = new Cast(this.city.root, 10, true); // sharp cards at any shot size
    this.roomCast = new Cast(this.room.root, 3, true);
    this.crowd = new Crowd(this.city.root, o.looks ?? Array.from({ length: 10 }, (_, i) => crowdHuman(i)), o.poses ?? POSES, 420);
    setCar((t) => carPos(this.city, 2, t));
    const r = rng(404);
    const nl = o.looks?.length ?? 10;
    for (let i = 0; i < 2500; i++) this.seeds.push({ kind: i < 1000 ? 0 : i < 1160 ? 1 : i < 1830 ? 2 : 3, a: r(), b: r(), c: r(), look: Math.floor(r() * nl) });
  }
  /** the crowd at time t: plaza (ducks right after the impact), square (milling), sidewalks of both street directions */
  private members(t0: number, impact: boolean, back = false): CrowdMember[] {
    const { streetsX, streetsZ } = this.city, out: CrowdMember[] = [], fx = this.o.crowdFx, side = this.o.walkSide ?? 3;
    const t = fx && t0 > fx.freeze ? fx.freeze : t0; // after "stopped" nobody moves
    const wrap = (v: number, lo: number, hi: number) => lo + ((((v - lo) % (hi - lo)) + (hi - lo)) % (hi - lo));
    for (const s of this.seeds) {
      const dir = s.c < 0.5 ? 1 : -1, sp = 1.1 + 0.6 * s.b;
      let x = 0, z = 0, walking = true;
      if (s.kind === 0) { // the square between the house rows (x +-42); nobody inside the pavilion, the market or the clock
        x = -42 + 84 * s.a; z = wrap(-30 + 48 * s.b + dir * sp * t * 0.6, -31, 26);
        for (const [x0, z0, x1, z1] of PLAZA_KEEP_OUT) if (x > x0 && x < x1 && z > z0 && z < z1) z = z1 + 1.5 + 3 * s.c > 27 ? z0 - 1.5 - 3 * s.c : z1 + 1.5 + 3 * s.c;
      }
      else if (s.kind === 1) { const ang = s.a * 6.283 + dir * t * 0.08, rad = 6.5 + 7 * s.b; x = SQUARE[0] + Math.cos(ang) * rad; z = SQUARE[2] + Math.sin(ang) * rad; walking = s.c > 0.35; }
      else if (s.kind === 2) { const sx = streetsX[Math.floor(s.a * streetsX.length)]; x = sx + (s.c < 0.5 ? -side : side); z = wrap(-34 - 230 * s.b + dir * sp * t, -265, -33); }
      else { const sz = streetsZ[Math.floor(s.a * streetsZ.length)]; z = sz + (s.c < 0.5 ? -side : side); x = wrap(-165 + 330 * s.b + dir * sp * t, -168, 168); }
      const dist = s.kind === 1 ? t * 1.1 : sp * t;
      let pose = walking ? Math.floor(((((dist / 1.5 + s.a) % 1) + 1) % 1) * 4) : 4; // safe for the negative loop clock
      const v2 = this.o.crowdV2;
      if (!v2) {
        if (impact && s.kind === 0 && t < 2.2) pose = 5;
        out.push({ pos: [x, 0, z], look: s.look, pose });
        continue;
      }
      // v2: a third of the plaza/square people stand in small talking groups, some carry things, sizes + mirroring vary
      if ((s.kind === 0 || s.kind === 1) && s.b < 0.33) {
        const g = Math.floor(s.a * 40), ga = g * 2.399, gx = s.kind ? SQUARE[0] + Math.cos(ga) * 11 : -50 + (g * 37) % 100, gz = s.kind ? SQUARE[2] + Math.sin(ga) * 11 : -28 + (g * 23) % 44;
        const side = s.c < 0.5 ? -1 : 1; x = gx + side * (0.7 + 0.3 * s.a); z = gz + (s.c - 0.5) * 1.2;
        pose = side < 0 ? v2.stand[2] : v2.stand[1];
      } else if (!walking) pose = v2.stand[Math.floor(s.a * v2.stand.length)];
      else if (s.c > 0.82) pose = v2.carry;
      if (impact && s.kind === 0 && t < 2.2) pose = v2.duck;
      if (fx) { // story beats: look up (a wave rolling back from the wall), then wave back (two alternating frames)
        const delay = Math.max(0, (30 - z) / 120) + s.a * 0.15;
        if (t0 > fx.look + delay) pose = fx.lookPose;
        if (t0 > fx.wave + delay * 0.6) pose = Math.abs(Math.floor((t0 - fx.wave) * 5 + s.a * 4)) % 2 ? fx.waveA : fx.waveB;
        if (back && pose >= fx.lookPose) pose += fx.back;
      }
      out.push({ pos: [x, s.kind >= 2 ? v2.pave : 0, z], look: s.look, pose, flip: s.c > 0.5 && pose < 4, scale: 0.93 + 0.13 * s.b });
    }
    return out;
  }
  update(seg: number, f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene): FrameInfo {
    const r = SHOTS.inSeg(seg, f), inCity = r.place === "city", fill = r.x?.fill ?? "city";
    const t = r.x?.clock ? r.x.clock(f) : f / 30; // city clock (the loop shot runs on the loop's own time)
    // ---- camera ----
    const c = SHOTS.cam(r, f);
    cam.position.set(...c.pos); cam.up.set(0, 1, 0); cam.lookAt(...c.look); cam.rotateZ(c.roll);
    cam.fov = c.fov; cam.near = inCity ? 0.1 : 0.02; cam.far = 3000; cam.updateProjectionMatrix(); cam.updateMatrixWorld(); cam.layers.enable(NOINK);
    // ---- which world: city at 1:1, or the room with the city at 1:60 behind the hole ----
    // the room is always there: in the city x60 right behind the city's (thick) wall, seen through the hole
    this.room.root.visible = true;
    const C = this.city.root, RM = this.room.root;
    this.room.holeWall.visible = !inCity;
    // behind the city's wall the x60 room must not throw shadows onto the wall (the shadow map's square edge showed)
    if (this.roomCasts === null) { this.roomCasts = []; this.room.root.traverse((o) => { if ((o as THREE.Mesh).isMesh && o.castShadow) this.roomCasts!.push(o); }); }
    for (const o of this.roomCasts) o.castShadow = !inCity;
    if (inCity) { RM.position.set(HOLE_C[0], HOLE_C[1] - HOLE_Y * 60, HOLE_C[2] + (WALL_T - WALL_Z) * 60); RM.scale.setScalar(60); }
    else { RM.position.set(...ROOM); RM.scale.setScalar(1); }
    if (inCity) { C.position.set(0, 0, 0); C.scale.setScalar(1); }
    else { C.position.set(ROOM[0] - HOLE_C[0] * SCALE, ROOM[1] + HOLE_Y - HOLE_C[1] * SCALE, ROOM[2] + WALL_Z - WALL_T - 0.003 - HOLE_C[2] * SCALE); C.scale.setScalar(SCALE); }
    C.visible = inCity || fill === "city";
    this.city.frontWall.visible = inCity; this.city.glow.visible = false; this.city.shaft.visible = false; // real room behind the hole; the shaft box reads as a dark slab from below
    this.city.cracks.visible = inCity; this.city.crackGlow.visible = inCity;
    for (const k of ["insulation", "bricks", "pipes"] as const) this.room.fill[k].visible = !inCity && fill === k;
    void HOLE_Y;
    // ---- motion in the city ----
    poseImpact(this.city, r.x?.tau ? r.x.tau(f) : r.x?.impact ? t : 99);
    this.city.plug.visible &&= inCity;
    const fx = this.o.crowdFx;
    poseCars(this.city, fx && t > fx.freeze ? fx.freeze : t);
    this.o.scene?.({ city: this.city, room: this.room }, f, r.name, cam);
    this.root.updateMatrixWorld(true);
    this.crowd.update(C.visible ? [...this.members(t, !!(r.x?.impact || r.x?.tau), !!r.x?.crowdBack), ...(this.o.extra?.(t) ?? [])] : [], cam);
    this.o.tick?.(cam, t, r.name, inCity);
    this.cityCast.update(inCity ? ACT.people(f, r.x?.city ?? (r.x?.impact ? ["t1", "t2", "t3", "t4"] : [])) : [], cam, t);
    this.roomCast.update(ACT.people(f, r.x?.room ?? (inCity ? [] : ["leo"])), cam, t);
    // ---- light, fog, background ----
    this.focus.set(...(r.focus?.(f) ?? c.look));
    if (inCity && r.x?.light !== "room") this.rig.apply(this.o.light ?? CITY_L, SUN_CITY, this.focus, 90);
    else if (inCity) this.rig.apply(ROOM_L, SUN_CITY, this.focus, 200); // looking up into the bright room
    else this.rig.apply(ROOM_L, SUN_ROOM, this.focus, 4);
    if (r.x?.fog) { this.fogShot.color.copy(this.fog.color); this.fogShot.near = r.x.fog[0]; this.fogShot.far = r.x.fog[1]; }
    scene.fog = inCity ? (r.x?.fog ? this.fogShot : this.fog) : null; scene.background = !inCity && r.x?.holeSky ? this.holeSky.set(r.x.holeSky) : this.o.bg ? new THREE.Color(this.o.bg) : BG; // holeSky: only the 4 frontal room shots
    return { focus: this.focus, cInf: (r.dof ?? 0) * (inCity ? this.o.dofK ?? 1 : 1), grade: inCity ? this.o.grade ?? GRADES.golden : GRADES.day };
  }
}
