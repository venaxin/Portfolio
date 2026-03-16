import { useRef, useEffect } from "react";

// Simple, fast star field: plain dots with alpha pulse drifting bottom-right.
// Shooting star fires every 3-4 seconds. No per-star gradients.
function MeteorShower({ disabled = false, density = 1, fps = 30 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (disabled) {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let dpr = Math.max(1, window.devicePixelRatio || 1);
    let animId;

    const resize = () => {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Debounced resize
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); repositionStars(); }, 120);
    };

    resize();

    const W = () => canvas.width / dpr;
    const H = () => canvas.height / dpr;

    // Stars: plain dots, alpha pulse, drift bottom-right
    const starCount = Math.round(Math.min(120, Math.max(40, (W() * H()) / 8000)) * density);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      r: Math.random() * 1.2 + 0.4,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.005 + 0.002,
      alpha: 0,
    }));

    const repositionStars = () => {
      for (const s of stars) {
        s.x = Math.random() * W();
        s.y = Math.random() * H();
      }
    };

    // Shooting star
    let meteor = null;
    let nextMeteorIn = 3000 + Math.random() * 1000; // ms until first one
    let elapsed = 0;

    const spawnMeteor = () => {
      const w = W(), h = H();
      // Start from top-left area, travel bottom-right
      meteor = {
        x: Math.random() * w * 0.5,
        y: Math.random() * h * 0.3,
        vx: 5 + Math.random() * 3,
        vy: 3 + Math.random() * 2,
        len: 80 + Math.random() * 60,
        alpha: 1,
      };
    };

    // Animation loop — FPS-throttled
    let last = 0;
    const targetMs = 1000 / Math.max(1, fps);
    let hidden = document.visibilityState === "hidden";
    const onVis = () => { hidden = document.visibilityState === "hidden"; };
    document.addEventListener("visibilitychange", onVis);

    const tick = (now) => {
      animId = requestAnimationFrame(tick);
      if (hidden) return;
      const dt = now - last;
      if (dt < targetMs) return;
      last = now;

      ctx.clearRect(0, 0, W(), H());

      // Draw stars
      for (const s of stars) {
        s.phase += s.speed;
        s.alpha = 0.25 + Math.sin(s.phase) * 0.25; // 0..0.5
        s.x += 0.35;
        s.y += 0.25;
        if (s.x > W()) s.x = 0;
        if (s.y > H()) s.y = 0;

        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw shooting star
      if (meteor) {
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.alpha -= 0.015;
        if (meteor.alpha <= 0 || meteor.x > W() || meteor.y > H()) {
          meteor = null;
          nextMeteorIn = 3000 + Math.random() * 1000;
          elapsed = 0;
        } else {
          const tailX = meteor.x - (meteor.vx / Math.hypot(meteor.vx, meteor.vy)) * meteor.len;
          const tailY = meteor.y - (meteor.vy / Math.hypot(meteor.vx, meteor.vy)) * meteor.len;
          const grad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
          grad.addColorStop(0, `rgba(255,255,255,${0.9 * meteor.alpha})`);
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.globalAlpha = 1;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }
      } else {
        elapsed += dt;
        if (elapsed >= nextMeteorIn) spawnMeteor();
      }

      ctx.globalAlpha = 1;
    };

    animId = requestAnimationFrame(tick);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [disabled, density, fps]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none"
    />
  );
}

export default MeteorShower;
