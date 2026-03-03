import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MemoryPage from "./MemoryPage";

/* ─── CONSTANTS ─────────────────────────────────────────────────── */
const BULB_COUNT = 11;
const CONFETTI_COLORS = ["#FFD700", "#FF6B6B", "#A8E6CF", "#FFB347", "#DDA0DD", "#87CEEB", "#FF69B4"];

/* ─── UTILS ──────────────────────────────────────────────────────── */
const lerp = (a, b, t) => a + (b - a) * t;
const catenary = (i, total) => {
  const x = i / (total - 1); // 0 → 1
  const dip = Math.sin(Math.PI * x) * 38; // max dip at center
  return dip;
};

/* ─── CONFETTI PIECE ─────────────────────────────────────────────── */
function ConfettiPiece({ color, delay }) {
  const x = Math.random() * 100;
  const rotation = Math.random() * 720 - 360;
  const size = Math.random() * 8 + 6;
  return (
    <motion.div
      initial={{ y: -20, x: `${x}vw`, opacity: 1, rotate: 0, scale: 1 }}
      animate={{ y: "110vh", rotate: rotation, opacity: [1, 1, 0], scale: [1, 0.8, 0.4] }}
      transition={{ duration: 3 + Math.random() * 2, delay, ease: "easeIn" }}
      style={{
        position: "fixed", top: 0, left: 0,
        width: size, height: size,
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
        background: color,
        pointerEvents: "none",
        zIndex: 999,
      }}
    />
  );
}

/* ─── PARTICLE ───────────────────────────────────────────────────── */
function Particle({ angle, distance, delay }) {
  const rad = (angle * Math.PI) / 180;
  const tx = Math.cos(rad) * distance;
  const ty = Math.sin(rad) * distance;
  return (
    <motion.div
      initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [0, tx * 0.5, tx],
        y: [0, ty * 0.5, ty],
        scale: [0, 1.2, 0.4],
      }}
      transition={{ duration: 2.5, delay, repeat: Infinity, repeatDelay: 1.5 + Math.random() }}
      style={{
        position: "absolute",
        width: 6, height: 6,
        borderRadius: "50%",
        background: `radial-gradient(circle, #FFE87C, #FFB347)`,
        boxShadow: "0 0 8px 2px #FFD700",
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── TOGGLE SWITCH ──────────────────────────────────────────────── */
function ToggleSwitch({ isOn, onToggle }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          color: "#b0a090",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(14px, 2.5vw, 18px)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        Click the switch to turn on / off
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
        onClick={onToggle}
        style={{
          position: "relative",
          width: 80, height: 44,
          borderRadius: 22,
          background: isOn
            ? "linear-gradient(135deg, #f9c846, #e88c1a)"
            : "linear-gradient(135deg, #2a2a3a, #1a1a2a)",
          border: isOn ? "2px solid #f9c84680" : "2px solid #ffffff20",
          cursor: "pointer",
          boxShadow: isOn
            ? "0 0 20px 6px #f9c84660, inset 0 0 8px #00000030"
            : "0 4px 20px #00000060, inset 0 0 8px #00000040",
          transition: "background 0.4s, border 0.4s, box-shadow 0.4s",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ x: isOn ? 38 : 4 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            position: "absolute",
            top: 4, width: 32, height: 32,
            borderRadius: "50%",
            background: isOn
              ? "radial-gradient(circle at 35% 35%, #fff9e0, #ffd700)"
              : "radial-gradient(circle at 35% 35%, #888, #444)",
            boxShadow: isOn
              ? "0 0 12px 4px #ffd70080"
              : "0 2px 8px #00000080",
          }}
        />
      </motion.div>
    </div>
  );
}

/* ─── SINGLE BULB ────────────────────────────────────────────────── */
function Bulb({ lit, delay, dipY }) {
  return (
    <motion.div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: dipY,
      }}
    >
      {/* Wire segment above bulb */}
      <div style={{ width: 2, height: 14, background: "#555", borderRadius: 1 }} />

      {/* Bulb cap */}
      <div style={{
        width: 10, height: 7,
        background: lit ? "#c0a060" : "#444",
        borderRadius: "2px 2px 0 0",
        transition: "background 0.5s",
      }} />

      {/* Bulb glass */}
      <motion.div
        animate={lit ? {
          boxShadow: [
            "0 0 8px 4px #FFE87C60, 0 0 20px 8px #FFB34730",
            "0 0 12px 6px #FFE87C80, 0 0 30px 12px #FFB34750",
            "0 0 9px 4px #FFE87C65, 0 0 22px 9px #FFB34735",
          ],
          background: ["#ffe090", "#fff3b0", "#ffe590"],
        } : {
          boxShadow: "none",
          background: "#2a2a2a",
        }}
        transition={lit ? {
          delay,
          duration: 0.4,
          boxShadow: { duration: 2, repeat: Infinity, repeatType: "mirror", delay: delay + 0.4 },
          background: { duration: 2, repeat: Infinity, repeatType: "mirror", delay: delay + 0.4 },
        } : { duration: 0.3 }}
        style={{
          width: 22, height: 28,
          borderRadius: "50% 50% 45% 45%",
          border: lit ? "1px solid #ffe09040" : "1px solid #333",
          transition: "border 0.5s",
        }}
      />
    </motion.div>
  );
}

