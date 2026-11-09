# QA helper (scratch): exact shot table of Episode 7 from story.ts (shot-level nth/lead incl. negative leads)
import json, re, sys
src = open("src/videos/elevator-13/story.ts").read()
W = json.load(open(sys.argv[1])); total = int(sys.argv[2]); out = sys.argv[3]
norm = lambda t: re.sub(r"[^a-z0-9]", "", t.lower())
def idx(p, nth=0):
    p = [norm(x) for x in p.split()]; h = 0
    for i in range(len(W) - len(p) + 1):
        if all(norm(W[i + k]["w"]) == q for k, q in enumerate(p)):
            if h == nth: return i
            h += 1
    raise SystemExit(p)
defs = src[src.index("const DEFS"):src.index("export const SHOTS")]
S = []
for m in re.finditer(r'\{ name: "([^"]+)", place: "(\w+)", start: (null|"[^"]+")((?:, (?:nth|lead): -?\d+)*)(.*?)\n', defs):
    name, place, start, opts, rest = m.groups()
    lead = int(re.search(r"lead: (-?\d+)", opts).group(1)) if "lead" in opts else 2
    nth = int(re.search(r"nth: (\d+)", opts).group(1)) if "nth" in opts else 0
    tr = re.search(r'in: \{ type: "(\w+)"(?:, frames: (\d+))?', rest)
    a = 0 if start == "null" else max(0, round(W[idx(start.strip('"'), nth)]["s"] * 30) - lead)
    S.append({"name": name, "a": a, "in": tr.group(1) if tr else "cut", "n": int(tr.group(2)) if tr and tr.group(2) else 8})
for i, s in enumerate(S): s["b"] = S[i + 1]["a"] if i + 1 < len(S) else total; s["id"] = i + 1
meta = {"shots": [{"id": s["id"], "a": s["a"], "b": s["b"], "name": s["name"]} for s in S],
        "xfade": [[s["a"] - s["n"] // 2, s["a"] + s["n"] // 2] for s in S if s["in"] == "xfade"],
        "planned": [[s["a"] - s["n"] // 2, s["a"] + s["n"] // 2] for s in S if s["in"] in ("whip", "glide", "flash")]}
json.dump(meta, open(out, "w"), indent=1)
for s in S: print(f'{s["id"]:2d} {s["name"]:16s} {s["a"]:5d}-{s["b"]:5d} {(s["b"]-s["a"])/30:5.2f}s {s["in"]}')
