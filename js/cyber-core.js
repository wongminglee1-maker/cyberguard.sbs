/**
 * CyberGuard Abstract 3D Network Core Visualizer
 * High-performance lightweight Canvas 3D engine with mouse parallax,
 * telemetry telemetry HUD, and prefers-reduced-motion fallback.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('cyber-core-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let animationFrameId = null;
  let isVisible = true;

  // 3D coordinate camera and rotation state
  let rotX = 0.3;
  let rotY = 0.5;
  let targetRotX = 0.3;
  let targetRotY = 0.5;

  // Mouse interaction state
  let mouseX = 0;
  let mouseY = 0;
  let isHovered = false;

  // Core geometry nodes
  const NUM_NODES = 56;
  const nodes = [];
  const radius = 130;

  // Generate spherical fibonacci spiral distribution
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
  for (let i = 0; i < NUM_NODES; i++) {
    const y = 1 - (i / (NUM_NODES - 1)) * 2; // y goes from 1 to -1
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    nodes.push({
      x: x * radius,
      y: y * radius,
      z: z * radius,
      baseRadius: radius,
      pulse: Math.random() * Math.PI * 2,
      size: Math.random() * 2.2 + 2,
      color: Math.random() > 0.4 ? '#00D9D0' : '#477BFF'
    });
  }

  // Orbital rings
  const rings = [
    { radius: 155, tiltX: 0.8, tiltY: 0.2, rotSpeed: 0.008, angle: 0, color: 'rgba(0, 217, 208, 0.45)' },
    { radius: 175, tiltX: -0.6, tiltY: 0.7, rotSpeed: -0.006, angle: 1.2, color: 'rgba(71, 123, 255, 0.45)' },
    { radius: 195, tiltX: 0.3, tiltY: -0.9, rotSpeed: 0.004, angle: 2.5, color: 'rgba(0, 217, 208, 0.25)' }
  ];

  // Data packet pulses traveling around rings
  const packets = [
    { ringIdx: 0, progress: 0.1, speed: 0.012, size: 4, color: '#00D9D0' },
    { ringIdx: 0, progress: 0.6, speed: 0.012, size: 3.5, color: '#00E599' },
    { ringIdx: 1, progress: 0.3, speed: -0.010, size: 4, color: '#477BFF' },
    { ringIdx: 2, progress: 0.8, speed: 0.008, size: 3.5, color: '#00D9D0' }
  ];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Mouse Parallax listener
  const container = canvas.parentElement;
  if (container) {
    container.addEventListener('mousemove', function (e) {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 1.2;
      targetRotX = -y * 1.2;
      isHovered = true;
    }, { passive: true });

    container.addEventListener('mouseleave', function () {
      isHovered = false;
    }, { passive: true });
  }

  // 3D Projection Helper
  function project(x, y, z, cx, cy) {
    // 3D perspective projection
    const fov = 380;
    const distance = 420;
    const factor = fov / (distance + z);
    return {
      x: cx + x * factor,
      y: cy + y * factor,
      scale: factor,
      z: z
    };
  }

  // Rotate a 3D point around X and Y axes
  function rotatePoint(p, rx, ry) {
    // Rotate Y
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);
    const x1 = p.x * cosY - p.z * sinY;
    const z1 = p.z * cosY + p.x * sinY;

    // Rotate X
    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);
    const y2 = p.y * cosX - z1 * sinX;
    const z2 = z1 * cosX + p.y * sinX;

    return { x: x1, y: y2, z: z2 };
  }

  let lastTime = performance.now();
  let baseAutoRot = 0;

  function render(time) {
    if (!isVisible) return;

    const dt = (time - lastTime) / 1000;
    lastTime = time;

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    if (!prefersReducedMotion) {
      baseAutoRot += 0.005;
      // Smooth interpolation for parallax
      rotX += (targetRotX - rotX) * 0.08;
      rotY += (targetRotY - rotY) * 0.08;
    }

    const currentRotX = rotX;
    const currentRotY = rotY + baseAutoRot;

    // Draw central ambient glow
    const radialGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 180);
    radialGlow.addColorStop(0, 'rgba(0, 217, 208, 0.22)');
    radialGlow.addColorStop(0.5, 'rgba(71, 123, 255, 0.10)');
    radialGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = radialGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, 180, 0, Math.PI * 2);
    ctx.fill();

    // 1. Draw Orbital Rings
    rings.forEach((ring, idx) => {
      ring.angle += ring.rotSpeed;
      const pts = [];
      const segments = 64;

      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        // Ring in local XY plane
        const localX = Math.cos(theta) * ring.radius;
        const localY = Math.sin(theta) * ring.radius;
        const localZ = 0;

        // Apply ring tilt
        const cosTX = Math.cos(ring.tiltX);
        const sinTX = Math.sin(ring.tiltX);
        const yT = localY * cosTX - localZ * sinTX;
        const zT = localZ * cosTX + localY * sinTX;

        const cosTY = Math.cos(ring.tiltY + ring.angle);
        const sinTY = Math.sin(ring.tiltY + ring.angle);
        const xT = localX * cosTY - zT * sinTY;
        const zFinal = zT * cosTY + localX * sinTY;

        const rotated = rotatePoint({ x: xT, y: yT, z: zFinal }, currentRotX, currentRotY);
        pts.push(project(rotated.x, rotated.y, rotated.z, cx, cy));
      }

      ctx.beginPath();
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = 1.2;
      for (let s = 0; s < pts.length; s++) {
        if (s === 0) ctx.moveTo(pts[s].x, pts[s].y);
        else ctx.lineTo(pts[s].x, pts[s].y);
      }
      ctx.stroke();
    });

    // 2. Draw Data Packets along rings
    packets.forEach((pkt) => {
      pkt.progress += pkt.speed;
      if (pkt.progress > 1) pkt.progress -= 1;
      if (pkt.progress < 0) pkt.progress += 1;

      const ring = rings[pkt.ringIdx];
      const theta = pkt.progress * Math.PI * 2;
      const localX = Math.cos(theta) * ring.radius;
      const localY = Math.sin(theta) * ring.radius;
      const localZ = 0;

      const cosTX = Math.cos(ring.tiltX);
      const sinTX = Math.sin(ring.tiltX);
      const yT = localY * cosTX - localZ * sinTX;
      const zT = localZ * cosTX + localY * sinTX;

      const cosTY = Math.cos(ring.tiltY + ring.angle);
      const sinTY = Math.sin(ring.tiltY + ring.angle);
      const xT = localX * cosTY - zT * sinTY;
      const zFinal = zT * cosTY + localX * sinTY;

      const rot = rotatePoint({ x: xT, y: yT, z: zFinal }, currentRotX, currentRotY);
      const proj = project(rot.x, rot.y, rot.z, cx, cy);

      ctx.beginPath();
      ctx.arc(proj.x, proj.y, pkt.size * proj.scale, 0, Math.PI * 2);
      ctx.fillStyle = pkt.color;
      ctx.shadowColor = pkt.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 3. Project and Sort Nodes
    const projectedNodes = nodes.map((node, i) => {
      node.pulse += 0.03;
      const pulseFactor = 1 + Math.sin(node.pulse) * 0.06;
      const rot = rotatePoint({
        x: node.x * pulseFactor,
        y: node.y * pulseFactor,
        z: node.z * pulseFactor
      }, currentRotX, currentRotY);
      const proj = project(rot.x, rot.y, rot.z, cx, cy);
      return {
        ...node,
        px: proj.x,
        py: proj.y,
        scale: proj.scale,
        z: proj.z,
        index: i
      };
    });

    // 4. Draw Interconnecting Constellation Lines
    ctx.lineWidth = 0.8;
    for (let i = 0; i < projectedNodes.length; i++) {
      for (let j = i + 1; j < projectedNodes.length; j++) {
        const na = projectedNodes[i];
        const nb = projectedNodes[j];
        const dx = na.px - nb.px;
        const dy = na.py - nb.py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 65) {
          const alpha = (1 - dist / 65) * 0.35 * Math.min(na.scale, nb.scale);
          ctx.strokeStyle = `rgba(0, 217, 208, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(na.px, na.py);
          ctx.lineTo(nb.px, nb.py);
          ctx.stroke();
        }
      }
    }

    // 5. Draw Core Sphere Nodes
    projectedNodes.sort((a, b) => a.z - b.z);
    projectedNodes.forEach((p) => {
      const alpha = Math.max(0.2, (p.z + radius) / (radius * 2));
      ctx.beginPath();
      ctx.arc(p.px, p.py, p.size * p.scale, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });

    // 6. Draw central cyber emblem / core icon
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 217, 208, 0.4)';
    ctx.fill();
    ctx.strokeStyle = '#00D9D0';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  // IntersectionObserver to pause rendering when offscreen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animationFrameId && !prefersReducedMotion) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(canvas);

  // Initial draw
  if (prefersReducedMotion) {
    render(performance.now());
  } else {
    animationFrameId = requestAnimationFrame(render);
  }

  // Simulated live telemetry HUD updates
  const pingEl = document.getElementById('hud-ping-val');
  const jitterEl = document.getElementById('hud-jitter-val');
  if (pingEl && jitterEl) {
    setInterval(() => {
      const base = 16;
      const fluctuation = Math.floor(Math.random() * 5);
      pingEl.textContent = (base + fluctuation) + ' ms';
      jitterEl.textContent = '±' + (Math.random() * 1.5).toFixed(1) + ' ms';
    }, 2800);
  }

})();