/* ─── LIGHT ROPE ─────────────────────────────────────────────────── */
function LightRope({ isOn, onDone }) {
  const [litCount, setLitCount] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isOn) { setLitCount(0); return; }
    let count = 0;
    const light = () => {
      count++;
      setLitCount(count);
      if (count < BULB_COUNT) {
        timerRef.current = setTimeout(light, 220);
      } else {
        setTimeout(onDone, 400);
      }
    };
    timerRef.current = setTimeout(light, 300);
    return () => clearTimeout(timerRef.current);
  }, [isOn]);

  const bulbs = Array.from({ length: BULB_COUNT });

  return (
    <AnimatePresence>
      {isOn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 120,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-around",
            padding: "0 20px",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {/* Rope line */}
          <svg
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="ropeGlow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path
              d={`M 0,18 Q 50%,70 100%,18`}
              fill="none"
              stroke="#5a4a3a"
              strokeWidth="2"
              filter="url(#ropeGlow)"
            />
          </svg>

          {bulbs.map((_, i) => (
            <Bulb
              key={i}
              lit={i < litCount}
              delay={(i * 0.22)}
              dipY={catenary(i, BULB_COUNT)}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── GIFT LID ───────────────────────────────────────────────────── */
function GiftBox({ onOpen }) {
  const [opened, setOpened] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [confetti, setConfetti] = useState([]);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: Math.random() * 0.8,
    }));
    setConfetti(pieces);
    setTimeout(() => { setShowMessage(true); onOpen?.(); }, 900);
  };

  const particles = Array.from({ length: 14 }, (_, i) => ({
    angle: (i / 14) * 360,
    distance: 90 + Math.random() * 40,
    delay: Math.random() * 2,
  }));

  return (
    <>
      {/* Confetti */}
      {confetti.map(c => <ConfettiPiece key={c.id} color={c.color} delay={c.delay} />)}

      <motion.div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: opened ? "default" : "pointer",
          userSelect: "none",
        }}
        onClick={handleOpen}
        whileHover={!opened ? { scale: 1.04 } : {}}
        whileTap={!opened ? { scale: 0.97 } : {}}
      >
        {!showMessage ? (
          <motion.div
            style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
            animate={!opened ? { rotateY: [0, 8, -8, 0] } : {}}
            transition={!opened ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : {}}
          >
            {/* Particles */}
            {particles.map((p, i) => (
              <Particle key={i} angle={p.angle} distance={p.distance} delay={p.delay} />
            ))}

            {/* Lid */}
            <motion.div
              animate={opened ? { y: -120, rotateX: -30, opacity: 0 } : { y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "relative",
                zIndex: 2,
                width: 160,
                height: 42,
                background: "linear-gradient(135deg, #cc2244, #ff4466)",
                borderRadius: "8px 8px 0 0",
                boxShadow: "0 -4px 20px #cc224460",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Ribbon on lid */}
              <div style={{ position: "absolute", width: "100%", height: 10, background: "#ffd700", top: "50%", transform: "translateY(-50%)" }} />
              <div style={{ position: "absolute", height: "100%", width: 10, background: "#ffd700", left: "50%", transform: "translateX(-50%)" }} />
              {/* Bow */}
              <div style={{ position: "absolute", top: -22, zIndex: 3, display: "flex", gap: 4 }}>
                {[[-12, -4, 45], [12, -4, -45]].map(([x, y, rot], i) => (
                  <div key={i} style={{
                    width: 28, height: 18,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ffd700, #ffb300)",
                    transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
                  }} />
                ))}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 14, height: 14,
                  borderRadius: "50%",
                  background: "#ffd700",
                  zIndex: 4,
                }} />
              </div>
            </motion.div>

            {/* Box body */}
            <motion.div
              style={{
                width: 160, height: 140,
                background: "linear-gradient(160deg, #c41d40, #8b0025)",
                borderRadius: "0 0 12px 12px",
                boxShadow: "0 20px 60px #8b002560, inset 0 0 30px #00000020",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Ribbon vertical */}
              <div style={{ position: "absolute", width: 10, height: "100%", background: "#ffd700", left: "50%", transform: "translateX(-50%)" }} />
              {/* Inner light burst */}
              <AnimatePresence>
                {opened && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 3, opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8 }}
                    style={{
                      position: "absolute",
                      top: "50%", left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 80, height: 80,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, #fff9c4, #ffd70000)",
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {!opened && (
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  marginTop: 24,
                  color: "#c0a070",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(13px, 2vw, 16px)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                Tap to open
              </motion.p>
            )}
          </motion.div>
        ) : (
          /* ─── REVEAL MESSAGE ─── */
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              padding: "40px 32px",
              maxWidth: 420,
              textAlign: "center",
              background: "linear-gradient(135deg, #1a1010ee, #200a0aee)",
              borderRadius: 20,
              border: "1px solid #ffd70030",
              boxShadow: "0 0 60px #ffd70015, 0 20px 80px #00000080",
              backdropFilter: "blur(12px)",
            }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ fontSize: "clamp(40px, 8vw, 60px)" }}
            >
              ✨
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: "clamp(22px, 5vw, 34px)",
                color: "#ffd700",
                margin: 0,
                letterSpacing: "0.05em",
                lineHeight: 1.2,
              }}
            >
              A Gift For You
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(15px, 2.5vw, 19px)",
                color: "#e8d5b0",
                margin: 0,
                lineHeight: 1.7,
              }}
            >
              May every moment you unwrap be filled with warmth, wonder, and light.
              This little spark was made just for you. 🌟
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              style={{
                width: 60, height: 1,
                background: "linear-gradient(90deg, transparent, #ffd700, transparent)",
              }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(12px, 2vw, 14px)",
                color: "#9a8060",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              With love
            </motion.p>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}

