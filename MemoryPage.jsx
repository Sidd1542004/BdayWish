import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";


/* ══════════════════════════════════════════════════════════════════
   MEMORY DATA — swap src URLs for real photos
══════════════════════════════════════════════════════════════════ */
const MEMORIES = [
  { id: 1, src: "/Photos/P1.jpeg", label: "The Ethereal Muse" },
  { id: 2, src: "/Photos/P2.jpeg", label: "The Beloved Sweetheart" },
  { id: 3, src: "/Photos/P3.jpeg", label: "The Bold Vixen" },
  { id: 4, src: "/Photos/P4.jpeg", label: "MoonLight Baby" },
  { id: 5, src: "/Photos/P5.jpeg", label: "The Lunar Goddess" },
  { id: 6, src: "/Photos/P6.jpeg", label: "The Dark Duchess" },
  { id: 7, src: "/Photos/P7.jpeg", label: "The Soft Intellectual" },
  { id: 8, src: "/Photos/P8.jpeg", label: "Warm Hug" },
  { id: 9, src: "/Photos/P9.jpeg", label: "The Dreamy Romantic" },
  { id: 10, src: "/Photos/P10.jpeg", label: "proposal anniversary" },
];

/* ══════════════════════════════════════════════════════════════════
   CSS — all keyframe animations injected once
   Matches the requested .stars / .twinkling / .clouds pattern,
   confined to SkySection (25vh). Moon lives inside SkySection.
══════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; overflow: hidden; }

  /* ── Page root: vertical flex, full viewport ── */
  .mp-root {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* ══════════════════════════════════════════════
     SKY SECTION — top 25vh
  ══════════════════════════════════════════════ */
  .sky-section {
    position: relative;
    width: 100%;
    height: 25vh;
    flex-shrink: 0;
    overflow: hidden;
    /* Deep night sky gradient */
    background: linear-gradient(180deg,
      #000407 0%,
      #010b18 25%,
      #030e22 55%,
      #071228 80%,
      #0c1630 100%
    );
    z-index: 0;
  }

  /* Stars layer — static tiled dots */
  .sky-section .stars {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Ccircle cx='42'  cy='18'  r='0.9' fill='rgba(220,230,255,0.90)'/%3E%3Ccircle cx='127' cy='38'  r='1.3' fill='rgba(230,235,255,0.95)'/%3E%3Ccircle cx='203' cy='12'  r='0.7' fill='rgba(210,220,255,0.80)'/%3E%3Ccircle cx='315' cy='48'  r='1.1' fill='rgba(225,232,255,0.88)'/%3E%3Ccircle cx='412' cy='22'  r='0.8' fill='rgba(215,225,255,0.85)'/%3E%3Ccircle cx='74'  cy='72'  r='1.4' fill='rgba(235,238,255,0.92)'/%3E%3Ccircle cx='168' cy='88'  r='0.6' fill='rgba(200,215,255,0.75)'/%3E%3Ccircle cx='248' cy='65'  r='1.2' fill='rgba(228,233,255,0.90)'/%3E%3Ccircle cx='356' cy='92'  r='0.9' fill='rgba(218,228,255,0.82)'/%3E%3Ccircle cx='452' cy='75'  r='1.5' fill='rgba(238,240,255,0.95)'/%3E%3Ccircle cx='19'  cy='118' r='0.8' fill='rgba(210,222,255,0.78)'/%3E%3Ccircle cx='108' cy='142' r='1.1' fill='rgba(226,232,255,0.88)'/%3E%3Ccircle cx='222' cy='115' r='0.7' fill='rgba(205,218,255,0.72)'/%3E%3Ccircle cx='295' cy='138' r='1.3' fill='rgba(232,236,255,0.92)'/%3E%3Ccircle cx='388' cy='125' r='0.9' fill='rgba(220,229,255,0.84)'/%3E%3Ccircle cx='467' cy='148' r='0.6' fill='rgba(208,220,255,0.76)'/%3E%3Ccircle cx='55'  cy='175' r='1.2' fill='rgba(230,235,255,0.90)'/%3E%3Ccircle cx='145' cy='195' r='0.8' fill='rgba(215,226,255,0.82)'/%3E%3Ccircle cx='265' cy='182' r='1.4' fill='rgba(236,239,255,0.94)'/%3E%3Ccircle cx='338' cy='165' r='0.7' fill='rgba(207,219,255,0.74)'/%3E%3Ccircle cx='428' cy='188' r='1.0' fill='rgba(223,231,255,0.86)'/%3E%3Ccircle cx='32'  cy='228' r='0.9' fill='rgba(212,224,255,0.80)'/%3E%3Ccircle cx='118' cy='242' r='1.1' fill='rgba(228,234,255,0.88)'/%3E%3Ccircle cx='215' cy='255' r='0.6' fill='rgba(203,216,255,0.70)'/%3E%3Ccircle cx='308' cy='238' r='1.3' fill='rgba(234,237,255,0.92)'/%3E%3Ccircle cx='395' cy='252' r='0.8' fill='rgba(218,228,255,0.82)'/%3E%3Ccircle cx='478' cy='235' r='1.2' fill='rgba(229,235,255,0.90)'/%3E%3Ccircle cx='62'  cy='288' r='0.7' fill='rgba(209,221,255,0.76)'/%3E%3Ccircle cx='155' cy='275' r='1.0' fill='rgba(224,232,255,0.86)'/%3E%3Ccircle cx='242' cy='302' r='1.4' fill='rgba(237,240,255,0.94)'/%3E%3Ccircle cx='355' cy='285' r='0.9' fill='rgba(216,227,255,0.82)'/%3E%3Ccircle cx='438' cy='295' r='0.6' fill='rgba(206,218,255,0.72)'/%3E%3Ccircle cx='88'  cy='338' r='1.1' fill='rgba(227,233,255,0.88)'/%3E%3Ccircle cx='182' cy='325' r='0.8' fill='rgba(214,225,255,0.80)'/%3E%3Ccircle cx='278' cy='348' r='1.3' fill='rgba(233,237,255,0.92)'/%3E%3Ccircle cx='372' cy='335' r='0.7' fill='rgba(208,220,255,0.74)'/%3E%3Ccircle cx='462' cy='352' r='1.5' fill='rgba(239,241,255,0.96)'/%3E%3Ccircle cx='28'  cy='378' r='0.9' fill='rgba(215,226,255,0.82)'/%3E%3Ccircle cx='132' cy='392' r='1.2' fill='rgba(230,235,255,0.90)'/%3E%3Ccircle cx='228' cy='405' r='0.6' fill='rgba(204,217,255,0.71)'/%3E%3Ccircle cx='325' cy='388' r='1.0' fill='rgba(224,231,255,0.86)'/%3E%3Ccircle cx='415' cy='402' r='0.8' fill='rgba(217,228,255,0.82)'/%3E%3Ccircle cx='485' cy='378' r='1.3' fill='rgba(233,237,255,0.92)'/%3E%3Ccircle cx='72'  cy='438' r='0.7' fill='rgba(209,221,255,0.76)'/%3E%3Ccircle cx='168' cy='452' r='1.1' fill='rgba(227,233,255,0.88)'/%3E%3Ccircle cx='262' cy='465' r='0.9' fill='rgba(220,230,255,0.84)'/%3E%3Ccircle cx='358' cy='448' r='1.4' fill='rgba(236,239,255,0.94)'/%3E%3Ccircle cx='448' cy='462' r='0.6' fill='rgba(205,218,255,0.72)'/%3E%3C/svg%3E");
    background-size: 500px 500px;
    opacity: 0.95;
    pointer-events: none;
    z-index: 1;
  }

  /* Twinkling layer — pulsing opacity overlay */
  .sky-section .twinkling {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Ccircle cx='85'  cy='32'  r='1.6' fill='rgba(255,255,255,0.92)'/%3E%3Ccircle cx='192' cy='58'  r='1.1' fill='rgba(255,255,255,0.88)'/%3E%3Ccircle cx='304' cy='24'  r='1.8' fill='rgba(255,255,255,0.95)'/%3E%3Ccircle cx='422' cy='52'  r='1.3' fill='rgba(255,255,255,0.90)'/%3E%3Ccircle cx='48'  cy='95'  r='1.4' fill='rgba(255,255,255,0.86)'/%3E%3Ccircle cx='155' cy='112' r='1.7' fill='rgba(255,255,255,0.94)'/%3E%3Ccircle cx='275' cy='88'  r='1.2' fill='rgba(255,255,255,0.89)'/%3E%3Ccircle cx='385' cy='108' r='1.5' fill='rgba(255,255,255,0.92)'/%3E%3Ccircle cx='478' cy='78'  r='1.0' fill='rgba(255,255,255,0.85)'/%3E%3Ccircle cx='112' cy='158' r='1.6' fill='rgba(255,255,255,0.93)'/%3E%3Ccircle cx='238' cy='172' r='1.3' fill='rgba(255,255,255,0.87)'/%3E%3Ccircle cx='348' cy='145' r='1.8' fill='rgba(255,255,255,0.96)'/%3E%3Ccircle cx='458' cy='168' r='1.1' fill='rgba(255,255,255,0.88)'/%3E%3Ccircle cx='28'  cy='205' r='1.4' fill='rgba(255,255,255,0.90)'/%3E%3Ccircle cx='138' cy='222' r='1.7' fill='rgba(255,255,255,0.94)'/%3E%3Ccircle cx='255' cy='238' r='1.2' fill='rgba(255,255,255,0.87)'/%3E%3Ccircle cx='368' cy='215' r='1.5' fill='rgba(255,255,255,0.92)'/%3E%3Ccircle cx='468' cy='232' r='1.0' fill='rgba(255,255,255,0.84)'/%3E%3C/svg%3E");
    background-size: 500px 500px;
    animation: twinkling 6s ease-in-out infinite alternate;
    opacity: 0;
    pointer-events: none;
    z-index: 2;
  }
  @keyframes twinkling {
    0%   { opacity: 0.04; }
    20%  { opacity: 0.35; }
    45%  { opacity: 0.10; }
    70%  { opacity: 0.42; }
    100% { opacity: 0.06; }
  }

  /* Clouds layer — horizontal infinite scroll */
  .sky-section .clouds {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='200'%3E%3Cellipse cx='140' cy='85'  rx='125' ry='32' fill='rgba(148,165,205,0.042)'/%3E%3Cellipse cx='140' cy='78'  rx='82'  ry='20' fill='rgba(162,178,218,0.035)'/%3E%3Cellipse cx='140' cy='72'  rx='50'  ry='13' fill='rgba(172,185,222,0.028)'/%3E%3Cellipse cx='490' cy='55'  rx='170' ry='42' fill='rgba(144,162,202,0.038)'/%3E%3Cellipse cx='490' cy='46'  rx='112' ry='26' fill='rgba(158,174,215,0.032)'/%3E%3Cellipse cx='490' cy='40'  rx='68'  ry='16' fill='rgba(166,181,218,0.025)'/%3E%3Cellipse cx='820' cy='102' rx='148' ry='36' fill='rgba(146,163,204,0.040)'/%3E%3Cellipse cx='820' cy='94'  rx='96'  ry='22' fill='rgba(160,176,216,0.033)'/%3E%3Cellipse cx='820' cy='88'  rx='58'  ry='14' fill='rgba(168,183,220,0.026)'/%3E%3Cellipse cx='1100' cy='68' rx='132' ry='30' fill='rgba(142,160,200,0.036)'/%3E%3Cellipse cx='1100' cy='60' rx='85'  ry='18' fill='rgba(156,172,213,0.030)'/%3E%3Cellipse cx='1330' cy='90' rx='108' ry='28' fill='rgba(150,167,208,0.038)'/%3E%3Cellipse cx='1330' cy='82' rx='70'  ry='17' fill='rgba(162,178,218,0.030)'/%3E%3C/svg%3E");
    background-size: 1400px 200px;
    background-repeat: repeat-x;
    animation: moveClouds 200s linear infinite;
    filter: blur(7px);
    pointer-events: none;
    z-index: 2;
  }
  @keyframes moveClouds {
    from { background-position: 0 0; }
    to   { background-position: 1400px 0; }
  }

  /* Sky→Street blend seam — soft gradient fade at bottom of sky */
  .sky-fade {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 60%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(6, 5, 16, 0.55) 55%,
      rgba(9, 7, 18, 0.88) 80%,
      rgba(10, 9, 20, 1.0) 100%
    );
    pointer-events: none;
    z-index: 3;
  }

  /* Moon — inside sky section, right-aligned */
  .moon-wrap {
    position: absolute;
    top: clamp(8px, 2vh, 28px);
    right: clamp(36px, 9vw, 140px);
    pointer-events: none;
    z-index: 4;
    animation: moonAppear 2.4s ease-out both;
    animation-delay: 0.4s;
  }
  @keyframes moonAppear {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0);     }
  }
  .moon-halo-outer {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 200px; height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(210,200,155,0.12) 0%, transparent 68%);
    filter: blur(28px);
    animation: haloOuter 10s ease-in-out infinite alternate;
  }
  @keyframes haloOuter {
    from { opacity: 0.10; transform: translate(-50%,-50%) scale(1);    }
    to   { opacity: 0.22; transform: translate(-50%,-50%) scale(1.07); }
  }
  .moon-halo-inner {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 105px; height: 105px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(235,220,175,0.18) 0%, transparent 62%);
    filter: blur(12px);
    animation: haloInner 5.5s ease-in-out infinite alternate;
    animation-delay: 1.2s;
  }
  @keyframes haloInner {
    from { opacity: 0.20; }
    to   { opacity: 0.38; }
  }
  .moon-disc {
    position: relative;
    width: 68px; height: 68px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow:
      0 0 24px 8px rgba(220,210,165,0.17),
      0 0 52px 16px rgba(200,185,130,0.07);
  }

  /* ══════════════════════════════════════════════
     STREET SECTION — bottom 75vh
  ══════════════════════════════════════════════ */
  .street-section {
    position: relative;
    width: 100%;
    flex: 1;          /* fills remaining 75vh */
    min-height: 0;
    overflow: hidden;
    background: linear-gradient(
      to bottom,
      #0a0f1f 0%,
      #0b0c14 40%,
      #070608 100%
    );
    z-index: 0;
  }
