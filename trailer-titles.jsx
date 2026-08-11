/* CrashFest trailer title cards — continuous composition. */
const { useComposition, Shot, animate, Easing, clamp, CompositionStage } = window;

const INK = '#14100d';
const SAND = '#f4efe7';
const ORANGE = '#ff7a1a';
const BLACK_FACE = "'Archivo Black', sans-serif";
const MONO = "'JetBrains Mono', monospace";

const MOTION = {
  enter: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeOutExpo }),
  draw:  (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeInOutCubic }),
  pop:   (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeOutBack }),
};

/* Low-poly shards drifting behind everything — never unmounted, so they
   carry continuity across every hard cut. */
const SHARDS = [
  { w: 1180, h: 900, top: -180, left: -260, sp: 9,  op: 0.04, clip: 'polygon(0 0,100% 22%,72% 100%,0 78%)' },
  { w: 940,  h: 820, top: 260,  left: 1080, sp: -7, op: 0.032, clip: 'polygon(18% 0,100% 8%,100% 86%,0 100%)' },
  { w: 620,  h: 480, top: 640,  left: 520,  sp: 5,  op: 0.026, clip: 'polygon(0 40%,60% 0,100% 62%,34% 100%)' },
  { w: 460,  h: 360, top: -60,  left: 660,  sp: -4, op: 0.03, clip: 'polygon(0 55%,50% 0,100% 45%,52% 100%)' },
];

function Shards({ T }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {SHARDS.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: s.w, height: s.h, top: s.top,
          left: s.left + ((T * s.sp) % 420) - 210,
          background: `rgba(255,255,255,${s.op})`,
          clipPath: s.clip,
          transform: `rotate(${Math.sin(T * 0.4 + i) * 1.6}deg)`,
        }} />
      ))}
    </div>
  );
}

/* Diagonal wipe slab used as the entry gesture on every card. */
function Slab({ lt, color = ORANGE, from = 0.0, to = 0.36, skew = -9, top = -80, height = 1300 }) {
  const w = MOTION.enter(0, 2400, from, to)(lt);
  return (
    <div style={{
      position: 'absolute', left: -300, top, height, width: w,
      background: color, transform: `skewX(${skew}deg)`,
    }} />
  );
}

function SpeedLines({ lt, color = 'rgba(255,255,255,0.5)' }) {
  const rows = [0.02, 0.07, 0.11, 0.16];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {rows.map((d, i) => {
        const x = MOTION.enter(-700, 2400, d, d + 0.42)(lt);
        const o = clamp(1 - (lt - d) / 0.5, 0, 1);
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: 250 + i * 170,
            width: 520 + i * 120, height: 8 + (i % 2) * 5,
            background: color, opacity: o * 0.9, transform: 'skewX(-9deg)',
          }} />
        );
      })}
    </div>
  );
}

/* ---------- Card 1 : logo sting ---------- */
function LogoSting({ T, t0 }) {
  const lt = T - t0;
  const s = MOTION.enter(3.4, 1, 0.04, 0.52)(lt);
  const shake = lt > 0.52 && lt < 0.9 ? Math.sin((lt - 0.52) * 90) * (1 - (lt - 0.52) / 0.38) * 7 : 0;
  const creep = MOTION.draw(1, 1.05, 0.6, 2.6)(lt);
  const barW = MOTION.pop(0, 300, 0.62, 1.15)(lt);
  const tag = clamp((lt - 0.85) / 0.5, 0, 1);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Slab lt={lt} />
      <SpeedLines lt={lt} color="rgba(20,16,13,0.35)" />
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        transform: `translateX(${shake}px) scale(${s * creep})`,
      }}>
        <div style={{
          fontFamily: BLACK_FACE, fontSize: 190, lineHeight: 0.88, letterSpacing: '-0.03em',
          color: INK, transform: 'skewX(-9deg)',
        }}>CRASH<span style={{ color: SAND }}>FEST</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 30, transform: 'skewX(-9deg)' }}>
          <div style={{ width: barW, height: 12, background: INK }} />
          <div style={{
            fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: '0.34em',
            color: INK, opacity: tag, whiteSpace: 'nowrap',
          }}>TOP&mdash;DOWN DEMOLITION</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Cards 2-4 : mode names ---------- */
function ModeCard({ T, t0, label, sub, accent, index }) {
  const lt = T - t0;
  const x = MOTION.enter(-420, 0, 0.05, 0.46)(lt);
  const drift = MOTION.draw(0, 26, 0.46, 2.4)(lt);
  const shake = lt < 0.62 ? Math.sin(lt * 78) * clamp(1 - lt / 0.62, 0, 1) * 9 : 0;
  const rule = MOTION.pop(0, 620, 0.4, 0.95)(lt);
  const subClip = MOTION.draw(100, 0, 0.5, 1.0)(lt);
  const num = clamp((lt - 0.7) / 0.4, 0, 1);
  const twoLine = label.indexOf('\n') >= 0;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Slab lt={lt} color={accent} top={twoLine ? 250 : 330} height={twoLine ? 560 : 420} />
      <SpeedLines lt={lt} color="rgba(255,255,255,0.14)" />
      <div style={{
        position: 'absolute', left: 150, top: 0, bottom: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22,
        transform: `translate(${x + drift + shake}px,0)`,
      }}>
        <div style={{
          fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: '0.3em',
          color: 'rgba(20,16,13,0.55)', opacity: num,
        }}>MODE 0{index}</div>
        <div style={{
          fontFamily: BLACK_FACE, fontSize: twoLine ? 178 : 232, lineHeight: 0.86,
          letterSpacing: '-0.035em', color: INK, transform: 'skewX(-9deg)', whiteSpace: 'pre-line',
        }}>{label}</div>
        <div style={{ width: rule, height: 14, background: INK }} />
        <div style={{
          fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: '0.2em',
          color: INK, clipPath: `inset(0 ${subClip}% 0 0)`, whiteSpace: 'nowrap',
        }}>{sub}</div>
      </div>
    </div>
  );
}