/* ─── STARS BACKGROUND ───────────────────────────────────────────── */
function Stars() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    dur: 2 + Math.random() * 3,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map(s => (
        <motion.div
          key={s.id}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity }}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#ffffff",
          }}
        />
      ))}
    </div>
  );
}

/* ─── SHOOTING STARS ─────────────────────────────────────────────── */
const SHOOTING_STAR_CSS = `
  .shooting-stars-layer {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100vh;
    pointer-events: none;
    z-index: 2;
    overflow: hidden;
  }
  .shooting-stars-layer span {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(255,255,255,0.1),
                0 0 0 8px rgba(255,255,255,0.1),
                0 0 20px rgba(255,255,255,0.1);
    animation: shootingStar 3s linear infinite;
  }
  .shooting-stars-layer span::before {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 300px;
    height: 1px;
    background: linear-gradient(90deg, #fff, transparent);
  }
  @keyframes shootingStar {
    0%   { transform: rotate(315deg) translateX(0);       opacity: 1; }
    70%  {                                                  opacity: 1; }
    100% { transform: rotate(315deg) translateX(-1000px); opacity: 0; }
  }
  .shooting-stars-layer span:nth-child(1)  { top:0;     right:0;      left:initial; animation-delay:0s;    animation-duration:1s;    }
  .shooting-stars-layer span:nth-child(2)  { top:0;     right:80px;   left:initial; animation-delay:0.2s;  animation-duration:3s;    }
  .shooting-stars-layer span:nth-child(3)  { top:80px;  right:0px;    left:initial; animation-delay:0.4s;  animation-duration:2s;    }
  .shooting-stars-layer span:nth-child(4)  { top:0;     right:180px;  left:initial; animation-delay:0.6s;  animation-duration:1.5s;  }
  .shooting-stars-layer span:nth-child(5)  { top:0;     right:400px;  left:initial; animation-delay:0.8s;  animation-duration:2.5s;  }
  .shooting-stars-layer span:nth-child(6)  { top:0;     right:600px;  left:initial; animation-delay:1s;    animation-duration:3s;    }
  .shooting-stars-layer span:nth-child(7)  { top:300px; right:0px;    left:initial; animation-delay:1.2s;  animation-duration:1.75s; }
  .shooting-stars-layer span:nth-child(8)  { top:0px;   right:700px;  left:initial; animation-delay:1.4s;  animation-duration:1.25s; }
  .shooting-stars-layer span:nth-child(9)  { top:0px;   right:1000px; left:initial; animation-delay:0.75s; animation-duration:2.25s; }
  .shooting-stars-layer span:nth-child(10) { top:0px;   right:450px;  left:initial; animation-delay:2.75s; animation-duration:2.75s; }
`;