`;

/* ══════════════════════════════════════════════════════════════════
   SKY SECTION — animated night sky: stars, twinkling, clouds, moon
   Replaces: NightSky(), Moon(), DriftingClouds()
══════════════════════════════════════════════════════════════════ */
function SkySection() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    /* Size canvas to match the SkySection container */
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    /* Build 120 stars — exact port of the provided snippet */
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      delta: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? -1 : 1),
    }));

    let rafId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#bb86fc';
        ctx.fill();
        star.alpha += star.delta;
        if (star.alpha <= 0 || star.alpha >= 1) star.delta *= -1;
      }
      rafId = requestAnimationFrame(draw);
    }
    draw();

    /* Re-scatter stars on resize so they always fill the section */
    const onResize = () => {
      resize();
      for (const star of stars) {
        star.x = Math.random() * canvas.width;
        star.y = Math.random() * canvas.height;
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="sky-section">
      {/* Canvas star field — purple-glow twinkling, runs in rAF loop */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      {/* Static tiled dot field (keeps subtle base star density) */}
      <div className="stars" />
      {/* Twinkling — pulsing brightness overlay */}
      <div className="twinkling" />
      {/* Clouds — horizontally drifting wisps */}
      <div className="clouds" />
      {/* Aurora Borealis — northern lights effect */}
      <AuroraBorealis />
      {/* Gradient blend toward street section */}
      <div className="sky-fade" />

      {/* Moon — right side of sky, with halo layers */}
      <div className="moon-wrap">

        {/* OUTER HALO */}
        <motion.div
          animate={{
            opacity: [0.05, 0.35, 0.05],
            scale: [1, 1.12, 1]
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,230,160,0.25) 0%, transparent 70%)",
            filter: "blur(30px)"
          }}
        />

        {/* INNER HALO */}
        <div className="moon-halo-inner" />

        {/* MOON DISC WITH REAL IMAGE */}
        <motion.div
          animate={{
            opacity: [0.9, 1, 0.9],
            boxShadow: [
              "0 0 28px 10px rgba(220,210,165,0.18)",
              "0 0 45px 18px rgba(255,225,160,0.35)",
              "0 0 28px 10px rgba(220,210,165,0.18)"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: "relative",
            width: 74,
            height: 74,
            borderRadius: "50%",
            overflow: "hidden"
          }}
        >
          <img
            src="/FullMoon2010-modified.jpg"
            alt="Moon"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block"
            }}
          />

          {/* Optional soft highlight layer for realism */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 30% 35%, rgba(255,255,255,0.12) 0%, transparent 50%)"
            }}
          />

          {/* Optional subtle crescent shadow for depth */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(115deg, transparent 40%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.65) 100%)"
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LISBON CITYSCAPE — romantic night-time silhouette background layer
   Alfama-inspired rooftops, domes, chimneys, flickering windows,
   drifting mist, and moonlight rim glow.
══════════════════════════════════════════════════════════════════ */
function LisbonCityscape() {
  /* ---------- flickering windows ---------- */
  const windows = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,            // % across the skyline
      y: 55 + Math.random() * 30,            // % vertical within bottom band
      w: 1.2 + Math.random() * 1.6,          // px-ish width
      h: 1.8 + Math.random() * 2.0,
      color: Math.random() > 0.5 ? "#ffcc66" : "#f5b942",
      dur: 2.5 + Math.random() * 5,          // flicker cycle
      delay: Math.random() * 6,
      minOp: 0.08 + Math.random() * 0.12,
      maxOp: 0.35 + Math.random() * 0.35,
    })), []);

  /* ---------- mist patches ---------- */
  const mistPatches = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      left: -10 + Math.random() * 100,
      width: 180 + Math.random() * 220,
      height: 32 + Math.random() * 28,
      y: 32 + Math.random() * 18,            // % from top of container
      dur: 40 + Math.random() * 50,
      delay: Math.random() * 20,
      opacity: 0.04 + Math.random() * 0.045,
    })), []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "55%",
        pointerEvents: "none",
        zIndex: 0.5,
        overflow: "hidden",
      }}
    >
      {/* ── Deep navy-to-midnight gradient sky behind silhouette ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(4,6,18,0.25) 30%, rgba(6,10,28,0.55) 60%, rgba(8,12,32,0.75) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── SVG Silhouette — Alfama rooftops, domes, chimneys ── */}
      <svg
        viewBox="0 0 1600 320"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.25,
          filter: "blur(1.5px)",
        }}
      >
        <defs>
          {/* Moonlight rim glow filter */}
          <filter id="lsb-rim" x="-8%" y="-8%" width="116%" height="116%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feFlood floodColor="#b8c4e8" floodOpacity="0.35" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feOffset dx="0" dy="-1.5" result="offset" />
            <feMerge>
              <feMergeNode in="offset" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Soft haze filter for the whole silhouette */}
          <filter id="lsb-haze">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* ── Back layer: distant rooftops (more blurred, lower) ── */}
        <g filter="url(#lsb-haze)" opacity="0.7">
          <path
            d="
              M0,260
              L60,258 L70,230 L80,228 L85,215 L95,218 L100,232 L120,235
              L140,233 L148,210 L155,208 L158,195 L162,208 L170,212 L180,234
              L220,236 L230,218 L240,215 L250,198 L255,196 L260,215 L270,220 L290,238
              L340,240 L350,224 L360,218 L365,202 L370,200 L375,218 L385,222 L400,238
              L460,236 L470,220 L478,212
              A18,18 0 0,1 510,212
              L518,220 L530,236
              L580,234 L590,222 L598,216 L602,204 L608,202 L612,216 L620,220 L640,236
              L700,238 L710,222 L720,215 L730,200 L735,198 L740,215 L750,220 L770,238
              L820,240 L830,224 L835,218 L840,204
              A22,22 0 0,1 880,204
              L885,218 L890,224 L900,240
              L960,236 L970,218 L978,212 L982,196 L988,194 L992,212 L1000,218 L1020,238
              L1080,240 L1090,222 L1100,216 L1105,198 L1110,196 L1115,216 L1125,222 L1140,240
              L1200,238 L1210,220 L1220,214 L1225,200 L1230,198 L1235,214 L1245,220 L1260,238
              L1320,236 L1330,222 L1340,218
              A16,16 0 0,1 1370,218
              L1380,222 L1390,236
              L1440,238 L1450,220 L1460,216 L1465,202 L1470,200 L1475,216 L1485,220 L1500,238
              L1560,240 L1570,228 L1580,224 L1590,218 L1600,220
              L1600,320 L0,320 Z
            "
            fill="#080c1a"
          />
        </g>

        {/* ── Front layer: closer Alfama rooftops with rim glow ── */}
        <g filter="url(#lsb-rim)" opacity="0.9">
          <path
            d="
              M0,280
              L40,278 L50,262 L58,258 L62,242 L68,240 L72,258 L82,264 L100,278
              L130,276 L140,258 L146,252 L150,238 L156,236 L160,252 L168,258 L180,276
              L200,274 L208,260 L212,256 L215,244 L218,240 L218,232 L222,224 L226,232
              L226,240 L230,256 L238,260 L248,274
              L280,276 L290,262 L298,256 L302,244 L306,242 L310,256 L318,262 L330,276
              L370,278 L380,264 L388,258 L392,248 L396,246 L396,238 L400,236 L404,238
              L404,246 L408,248 L412,258 L420,264 L430,278
              L470,276 L478,260
              A24,24 0 0,1 530,260
              L538,276
              L580,278 L588,264 L596,258 L600,248 L604,246 L608,258 L616,264 L630,278
              L660,276 L668,262 L674,256 L678,240 L682,238 L686,256 L694,262 L710,276
              L740,278 L748,264 L756,258 L760,246 L764,244 L764,234 L768,226 L772,234
              L772,244 L776,258 L784,264 L794,278
              L830,276 L838,262 L846,258 L850,248
              A20,20 0 0,1 886,248
              L890,258 L898,262 L908,276
              L940,278 L948,264 L956,256 L960,244 L964,242 L968,256 L976,264 L990,278
              L1020,276 L1028,262 L1034,258 L1038,244 L1042,242 L1042,232 L1046,226
              L1050,232 L1050,242 L1054,258 L1062,262 L1074,276
              L1110,278 L1118,264 L1126,258 L1130,248 L1134,246 L1138,258 L1146,264 L1160,278
              L1200,276 L1208,260
              A22,22 0 0,1 1256,260
              L1264,276
              L1300,278 L1308,264 L1316,258 L1320,246 L1324,244 L1328,258 L1336,264 L1348,278
              L1380,276 L1388,260 L1396,254 L1400,240 L1404,238 L1408,254 L1416,260 L1430,278
              L1470,276 L1478,262 L1486,256 L1490,244 L1494,242 L1494,234 L1498,228 L1502,234
              L1502,242 L1506,256 L1514,262 L1526,276
              L1560,278 L1568,264 L1576,260 L1580,252 L1584,250 L1588,260 L1596,264 L1600,278
              L1600,320 L0,320 Z
            "
            fill="#0a0e1e"
          />
        </g>

        {/* ── Chimney accents ── */}
        <g opacity="0.6" filter="url(#lsb-haze)">
          <rect x="62" y="232" width="6" height="12" rx="1" fill="#0a0e1e" />
          <rect x="218" y="218" width="8" height="18" rx="1" fill="#0a0e1e" />
          <rect x="396" y="228" width="8" height="14" rx="1" fill="#0a0e1e" />
          <rect x="764" y="226" width="8" height="14" rx="1" fill="#0a0e1e" />
          <rect x="1042" y="224" width="8" height="14" rx="1" fill="#0a0e1e" />
          <rect x="1494" y="226" width="8" height="12" rx="1" fill="#0a0e1e" />
          {/* Small chimney tops */}
          <rect x="60" y="230" width="10" height="3" rx="1" fill="#0c1020" />
          <rect x="216" y="216" width="12" height="3" rx="1" fill="#0c1020" />
          <rect x="394" y="226" width="12" height="3" rx="1" fill="#0c1020" />
          <rect x="762" y="224" width="12" height="3" rx="1" fill="#0c1020" />
          <rect x="1040" y="222" width="12" height="3" rx="1" fill="#0c1020" />
          <rect x="1492" y="224" width="12" height="3" rx="1" fill="#0c1020" />
        </g>
      </svg>

      {/* ── Flickering warm windows ── */}
      {windows.map((w) => (
        <motion.div
          key={`lsb-win-${w.id}`}
          animate={{
            opacity: [w.minOp, w.maxOp, w.minOp * 1.3, w.maxOp * 0.8, w.minOp],
          }}
          transition={{
            duration: w.dur,
            delay: w.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${w.x}%`,
            top: `${w.y}%`,
            width: w.w,
            height: w.h,
            borderRadius: 0.6,
            background: w.color,
            boxShadow: `0 0 ${w.w * 3}px ${w.w}px ${w.color}44, 0 0 ${w.w * 6}px ${w.w * 2}px ${w.color}22`,
            filter: "blur(0.8px)",
          }}
        />
      ))}

      {/* ── Drifting mist patches above rooftops ── */}
      {mistPatches.map((m) => (
        <motion.div
          key={`lsb-mist-${m.id}`}
          animate={{
            x: [0, 60, -30, 40, 0],
            opacity: [m.opacity * 0.5, m.opacity, m.opacity * 0.7, m.opacity * 0.9, m.opacity * 0.5],
          }}
          transition={{
            duration: m.dur,
            delay: m.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: `${m.left}%`,
            top: `${m.y}%`,
            width: m.width,
            height: m.height,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(160,175,210,0.35) 0%, rgba(140,155,195,0.15) 40%, transparent 70%)",
            filter: "blur(18px)",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── Moonlight rim highlight strip along top of front silhouette ── */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: 0,
          right: 0,
          height: 3,
          opacity: 0.06,
          background:
            "linear-gradient(90deg, transparent 2%, rgba(180,195,230,0.5) 15%, rgba(200,210,240,0.7) 30%, transparent 50%, rgba(190,205,235,0.6) 70%, rgba(180,195,230,0.4) 85%, transparent 98%)",
          filter: "blur(2px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   AMBIENT GLOW — warm central golden pool (street section)
══════════════════════════════════════════════════════════════════ */
function AmbientGlow() {
  return (
    <div style={{
      position: "absolute", inset: 0,
      pointerEvents: "none", zIndex: 2,
    }}>
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.30, 0.48, 0.30] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "45%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(240px, 46vw, 580px)",
          height: "clamp(240px, 46vw, 580px)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,190,45,0.09) 0%, rgba(185,105,22,0.03) 50%, transparent 72%)",
          filter: "blur(52px)",
        }}
      />
      {/* Floor reflection pool */}
      <motion.div
        animate={{ opacity: [0.38, 0.60, 0.38], scaleX: [1, 1.06, 1] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
        style={{
          position: "absolute", bottom: "8%", left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(220px, 42vw, 540px)", height: 48,
          background: "radial-gradient(ellipse, rgba(218,162,32,0.14) 0%, transparent 70%)",
          filter: "blur(22px)", borderRadius: "50%",
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FLOATING PARTICLES — sparse golden dust motes (street section)
══════════════════════════════════════════════════════════════════ */
function FloatingParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 26 }, (_, i) => ({
      id: i,
      x: 12 + Math.random() * 76,
      y: 15 + Math.random() * 72,
      size: Math.random() * 2.4 + 0.6,
      dur: 8 + Math.random() * 10,
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 20,
      opacity: 0.08 + Math.random() * 0.28,
    })), []);

  return (
    <div style={{
      position: "absolute", inset: 0,
      pointerEvents: "none", zIndex: 3, overflow: "hidden",
    }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, p.opacity, p.opacity * 0.5, p.opacity, 0],
            y: [`${p.y}%`, `${p.y - 12}%`, `${p.y - 5}%`, `${p.y - 15}%`],
            x: [`${p.x}%`, `${p.x + p.drift * 0.35}%`, `${p.x + p.drift}%`],
          }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: p.size, height: p.size, borderRadius: "50%",
            background: p.size > 2 ? "radial-gradient(circle, #ffe9a0, #d4a018)" : "rgba(255,235,155,0.9)",
            boxShadow: p.size > 2 ? `0 0 ${p.size * 4}px ${p.size}px rgba(255,210,60,0.24)` : "none",
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   COBBLESTONE GROUND PLANE (street section)
══════════════════════════════════════════════════════════════════ */
function GroundPlane() {
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: "28%",
      zIndex: 3, pointerEvents: "none",
      background: "linear-gradient(0deg, rgba(8,5,2,0.98) 0%, rgba(10,7,5,0.68) 50%, transparent 100%)",
      overflow: "hidden",
    }}>
      <svg
        style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "100%", opacity: 0.058 }}
        viewBox="0 0 1000 200" preserveAspectRatio="none"
      >
        {[185, 160, 128, 88, 44, 8].map((y, i) => (
          <line key={`h${i}`} x1="0" y1={y} x2="1000" y2={y}
            stroke="#c8a050" strokeWidth={i === 0 ? 0.9 : 0.45} />
        ))}
        {[-280, -90, 58, 195, 330, 460, 570, 690, 810, 940, 1080, 1240].map((x, i) => (
          <line key={`v${i}`}
            x1={500 + (x - 500) * 0.07} y1="0"
            x2={x} y2="200"
            stroke="#c8a050" strokeWidth="0.4" />
        ))}
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   STREET LAMP — ornate Lisbon-style SVG (left or right)
   Positioned fixed relative to viewport, layered over street section.
══════════════════════════════════════════════════════════════════ */
function StreetLamp({ side, delay }) {
  const L = side === "left";
  const uid = side;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 2.6, ease: "easeOut" }}
      style={{
        position: "fixed",
        bottom: 0,
        [L ? "left" : "right"]: "clamp(0px, 2vw, 28px)",
        zIndex: 4,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: L ? "flex-start" : "flex-end",
      }}
    >
      {/* Ground pool glow */}
      <motion.div
        animate={{ opacity: [0.20, 0.90, 0.20], scaleX: [0.92, 1.18, 0.92] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: delay + 0.8 }}
        style={{
          position: "absolute", bottom: 0,
          [L ? "left" : "right"]: 0,
          width: 300, height: 70,
          background: "radial-gradient(ellipse, rgba(255,185,40,0.40) 0%, rgba(255,160,30,0.15) 45%, transparent 72%)",
          filter: "blur(20px)", borderRadius: "50%",
          transformOrigin: "center bottom",
        }}
      />

      {/* Lantern halo — intense flicker */}
      <motion.div
        animate={{
          opacity: [0.25, 1, 0.30, 1, 0.28, 0.95, 0.25],
          scale: [0.88, 1.15, 0.90, 1.12, 0.92, 1.08, 0.88],
        }}
        transition={{
          duration: 5, repeat: Infinity, ease: "easeInOut",
          delay: delay + 0.5,
          times: [0, 0.18, 0.35, 0.52, 0.68, 0.84, 1],
        }}
        style={{
          position: "absolute",
          top: "clamp(28px, 5%, 52px)",
          [L ? "left" : "right"]: "clamp(-34px, -3.5vw, -16px)",
          width: "clamp(130px, 17vw, 200px)",
          height: "clamp(130px, 17vw, 200px)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,220,85,0.55) 0%, rgba(255,180,40,0.28) 35%, rgba(255,155,28,0.10) 60%, transparent 75%)",
          filter: "blur(22px)",
          transformOrigin: "center",
        }}
      />

      {/* Volumetric light cone */}
      <motion.div
        animate={{ opacity: [0.15, 0.85, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: delay + 0.2 }}
        style={{
          position: "absolute",
          top: "clamp(84px, 14%, 112px)",
          [L ? "left" : "right"]: "clamp(8px, 1.5vw, 20px)",
          width: 0, height: 0,
          borderLeft: L ? "none" : "clamp(75px, 12vw, 140px) solid transparent",
          borderRight: L ? "clamp(75px, 12vw, 140px) solid transparent" : "none",
          borderTop: "clamp(140px, 25vw, 260px) solid rgba(255,185,42,0.12)",
          filter: "blur(24px)",
        }}
      />

      {/* Side ambient ray */}
      <motion.div
        animate={{ opacity: [0.05, 0.45, 0.05] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay + 1.4 }}
        style={{
          position: "absolute",
          top: "clamp(52px, 9%, 78px)",
          [L ? "left" : "right"]: "clamp(-36px, -3.5vw, -18px)",
          width: "clamp(110px, 15vw, 170px)",
          height: "clamp(80px, 12vw, 130px)",
          background: `radial-gradient(ellipse at ${L ? "80%" : "20%"} 20%, rgba(255,215,80,0.40) 0%, rgba(255,190,50,0.12) 40%, transparent 70%)`,
          filter: "blur(26px)", borderRadius: "50%",
        }}
      />

      {/* SVG LAMP BODY */}
      <svg
        width="clamp(68px, 8.8vw, 114px)"
        viewBox="0 0 120 548"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", filter: "drop-shadow(0 8px 26px rgba(0,0,0,0.82))" }}
      >
        <defs>
          <linearGradient id={`pole${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0e0c08" />
            <stop offset="22%" stopColor="#28200f" />
            <stop offset="58%" stopColor="#1e1a0e" />
            <stop offset="100%" stopColor="#0c0a06" />
          </linearGradient>
          <linearGradient id={`iron${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#181410" />
            <stop offset="50%" stopColor="#2c2618" />
            <stop offset="100%" stopColor="#121008" />
          </linearGradient>
          <radialGradient id={`glow${uid}`} cx="50%" cy="46%" r="55%">
            <stop offset="0%" stopColor="#fffbe8" stopOpacity="1" />
            <stop offset="20%" stopColor="#ffe060" stopOpacity="0.96" />
            <stop offset="55%" stopColor="#e89820" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#a05c10" stopOpacity="0.05" />
          </radialGradient>
          <radialGradient id={`inner${uid}`} cx="45%" cy="38%" r="52%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.17" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="33" y="526" width="54" height="19" rx="6.5" fill="#0e0c08" />
        <rect x="37" y="514" width="46" height="14" rx="4.5" fill="#141008" />
        <rect x="41" y="503" width="38" height="13" rx="3.5" fill="#181410" />
        <ellipse cx="60" cy="503" rx="21" ry="5.5" fill="#1e1a0e" />
        <ellipse cx="60" cy="500" rx="15.5" ry="3.5" fill="#242018" />

        <rect x="55.5" y="106" width="9" height="400" rx="4.5" fill={`url(#pole${uid})`} />
        <rect x="56" y="106" width="2.2" height="400" rx="1" fill="rgba(255,255,255,0.046)" />

        <rect x="51" y="296" width="18" height="9" rx="4.5" fill="#1c1810" />
        <rect x="52" y="301" width="16" height="4" rx="2" fill="#262018" />
        <ellipse cx="60" cy="300" rx="10" ry="3" fill="#2e2816" />

        <rect x="50" y="150" width="20" height="11" rx="5.5" fill="#201c12" />
        <rect x="49" y="157" width="22" height="7" rx="3.5" fill="#2a2416" />
        <ellipse cx="60" cy="157" rx="12.5" ry="3.5" fill="#322c1a" />

        <path
          d={L
            ? "M60,159 C60,173 60,182 57,192 C53,208 40,216 30,222 C19,228 13,238 13,251 C13,262 22,269 33,269 C43,269 51,262 53,253"
            : "M60,159 C60,173 60,182 63,192 C67,208 80,216 90,222 C101,228 107,238 107,251 C107,262 98,269 87,269 C77,269 69,262 67,253"
          }
          stroke={`url(#iron${uid})`} strokeWidth="8" strokeLinecap="round" fill="none"
        />
        <path
          d={L
            ? "M60,159 C60,173 60,182 57,192 C53,208 40,216 30,222 C19,228 13,238 13,251"
            : "M60,159 C60,173 60,182 63,192 C67,208 80,216 90,222 C101,228 107,238 107,251"
          }
          stroke="rgba(255,255,255,0.036)" strokeWidth="2" strokeLinecap="round" fill="none"
        />

        <circle cx={L ? 53 : 67} cy="253" r="8.5" fill="#1c1810" />
        <circle cx={L ? 53 : 67} cy="253" r="6" fill="#28221a" />
        <circle cx={L ? 53 : 67} cy="253" r="2.5" fill="#181410" />

        <path d={L ? "M55,162 C46,160 37,163 33,168 C29,175 33,183 39,182 C45,182 50,177 50,172" : "M65,162 C74,160 83,163 87,168 C91,175 87,183 81,182 C75,182 70,177 70,172"} stroke="#201c12" strokeWidth="5.5" strokeLinecap="round" fill="none" />
        <path d={L ? "M55,162 C46,160 37,163 33,168 C29,175 33,183 39,182" : "M65,162 C74,160 83,163 87,168 C91,175 87,183 81,182"} stroke="rgba(255,255,255,0.030)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d={L ? "M55,169 C49,173 43,179 42,186 C40,193 44,197 50,195 C55,193 55,188 53,184" : "M65,169 C71,173 77,179 78,186 C80,193 76,197 70,195 C65,193 65,188 67,184"} stroke="#1a1610" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        <rect x={L ? 47 : 63} y="68" width="10" height="188" rx="5" fill="#181410" />
        <rect x={L ? 47.5 : 63.5} y="68" width="2.2" height="188" rx="1" fill="rgba(255,255,255,0.036)" />

        <path d="M29,71 L60,48 L91,71 Z" fill="#141010" />
        <path d="M32,71 L60,51 L88,71 Z" fill="#1e1812" />
        <line x1="60" y1="51" x2={L ? "32" : "88"} y2="71" stroke="#282018" strokeWidth="1.5" opacity="0.65" />

        <rect x="57.5" y="30" width="5" height="20" rx="2.5" fill="#141010" />
        <circle cx="60" cy="29" r="5.5" fill="#1c1812" />
        <circle cx="60" cy="29" r="3" fill="#242018" />
        <circle cx="60" cy="29" r="1.2" fill="#302a1a" />
        <rect x="58.2" y="22" width="3.6" height="9" rx="1.8" fill="#181410" />
        <rect x="55" y="26" width="10" height="2.8" rx="1.4" fill="#181410" />

        <rect x="28" y="69" width="64" height="7.5" rx="3.5" fill="#141010" />
        <rect x="26" y="72" width="68" height="3" rx="1.5" fill="#1a1610" />

        <rect x="31" y="76.5" width="58" height="64" rx="2" fill={`url(#glow${uid})`} opacity="0.97" />
        <rect x="31" y="76.5" width="58" height="64" rx="2" fill={`url(#inner${uid})`} />

        <rect x="57.5" y="76.5" width="5" height="64" fill="#121010" opacity="0.48" />
        <rect x="75" y="76.5" width="3" height="64" fill="#121010" opacity="0.28" />
        <rect x="42" y="76.5" width="3" height="64" fill="#121010" opacity="0.28" />
        <rect x="31" y="97" width="58" height="3" fill="#121010" opacity="0.36" />
        <rect x="31" y="118" width="58" height="2" fill="#121010" opacity="0.26" />

        <path d="M31,77 Q60,63 89,77" stroke="#121010" strokeWidth="1.5" fill="none" opacity="0.58" />
        <rect x="28" y="73" width="6" height="68" rx="3" fill="#131010" />
        <rect x="86" y="73" width="6" height="68" rx="3" fill="#131010" />

        <rect x="27" y="139" width="66" height="7" rx="3.5" fill="#141010" />
        <rect x="29" y="143" width="62" height="3" rx="1.5" fill="#181410" />

        <path d="M46,146 Q60,160 74,146 Z" fill="#131010" />
        <circle cx="60" cy="160" r="6.5" fill="#181410" />
        <circle cx="60" cy="160" r="4.2" fill="#201a12" />
        <circle cx="60" cy="160" r="2" fill="#2a2418" />
      </svg>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MEMORY ITEM — single carousel card with depth-aware rendering
══════════════════════════════════════════════════════════════════ */
function MemoryItem({ memory, angle, radius, isHovered, onHover, onLeave, onClick, isActive }) {
  const rad = (angle * Math.PI) / 180;
  const facing = Math.cos(rad);
  const backness = (1 - facing) / 2;

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%", left: "50%",
        width: "clamp(128px, 15.5vw, 196px)",
        height: "clamp(168px, 20.5vw, 255px)",
        marginLeft: `calc(clamp(128px, 15.5vw, 196px) / -2)`,
        marginTop: `calc(clamp(168px, 20.5vw, 255px) / -2)`,
        transform: `rotateY(${angle}deg) translateZ(${radius}px) ${isHovered ? "scale(1.10)" : isActive ? "scale(1.06) translateZ(28px)" : "scale(1)"}`,
        transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), filter 0.45s, opacity 0.45s",
        cursor: "pointer",
        filter: isHovered
          ? "brightness(1.18) drop-shadow(0 0 28px rgba(255,200,60,0.58))"
          : `brightness(${0.50 + facing * 0.50}) blur(${backness > 0.65 ? 1.5 : 0}px)`,
        opacity: isHovered ? 1 : 0.48 + facing * 0.52,
        zIndex: isHovered ? 10 : Math.round(facing * 5 + 5),
      }}
    >
      <div style={{
        width: "100%", height: "100%",
        borderRadius: 13, overflow: "hidden",
        position: "relative",
        border: isHovered
          ? "1px solid rgba(255,210,80,0.78)"
          : `1px solid rgba(255,210,80,${0.07 + facing * 0.20})`,
        boxShadow: isHovered
          ? "0 8px 44px rgba(0,0,0,0.80), 0 0 32px rgba(255,185,40,0.32)"
          : `0 ${4 + facing * 14}px ${20 + facing * 32}px rgba(0,0,0,${0.44 + backness * 0.40})`,
        background: "#07060f",
      }}>
        <img src={memory.src} alt={memory.label} loading="lazy"
          style={{
            width: "100%", height: "75%",
            objectFit: "cover", display: "block",
            transition: "transform 0.5s ease",
            transform: isHovered ? "scale(1.07)" : "scale(1)",
          }}
        />
        <div style={{
          height: "25%",
          background: "linear-gradient(180deg, #09081a 0%, #050410 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 10px",
        }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(9px, 1.05vw, 12px)",
            color: isHovered ? "#ffd97d" : `rgba(210,175,90,${0.35 + facing * 0.55})`,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            transition: "color 0.4s",
            textAlign: "center",
          }}>
            {memory.label}
          </span>
        </div>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,0.030) 0%, transparent 52%, rgba(0,0,0,0.10) 100%)",
          pointerEvents: "none", borderRadius: 13,
        }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MEMORY CAROUSEL — rAF-driven smooth 3D rotation, pause on hover
