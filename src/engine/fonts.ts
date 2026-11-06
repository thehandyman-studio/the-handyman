// Embedded open-licence fonts (public/fonts/, licence files next to them). Loaded once with the FontFace API; the
// render waits (delayRender) until the font is ready, so stills and videos never fall back to a system font.
// Nunito (SIL OFL 1.1, public/fonts/Nunito-OFL.txt): rounded heavy sans for mrABSURDLY captions and overlays.
import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

export const NUNITO = '"Nunito", "Arial Rounded MT Bold", sans-serif';
let loading: Promise<void> | null = null;
const loadNunito = () => loading ??= new FontFace("Nunito", `url(${staticFile("fonts/Nunito-Variable.ttf")})`, { weight: "200 1000" })
  .load().then((f) => { document.fonts.add(f); });

/** call in a composition: true once Nunito is usable */
export const useNunito = () => {
  const [ok, setOk] = useState(false);
  const [h] = useState(() => delayRender("font Nunito"));
  useEffect(() => { loadNunito().then(() => { setOk(true); continueRender(h); }); }, [h]);
  return ok;
};