function ShootingStars({ isOn }) {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    if (!isOn) {
      setStars([]);
      return;
    }

    const interval = setInterval(() => {
      // Sometimes spawn 1 or 2 stars at the same time
      const spawnCount = Math.random() > 0.7 ? 2 : 1;

      for (let i = 0; i < spawnCount; i++) {
        const id = Math.random();
        const startX = Math.random() * (window.innerWidth + 200);
        const startY = Math.random() * window.innerHeight * 0.5; // Upper half sky

        const duration = 0.8 + Math.random() * 1.5;

        const newStar = {
          id,
          startX,
          startY,
          duration,
          size: 1.5 + Math.random() * 2.5,
          distance: 700 + Math.random() * 500,
        };

        setStars(prev => [...prev, newStar]);

        setTimeout(() => {
          setStars(prev => prev.filter(s => s.id !== id));
        }, duration * 1000);
      }
    }, 600 + Math.random() * 1000); // Shorter interval for more stars

    return () => clearInterval(interval);
  }, [isOn]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2,
        overflow: "hidden"
      }}
    >
      <AnimatePresence>
        {stars.map(star => (
          <motion.div
            key={star.id}
            initial={{
              opacity: 0,
              x: star.startX,
              y: star.startY,
              rotate: 315
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: star.startX - star.distance,
              y: star.startY + star.distance * 0.6
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: star.duration,
              ease: "easeOut"
            }}
            style={{
              position: "absolute",
              width: star.size,
              height: star.size,
              borderRadius: "50%",
              background: "white",
              boxShadow: "0 0 8px 2px rgba(255,255,255,0.6)"
            }}
          >
            {/* Tail */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                transform: "translateY(-50%)",
                width: 220,
                height: 1,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.9), transparent)"
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── FIREFLIES / FLOATING LANTERNS ─────────────────────────────── */
function Fireflies({ isOn }) {
  const flies = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      startY: 85 + Math.random() * 15,
      size: 2.5 + Math.random() * 4,
      dur: 12 + Math.random() * 18,
      delay: Math.random() * 8,
      drift: (Math.random() - 0.5) * 30,
      glow: 0.3 + Math.random() * 0.5,
    })), []);

  return (
    <AnimatePresence>
      {isOn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 3, overflow: "hidden" }}
        >
          {flies.map(f => (
            <motion.div
              key={f.id}
              animate={{
                y: [`${f.startY}vh`, `${f.startY - 40 - Math.random() * 30}vh`],
                x: [`${f.x}vw`, `${f.x + f.drift}vw`],
                opacity: [0, f.glow, f.glow * 0.4, f.glow, 0],
                scale: [0.6, 1, 0.8, 1.1, 0.5],
              }}
              transition={{
                duration: f.dur,
                delay: f.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                width: f.size,
                height: f.size,
                borderRadius: "50%",
                background: "radial-gradient(circle, #ffe8a0, #ffcc44)",
                boxShadow: `0 0 ${f.size * 3}px ${f.size}px rgba(255,200,60,0.35), 0 0 ${f.size * 6}px ${f.size * 2}px rgba(255,180,40,0.15)`,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── PARALLAX STARS ─────────────────────────────────────────────── */
function ParallaxStars() {
  const layers = useMemo(() => [
    { count: 40, speed: 0.015, sizeRange: [0.5, 1.2], opacity: 0.4 },
    { count: 30, speed: 0.03,  sizeRange: [1.0, 2.0], opacity: 0.6 },
    { count: 15, speed: 0.05,  sizeRange: [1.8, 3.0], opacity: 0.85 },
  ].map(layer => ({
    ...layer,
    stars: Array.from({ length: layer.count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: layer.sizeRange[0] + Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]),
    })),
  })), []);

  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const handleMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handleMove);

    const animate = () => {
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.04;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.04;

      const container = containerRef.current;
      if (container) {
        const layerEls = container.children;
        layers.forEach((layer, i) => {
          if (layerEls[i]) {
            const tx = posRef.current.x * layer.speed * 100;
            const ty = posRef.current.y * layer.speed * 100;
            layerEls[i].style.transform = `translate(${tx}px, ${ty}px)`;
          }
        });
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [layers]);

  return (
    <div ref={containerRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {layers.map((layer, li) => (
        <div key={li} style={{ position: "absolute", inset: "-20px", willChange: "transform" }}>
          {layer.stars.map(s => (
            <motion.div
              key={s.id}
              animate={{ opacity: [layer.opacity * 0.3, layer.opacity, layer.opacity * 0.3] }}
              transition={{ duration: 2 + Math.random() * 3, delay: Math.random() * 4, repeat: Infinity }}
              style={{
                position: "absolute",
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                borderRadius: "50%",
                background: "#fff",
                boxShadow: s.size > 2 ? `0 0 ${s.size * 2}px rgba(180,180,255,0.3)` : "none",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── SHARED AUDIO SINGLETON — persists across page transitions ── */
let _sharedAudio = null;
function getSharedAudio() {
  if (!_sharedAudio) {
    _sharedAudio = new Audio("/Photos/backgroundmusicforvideos-romantics-love-valentines-day-481993.mp3");
    _sharedAudio.loop = true;
    _sharedAudio.volume = 0.3;
  }
  return _sharedAudio;
}

/* ─── MUSIC TOGGLE ───────────────────────────────────────────────── */
function MusicToggle() {
  const [playing, setPlaying] = useState(() => {
    const audio = getSharedAudio();
    return !audio.paused;
  });

  useEffect(() => {
    const audio = getSharedAudio();

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Sync state on mount (audio may already be playing from previous page)
    setPlaying(!audio.paused);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      // Do NOT pause audio on unmount — let it keep playing across pages
    };
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = getSharedAudio();

    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.log('Audio play failed:', error);
      });
    }
  }, [playing]);

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      onClick={toggleMusic}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 100,
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: "1px solid rgba(255,215,0,0.3)",
        background: playing
          ? "linear-gradient(135deg, rgba(255,200,60,0.25), rgba(232,140,26,0.15))"
          : "linear-gradient(135deg, rgba(40,40,60,0.6), rgba(20,20,40,0.8))",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: playing
          ? "0 0 16px 4px rgba(255,200,60,0.25)"
          : "0 4px 16px rgba(0,0,0,0.4)",
        backdropFilter: "blur(8px)",
        outline: "none",
        transition: "background 0.4s, box-shadow 0.4s",
      }}
      title={playing ? "Pause music" : "Play music"}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {playing ? (
          <>
            <rect x="6" y="4" width="4" height="16" rx="1" fill="#ffd700" />
            <rect x="14" y="4" width="4" height="16" rx="1" fill="#ffd700" />
          </>
        ) : (
          <path d="M9 6.5C9 5.67 9.67 5.18 10.4 5.6L18.4 10.6C19.2 11.07 19.2 12.93 18.4 13.4L10.4 18.4C9.67 18.82 9 18.33 9 17.5V6.5Z" fill="#c0a070" />
        )}
      </svg>
      {/* Animated sound waves when playing */}
      {playing && (
        <motion.div
          style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "1px solid rgba(255,215,0,0.2)" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.button>
  );
}

/* ─── SOUND EFFECTS HOOK ─────────────────────────────────────────── */
function useSoundEffects() {
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const playClick = useCallback(() => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch(e) {}
  }, [getCtx]);

  const playChime = useCallback(() => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.8);

        // Harmonic overtone
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.value = freq * 2;
        gain2.gain.setValueAtTime(0, now + i * 0.12);
        gain2.gain.linearRampToValueAtTime(0.04, now + i * 0.12 + 0.03);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.5);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + i * 0.12);
        osc2.stop(now + i * 0.12 + 0.5);
      });
    } catch(e) {}
  }, [getCtx]);

  return { playClick, playChime };
}