/* ---------- Card 5 : feature callout ---------- */
function FeatureCard({ T, t0 }) {
  const lt = T - t0;
  const bigS = MOTION.pop(0.75, 1, 0.06, 0.55)(lt);
  const creep = MOTION.draw(1, 1.04, 0.55, 2.2)(lt);
  const line2 = MOTION.enter(60, 0, 0.4, 0.9)(lt);
  const o2 = clamp((lt - 0.4) / 0.4, 0, 1);
  const seats = [0, 1, 2, 3, 4, 5];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Slab lt={lt} color={SAND} to={0.32} />
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 34,
      }}>
        <div style={{
          fontFamily: BLACK_FACE, fontSize: 158, lineHeight: 0.88, color: INK,
          transform: `skewX(-9deg) scale(${bigS * creep})`, textAlign: 'center',
        }}>6 PLAYERS<br />ONE COUCH</div>
        <div style={{ display: 'flex', gap: 16, transform: `translateY(${line2}px)`, opacity: o2 }}>
          {seats.map((i) => {
            const on = clamp((lt - 0.55 - i * 0.08) / 0.2, 0, 1);
            const bot = false;
            return (
              <div key={i} style={{
                width: 92, height: 92,
                background: bot ? 'rgba(20,16,13,0.18)' : ORANGE,
                border: `5px solid ${INK}`,
                transform: `scale(${0.6 + on * 0.4})`, opacity: 0.25 + on * 0.75,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: BLACK_FACE, fontSize: 38, color: INK,
              }}>{bot ? 'B' : i + 1}</div>
            );
          })}
        </div>
        <div style={{
          fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: '0.24em',
          color: 'rgba(20,16,13,0.7)', opacity: o2,
        }}>LOCAL CO-OP &middot; STEAM REMOTE PLAY &middot; BOTS FILL THE REST</div>
      </div>
    </div>
  );
}

/* ---------- Card 6 : end card ---------- */
function EndCard({ T, t0 }) {
  const lt = T - t0;
  const s = MOTION.enter(2.2, 1, 0.02, 0.5)(lt);
  const creep = MOTION.draw(1, 1.03, 0.5, 3.4)(lt);
  const barW = MOTION.pop(0, 260, 0.55, 1.05)(lt);
  const pillY = MOTION.pop(90, 0, 0.8, 1.4)(lt);
  const pulse = 1 + Math.sin(Math.max(0, lt - 1.4) * 3.6) * 0.02;
  const o = clamp((lt - 0.8) / 0.4, 0, 1);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Slab lt={lt} to={0.34} />
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 30,
      }}>
        <div style={{
          fontFamily: BLACK_FACE, fontSize: 176, lineHeight: 0.88, letterSpacing: '-0.03em',
          color: INK, transform: `skewX(-9deg) scale(${s * creep})`,
        }}>CRASH<span style={{ color: SAND }}>FEST</span></div>
        <div style={{ width: barW, height: 12, background: INK }} />
        <div style={{
          transform: `translateY(${pillY}px) scale(${pulse})`, opacity: o,
          background: INK, color: SAND, padding: '24px 54px 20px',
          fontFamily: BLACK_FACE, fontSize: 52, letterSpacing: '0.02em',
        }}>WISHLIST ON STEAM</div>
        <div style={{
          fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: '0.3em',
          color: 'rgba(20,16,13,0.65)', opacity: o,
        }}>PC &middot; LOCAL MULTIPLAYER &middot; STEAM REMOTE PLAY</div>
      </div>
    </div>
  );
}

function Piece() {
  const { T, CUES } = useComposition();
  return (
    <div style={{ position: 'absolute', inset: 0, background: INK, overflow: 'hidden' }}>
      <Shards T={T} />
      <Shot from={CUES.Logo} to={CUES.Race}>
        <LogoSting T={T} t0={CUES.Logo} />
      </Shot>
      <Shot from={CUES.Race} to={CUES.Sumo}>
        <ModeCard T={T} t0={CUES.Race} index={1} label="RACE" sub="THREE LAPS. NO MERCY." accent={ORANGE} />
      </Shot>
      <Shot from={CUES.Sumo} to={CUES.Builder}>
        <ModeCard T={T} t0={CUES.Sumo} index={2} label="SUMO" sub="SHOVE OR BE SHOVED." accent="#f0c018" />
      </Shot>
      <Shot from={CUES.Builder} to={CUES.Feature}>
        <ModeCard T={T} t0={CUES.Builder} index={3} label={"TRACK\nBUILDER"} sub="BUILD BADLY. SUFFER." accent={ORANGE} />
      </Shot>
      <Shot from={CUES.Feature} to={CUES.End}>
        <FeatureCard T={T} t0={CUES.Feature} />
      </Shot>
      <Shot from={CUES.End} to={CUES.End + 3.4}>
        <EndCard T={T} t0={CUES.End} />
      </Shot>
    </div>
  );
}

function TrailerTitles() {
  return (
    <CompositionStage
      width={1920}
      height={1080}
      bg={INK}
      scenes={window.OM_SCENES}
      playback={window.OM_PLAYBACK}
    >
      <Piece />
    </CompositionStage>
  );
}

window.TrailerTitles = TrailerTitles;