══════════════════════════════════════════════════════════════════ */
function MemoryCarousel({ memories }) {
  const count = memories.length;
  const angleStep = 360 / count;
  const [paused, setPaused] = useState(false);
  const [hoveredIdx, setHovered] = useState(null);
  const [activeIdx, setActive] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [radius, setRadius] = useState(340);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const rotRef = useRef(0);

  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      setRadius(vw < 480 ? 148 : vw < 768 ? 208 : vw < 1100 ? 272 : 340);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    const SPEED = 360 / 25000;
    const tick = (ts) => {
      if (lastTimeRef.current === null) lastTimeRef.current = ts;
      const dt = ts - lastTimeRef.current;
      lastTimeRef.current = ts;
      if (!paused && hoveredIdx === null) {
        rotRef.current = (rotRef.current + SPEED * dt) % 360;
        setRotation(rotRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, hoveredIdx]);

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{
        position: "absolute", bottom: -16, left: "50%",
        transform: "translateX(-50%)",
        width: radius * 2.1, height: 40,
        background: "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%)",
        filter: "blur(16px)", borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        width: radius * 2 + 220,
        height: "clamp(215px, 29vw, 315px)",
        perspective: "clamp(580px, 78vw, 1080px)",
        perspectiveOrigin: "50% 50%",
        position: "relative",
      }}>
        <div style={{
          width: "100%", height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotation}deg)`,
          willChange: "transform",
        }}>
          {memories.map((mem, i) => (
            <MemoryItem
              key={mem.id}
              memory={mem}
              angle={angleStep * i}
              radius={radius}
              isHovered={hoveredIdx === i}
              isActive={activeIdx === i}
              onHover={() => { setHovered(i); setPaused(true); }}
              onLeave={() => { setHovered(null); setPaused(false); }}
              onClick={() => setActive(p => p === i ? null : i)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {hoveredIdx !== null && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: 28,
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: "clamp(11px, 1.25vw, 14px)",
              color: "rgba(210,175,90,0.62)",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            {memories[hoveredIdx]?.label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CAPTION — ornamental serif text reveal
══════════════════════════════════════════════════════════════════ */
function Caption() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 13, textAlign: "center", padding: "0 24px" }}
    >
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 2.9, duration: 1.0, ease: "easeOut" }}
        style={{ width: "clamp(55px, 11vw, 115px)", height: 1, background: "linear-gradient(90deg, transparent, rgba(210,160,40,0.68), transparent)", transformOrigin: "center" }}
      />
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1.2 }}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic",
          fontSize: "clamp(14px, 2.1vw, 21px)",
          color: "rgba(232,197,112,0.88)",
          lineHeight: 1.68, maxWidth: 500, margin: 0,
          textShadow: "0 2px 22px rgba(200,150,30,0.22)",
        }}
      >
        "Every memory shines a little brighter
        <br />because of you."
      </motion.p>
      <motion.span
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 3.7, duration: 1.0 }}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(9px, 1.1vw, 12px)",
          color: "rgba(178,138,58,0.48)",
          letterSpacing: "0.36em",
          textTransform: "uppercase",
        }}
      >

        <motion.span
          animate={{ backgroundPosition: ["200% 0", "0 0"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{
            background: "linear-gradient(90deg, #B28A3A, #FFF2AD, #B28A3A)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
          }}
        >
          — with love
        </motion.span>

      </motion.span>
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 3.9, duration: 1.0, ease: "easeOut" }}
        style={{ width: "clamp(55px, 11vw, 115px)", height: 1, background: "linear-gradient(90deg, transparent, rgba(210,160,40,0.68), transparent)", transformOrigin: "center" }}
      />
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MEMORY PARTICLES — floating hearts & stars matching mood of memories
   Hearts for romantic labels, stars for special moments
══════════════════════════════════════════════════════════════════ */
function MemoryParticles() {
  const particles = useMemo(() => {
    const romanticWords = ["beloved", "sweetheart", "romantic", "hug", "love", "muse", "moonlight", "proposal"];
    const isRomantic = (label) => romanticWords.some(w => label.toLowerCase().includes(w));

    return Array.from({ length: 28 }, (_, i) => {
      const memIdx = i % MEMORIES.length;
      const romantic = isRomantic(MEMORIES[memIdx].label);
      return {
        id: i,
        type: romantic ? "heart" : "star",
        x: 8 + Math.random() * 84,
        startY: 75 + Math.random() * 20,
        endY: 5 + Math.random() * 30,
        size: romantic ? (10 + Math.random() * 10) : (6 + Math.random() * 8),
        dur: 14 + Math.random() * 16,
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 20,
        opacity: 0.35 + Math.random() * 0.35,
        rotate: Math.random() * 360,
        rotateEnd: Math.random() * 720 - 360,
      };
    });
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 4, overflow: "hidden" }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          animate={{
            top: [`${p.startY}%`, `${p.endY}%`],
            left: [`${p.x}%`, `${p.x + p.drift}%`],
            opacity: [0, p.opacity, p.opacity * 0.6, p.opacity * 0.8, 0],
            rotate: [p.rotate, p.rotateEnd],
            scale: [0.4, 1, 0.7, 1.1, 0.3],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
          }}
        >
          {p.type === "heart" ? (
            <svg viewBox="0 0 24 24" fill="none" width={p.size} height={p.size}>
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="rgba(255,120,150,0.85)"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" width={p.size} height={p.size}>
              <path
                d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6L12 2z"
                fill="rgba(255,215,80,0.8)"
              />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MEMORY TRAILS — glowing trails that follow carousel rotation
══════════════════════════════════════════════════════════════════ */
function MemoryTrails() {
  const trails = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      angle: (i / 8) * 360,
      color: [
        "rgba(255,200,60,0.35)",
        "rgba(255,150,80,0.30)",
        "rgba(200,160,255,0.25)",
        "rgba(255,120,140,0.30)",
        "rgba(100,200,255,0.25)",
        "rgba(255,220,100,0.32)",
        "rgba(180,140,255,0.28)",
        "rgba(255,180,120,0.30)",
      ][i],
      width: 220 + Math.random() * 140,
      dur: 20 + Math.random() * 10,
      delay: i * 1.2,
    })), []);

  return (
    <div style={{
      position: "absolute",
      top: "42%", left: "50%",
      transform: "translate(-50%, -50%)",
      width: 0, height: 0,
      pointerEvents: "none",
      zIndex: 4,
    }}>
      {trails.map(t => (
        <motion.div
          key={t.id}
          animate={{
            rotate: [t.angle, t.angle + 360],
            opacity: [0, 0.8, 0.4, 0.9, 0],
          }}
          transition={{
            rotate: { duration: t.dur, repeat: Infinity, ease: "linear" },
            opacity: { duration: t.dur / 2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: t.delay },
          }}
          style={{
            position: "absolute",
            top: -3,
            left: -t.width / 2,
            width: t.width,
            height: 4,
            background: `linear-gradient(90deg, transparent 5%, ${t.color} 50%, transparent 95%)`,
            filter: "blur(4px)",
            borderRadius: 4,
            transformOrigin: `${t.width / 2}px 3px`,
          }}
        />
      ))}
      {/* Central glow hub */}
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: -50, left: -50,
          width: 100, height: 100,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,200,60,0.3) 0%, rgba(255,180,80,0.1) 40%, transparent 70%)",
          filter: "blur(14px)",
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   AURORA BOREALIS — northern lights dancing across the sky
══════════════════════════════════════════════════════════════════ */
function AuroraBorealis() {
  const bands = useMemo(() => [
    { id: 0, color1: "rgba(80,200,170,0.22)",  color2: "rgba(40,180,140,0.10)",  top: "0%",  height: "55%", dur: 22, delay: 0,   skewRange: 12  },
    { id: 1, color1: "rgba(100,140,255,0.18)", color2: "rgba(80,120,220,0.08)",  top: "5%",  height: "48%", dur: 28, delay: 3,   skewRange: 15  },
    { id: 2, color1: "rgba(160,100,255,0.15)", color2: "rgba(130,80,220,0.07)",  top: "0%",  height: "60%", dur: 25, delay: 6,   skewRange: 10  },
    { id: 3, color1: "rgba(80,220,180,0.18)",  color2: "rgba(60,200,160,0.08)",  top: "8%",  height: "42%", dur: 30, delay: 9,   skewRange: 18  },
    { id: 4, color1: "rgba(120,160,255,0.14)", color2: "rgba(100,130,240,0.06)", top: "3%",  height: "50%", dur: 20, delay: 2,   skewRange: 14  },
  ], []);

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      zIndex: 1,
      overflow: "hidden",
    }}>
      {bands.map(b => (
        <motion.div
          key={b.id}
          animate={{
            opacity: [0, 0.7, 0.3, 0.9, 0.4, 0],
            skewX: [-b.skewRange, b.skewRange, -b.skewRange * 0.5, b.skewRange * 0.7, -b.skewRange],
            x: ["-8%", "5%", "-3%", "8%", "-8%"],
            scaleY: [0.8, 1.3, 0.9, 1.4, 0.8],
          }}
          transition={{
            duration: b.dur,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: b.top,
            left: "-5%",
            right: "-5%",
            height: b.height,
            background: `linear-gradient(180deg, ${b.color1} 0%, ${b.color2} 40%, transparent 100%)`,
            filter: "blur(20px)",
            borderRadius: "50% 50% 0 0",
          }}
        />
      ))}

      {/* Vertical light pillars */}
      {[15, 35, 55, 75, 90].map((left, i) => (
        <motion.div
          key={`pillar-${i}`}
          animate={{
            opacity: [0, 0.25 + i * 0.03, 0.08, 0.20 + i * 0.03, 0],
            scaleX: [1, 2.5, 1.2, 2, 1],
            height: ["20%", "60%", "30%", "55%", "20%"],
          }}
          transition={{
            duration: 16 + i * 4,
            delay: i * 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: 0,
            left: `${left}%`,
            width: 4,
            background: `linear-gradient(180deg, rgba(${100 + i * 20},${200 - i * 10},${180 + i * 15},0.35) 0%, transparent 100%)`,
            filter: "blur(6px)",
            transformOrigin: "top center",
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   GRAIN OVERLAY — cinematic film texture
══════════════════════════════════════════════════════════════════ */
function GrainOverlay() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 97, opacity: 0.028,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: "180px 180px",
    }} />
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
   Layout:
     .mp-root (position:fixed, flex-column, 100vh)
       ├─ SkySection     25vh  — stars + twinkling + clouds + moon
       └─ StreetSection  75vh  — lamps + carousel + content
   Z-index map:
     SkySection layers      0–4
     StreetSection bg       0
     AmbientGlow            2
     FloatingParticles      3
     GroundPlane            3
     StreetLamps (fixed)    4
     Content                5
     GrainOverlay           97
     Vignette               98
══════════════════════════════════════════════════════════════════ */
export default function MemoryPage({ onBack }) {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <style>{`
        @keyframes btnShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
      `}</style>


      <motion.div
        className="mp-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      >
        {/* ── TOP 25vh: Animated night sky ── */}
        <SkySection />

        {/* ── BOTTOM 75vh: Romantic street scene ── */}
        <div className="street-section">

          {/* Lisbon cityscape silhouette — soft background layer */}
          <LisbonCityscape />

          {/* Subtle environment layers inside street section */}
          <AmbientGlow />
          <FloatingParticles />
          <MemoryParticles />
          <MemoryTrails />
          <GroundPlane />

          {/* Street lamps — fixed so they extend from bottom of viewport
              spanning both sections visually, z:4 behind carousel z:5 */}
          <StreetLamp side="left" delay={0.85} />
          <StreetLamp side="right" delay={1.15} />

          {/* Vignette overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 45%, transparent 24%, rgba(0,0,0,0.68) 100%)",
            pointerEvents: "none", zIndex: 98,
          }} />

          {/* ── MAIN CONTENT — centred within street section ── */}
          <div style={{
            position: "relative", zIndex: 5,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            height: "100%",
            gap: "clamp(10px, 2.2vh, 28px)",
            padding: "12px 0 10px",
          }}>
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: "center" }}
            >
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(8px, 1.1vw, 12px)",
                letterSpacing: "0.50em",
                textTransform: "uppercase",
                color: "rgba(175,140,60,0.50)",
                marginBottom: 7,
              }}>
                A gallery of moments
              </p>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(20px, 3.8vw, 44px)",
                fontWeight: 400,
                color: "rgba(234,204,134,0.92)",
                letterSpacing: "0.05em",
                lineHeight: 1.1,
                textShadow: "0 4px 48px rgba(200,150,30,0.28)",
              }}>
                Floating Memories
              </h1>
            </motion.div>

            {/* Carousel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.55, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%" }}
            >
              <MemoryCarousel memories={MEMORIES} />
            </motion.div>

            {/* Caption */}
            <Caption />

            {/* ── Back to Magical Switch button ── */}
            {onBack && (
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {/* Ambient glow behind button */}
                <motion.div
                  animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.08, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    width: 220,
                    height: 60,
                    borderRadius: "50%",
                    background: "radial-gradient(ellipse, rgba(249,200,70,0.22) 0%, transparent 70%)",
                    filter: "blur(18px)",
                    pointerEvents: "none",
                  }}
                />

                <motion.button
                  id="back-to-magical-switch"
                  whileHover={{
                    scale: 1.03,
                    boxShadow:
                      "0 0 28px 8px rgba(249,200,70,0.40), " +
                      "0 6px 36px rgba(0,0,0,0.65), " +
                      "inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onBack}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    fontSize: "clamp(14px, 2.2vw, 18px)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "transparent",
                    backgroundImage:
                      "linear-gradient(90deg, #fff9e0 0%, #ffd700 40%, #ffffff 50%, #ffd700 60%, #fff9e0 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    animation: "btnShimmer 4s linear infinite",
                    background:
                      "linear-gradient(135deg, rgba(249,200,70,0.15), rgba(232,140,26,0.10))",
                    border: "1.5px solid rgba(249,200,70,0.40)",
                    borderRadius: 30,
                    padding: "14px 40px",
                    cursor: "pointer",
                    boxShadow:
                      "0 0 18px 4px rgba(249,200,70,0.22), " +
                      "0 4px 24px rgba(0,0,0,0.55), " +
                      "inset 0 1px 0 rgba(255,255,255,0.12)",
                    transition: "box-shadow 0.4s, border-color 0.4s",
                    outline: "none",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  <span
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #fff9e0 0%, #ffd700 40%, #ffffff 50%, #ffd700 60%, #fff9e0 100%)",
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      animation: "btnShimmer 4s linear infinite",
                    }}
                  >
                    ✨ Back to Gift
                  </span>
                </motion.button>
              </motion.div>
            )}

          </div>
        </div>

        {/* Grain overlay — spans full viewport, topmost */}
        <GrainOverlay />
      </motion.div>
    </>
  );
} 