/* ─── SHIMMER KEYFRAMES ──────────────────────────────────────────── */
const SHIMMER_CSS = `
  @keyframes btnShimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
`;

/* ─── MAIN APP ───────────────────────────────────────────────────── */
export default function App() {
  const [isOn, setIsOn] = useState(false);
  const [ropeDone, setRopeDone] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState("switch"); // "switch" | "memory"
  const [transitioning, setTransitioning] = useState(false);
  const { playClick, playChime } = useSoundEffects();

  const handleToggle = () => {
    playClick();
    const next = !isOn;
    setIsOn(next);
    if (!next) { setRopeDone(false); setGiftOpened(false); }
  };

  const handleGiftOpen = () => {
    playChime();
    setGiftOpened(true);
  };

  const navigateTo = (page) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      setTimeout(() => setTransitioning(false), 100);
    }, 800);
  };

  /* ── Page transition overlay ── */
  const transitionOverlay = (
    <AnimatePresence>
      {transitioning && (
        <motion.div
          key="page-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "radial-gradient(ellipse at 50% 50%, #0a0612 0%, #000000 100%)",
            pointerEvents: "all",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 1.3] }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 120, height: 120, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  /* ── Show MemoryPage ── */
  if (currentPage === "memory") {
    return (
      <>
        {transitionOverlay}
        <MemoryPage onBack={() => navigateTo("switch")} />
        <MusicToggle />
      </>
    );
  }

  return (
    <>
      {/* Global font import + shimmer keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; }
      `}</style>
      <style>{SHIMMER_CSS}</style>

      <div style={{
        position: "fixed", inset: 0,
        background: "radial-gradient(ellipse at 50% 30%, #1a0e0a 0%, #0d0810 60%, #050308 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        overflowY: "auto",
      }}>
        {transitionOverlay}
        <ParallaxStars />
        <ShootingStars isOn={isOn} />
        <Fireflies isOn={isOn} />

        {/* Ambient glow when on */}
        <AnimatePresence>
          {isOn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed", inset: 0,
                background: "radial-gradient(ellipse at 50% 0%, #3a2010 0%, transparent 60%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
          )}
        </AnimatePresence>

        {/* Light rope */}
        <LightRope isOn={isOn} onDone={() => setRopeDone(true)} />

        {/* Content — unified flex column; gift + button live together */}
        <div style={{
          position: "relative", zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(30px, 6vh, 60px)",
          padding: "20px",
          paddingBottom: "clamp(40px, 8vh, 80px)",
          marginTop: isOn ? 120 : 0,
          transition: "margin-top 0.5s",
        }}>
          <AnimatePresence>
            {ropeDone && isOn && (
              <motion.div
                key="gift"
                initial={{ opacity: 0, scale: 0.5, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <GiftBox onOpen={handleGiftOpen} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── "View your Memories" button ──
              Appears ONLY after the gift reveal message settles.
              Inside the same flex container → natural document flow,
              no fixed/absolute positioning, no overlap.            */}
          <AnimatePresence>
            {giftOpened && isOn && (
              <motion.div
                key="view-memories-wrapper"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ delay: 1.5, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "clamp(30px, 5vh, 60px)",
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
                  whileHover={{
                    scale: 1.03,
                    boxShadow:
                      "0 0 28px 8px rgba(249,200,70,0.40), " +
                      "0 6px 36px rgba(0,0,0,0.65), " +
                      "inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigateTo("memory")}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    /* Typography — matches Cormorant Garamond on this page */
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    fontSize: "clamp(14px, 2.2vw, 18px)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    /* Shimmer text effect */
                    color: "transparent",
                    backgroundImage:
                      "linear-gradient(90deg, #fff9e0 0%, #ffd700 40%, #ffffff 50%, #ffd700 60%, #fff9e0 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    animation: "btnShimmer 4s linear infinite",
                    /* Button surface */
                    background:
                      "linear-gradient(135deg, rgba(249,200,70,0.15), rgba(232,140,26,0.10))",
                    border: "1.5px solid rgba(249,200,70,0.40)",
                    borderRadius: 30,
                    padding: "14px 40px",
                    cursor: "pointer",
                    /* Glow & depth */
                    boxShadow:
                      "0 0 18px 4px rgba(249,200,70,0.22), " +
                      "0 4px 24px rgba(0,0,0,0.55), " +
                      "inset 0 1px 0 rgba(255,255,255,0.12)",
                    /* Smooth transitions */
                    transition: "box-shadow 0.4s, border-color 0.4s",
                    outline: "none",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  {/* Inner text span with the shimmer gradient */}
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
                    ✨ View your Memories
                  </span>
                  
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <ToggleSwitch isOn={isOn} onToggle={handleToggle} />
        </div>

        {/* Music toggle — bottom right */}
        <MusicToggle />
      </div>
    </>
  );
}
