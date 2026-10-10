<template>
  <div class="webgl-wrap" aria-hidden="true">
    <canvas ref="canvas" class="webgl-canvas" :class="{ ready }"></canvas>
    <!-- CSS aurora blobs: give the glass something colourful to blur, and act as fallback -->
    <div class="aurora a1"></div>
    <div class="aurora a2"></div>
    <div class="aurora a3"></div>
  </div>
</template>

<script setup>
/**
 * Fixed full-page WebGL scene choreographed by scroll position:
 *  - an iridescent noise-displaced "AI core" blob with a wireframe shell
 *  - two orbit rings
 *  - a parallax particle field
 * Falls back silently to the CSS aurora if WebGL is unavailable.
 */
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { motionState, prefersReducedMotion } from "../lib/motion.js";

const canvas = ref(null);
const ready = ref(false);

let renderer, scene, camera, frameId, themeObserver, onResize;
let disposed = false;

const noiseGLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

function buildScene(isMobile) {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 7);

  const uniforms = {
    uTime: { value: 0 },
    uAmp: { value: 0.32 },
    uHue: { value: 0 },
    uLight: { value: 0 },
    uFade: { value: 1 },
  };

  // --- AI core blob ---------------------------------------------------------
  const blobMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      uniform float uTime; uniform float uAmp;
      varying vec3 vNormal; varying vec3 vView; varying float vNoise;
      ${noiseGLSL}
      void main(){
        float n = snoise(normal * 1.4 + uTime * 0.35);
        float n2 = snoise(normal * 3.2 - uTime * 0.2) * 0.35;
        vNoise = n + n2;
        vec3 pos = position + normal * vNoise * uAmp;
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uHue; uniform float uLight; uniform float uFade;
      varying vec3 vNormal; varying vec3 vView; varying float vNoise;
      // Brand gradient loop: violet -> cyan -> pink -> violet
      vec3 palette(float t){
        vec3 c1 = vec3(0.545, 0.424, 1.0);
        vec3 c2 = vec3(0.133, 0.882, 1.0);
        vec3 c3 = vec3(1.0, 0.357, 0.816);
        t = fract(t) * 3.0;
        if (t < 1.0) return mix(c1, c2, smoothstep(0.0, 1.0, t));
        if (t < 2.0) return mix(c2, c3, smoothstep(0.0, 1.0, t - 1.0));
        return mix(c3, c1, smoothstep(0.0, 1.0, t - 2.0));
      }
      void main(){
        float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.2);
        vec3 col = palette(vNoise * 0.35 + uHue + fres * 0.4);
        col = mix(col * 0.35, col, fres + 0.25);
        col += fres * vec3(0.55, 0.85, 1.0) * 0.9;
        float alpha = mix(0.92, 0.98, uLight) * uFade;
        gl_FragColor = vec4(col, alpha);
      }`,
    transparent: true,
  });
  const detail = isMobile ? 32 : 56;
  const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, detail), blobMat);

  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.95, 2),
    new THREE.MeshBasicMaterial({ color: 0x8b6cff, wireframe: true, transparent: true, opacity: 0.14 })
  );

  const core = new THREE.Group();
  core.add(blob, shell);

  // --- Orbit rings ----------------------------------------------------------
  const ringMat = (color, opacity) =>
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.008, 8, 200), ringMat(0x22e1ff, 0.55));
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.006, 8, 200), ringMat(0xff5bd0, 0.4));
  ring1.rotation.x = Math.PI / 2.4;
  ring2.rotation.x = Math.PI / 1.8;
  ring2.rotation.y = 0.5;

  // Satellites riding the rings
  const satGeo = new THREE.SphereGeometry(0.05, 16, 16);
  const sat1 = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: 0x22e1ff }));
  const sat2 = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: 0xff5bd0 }));
  ring1.add(sat1);
  ring2.add(sat2);
  core.add(ring1, ring2);
  scene.add(core);

  // --- Particle field -------------------------------------------------------
  const count = isMobile ? 900 : 2200;
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 6 + Math.random() * 18;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = r * Math.cos(phi) - 8;
    scales[i] = Math.random();
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  const pMat = new THREE.ShaderMaterial({
    uniforms: { ...uniforms, uPixel: { value: Math.min(window.devicePixelRatio, 1.75) } },
    vertexShader: /* glsl */ `
      uniform float uTime; uniform float uPixel; attribute float aScale; varying float vA;
      void main(){
        vec3 p = position;
        p.x += sin(uTime * 0.2 + position.y) * 0.15;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (2.0 + aScale * 5.0) * uPixel * (10.0 / -mv.z);
        vA = 0.25 + aScale * 0.75;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uLight; varying float vA;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d) * vA;
        vec3 c = mix(vec3(0.75, 0.85, 1.0), vec3(0.35, 0.25, 0.75), uLight);
        gl_FragColor = vec4(c, a * mix(0.9, 0.6, uLight));
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  return { uniforms, core, blob, shell, ring1, ring2, sat1, sat2, particles, shellMat: shell.material };
}

onMounted(() => {
  const isMobile = window.innerWidth < 768;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: !isMobile, alpha: true, powerPreference: "high-performance" });
  } catch {
    return; // no WebGL → aurora fallback only
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const s = buildScene(isMobile);

  const applyTheme = () => {
    const light = document.documentElement.getAttribute("data-theme") === "light";
    s.uniforms.uLight.value = light ? 1 : 0;
    s.shellMat.color.set(light ? 0x6a46ff : 0x8b6cff);
    s.shellMat.opacity = light ? 0.22 : 0.14;
  };
  applyTheme();
  themeObserver = new MutationObserver(applyTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (prefersReducedMotion) renderer.render(scene, camera);
  };
  window.addEventListener("resize", onResize);

  // Smoothed values (lerped every frame for a fluid feel)
  const smooth = { p: 0, px: 0, py: 0, amp: 0.32 };
  const clock = new THREE.Clock();
  const lerp = (a, b, t) => a + (b - a) * t;

  const tick = () => {
    if (disposed) return;
    frameId = requestAnimationFrame(tick);
    if (document.hidden) return;

    const t = clock.getElapsedTime();
    const wide = window.innerWidth >= 900;

    smooth.p = lerp(smooth.p, motionState.progress, 0.06);
    smooth.px = lerp(smooth.px, motionState.pointerX, 0.05);
    smooth.py = lerp(smooth.py, motionState.pointerY, 0.05);
    const targetAmp = 0.3 + Math.min(Math.abs(motionState.velocity) * 0.012, 0.35);
    smooth.amp = lerp(smooth.amp, targetAmp, 0.08);

    const p = smooth.p;
    s.uniforms.uTime.value = t;
    s.uniforms.uAmp.value = smooth.amp;
    s.uniforms.uHue.value = p * 0.8 + t * 0.02;

    // Scroll choreography: the core weaves left/right as sections pass by
    const sway = wide ? 2.1 : 0.0;
    const startX = wide ? 2.0 : 0.0;
    const heroMix = Math.min(p * 8, 1); // first ~12% of scroll = hero
    // Past the hero the core recedes so it never fights with section text
    s.uniforms.uFade.value = lerp(1, 0.55, heroMix);
    s.shellMat.opacity = (s.uniforms.uLight.value ? 0.22 : 0.14) * lerp(1, 0.6, heroMix);
    s.core.position.x = lerp(startX, Math.sin(p * Math.PI * 4) * sway, heroMix) + smooth.px * 0.25;
    s.core.position.y = (wide ? 0.1 : 1.2) * (1 - heroMix) + Math.cos(p * Math.PI * 2) * 0.3 - smooth.py * 0.2;
    s.core.position.z = -heroMix * (wide ? 1.2 : 2.2) - Math.sin(p * Math.PI) * 0.6;
    const scale = (wide ? 1 : 0.78) * (1 + Math.sin(p * Math.PI * 2) * 0.12);
    s.core.scale.setScalar(scale);

    s.blob.rotation.y = t * 0.12 + p * Math.PI * 3;
    s.blob.rotation.x = smooth.py * 0.4;
    s.shell.rotation.y = -t * 0.08 - p * Math.PI * 2;
    s.shell.rotation.z = t * 0.05;
    s.ring1.rotation.z = t * 0.3 + p * 4;
    s.ring2.rotation.z = -t * 0.22 - p * 3;
    s.sat1.position.set(Math.cos(t * 1.2) * 2.6, Math.sin(t * 1.2) * 2.6, 0);
    s.sat2.position.set(Math.cos(-t * 0.9) * 3.1, Math.sin(-t * 0.9) * 3.1, 0);

    s.particles.position.y = p * 14;
    s.particles.rotation.y = t * 0.015 + smooth.px * 0.08;

    camera.position.x = smooth.px * 0.35;
    camera.position.y = -smooth.py * 0.25;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };

  if (prefersReducedMotion) {
    renderer.render(scene, camera);
  } else {
    tick();
  }
  requestAnimationFrame(() => (ready.value = true));
});

onBeforeUnmount(() => {
  disposed = true;
  cancelAnimationFrame(frameId);
  if (onResize) window.removeEventListener("resize", onResize);
  themeObserver?.disconnect();
  renderer?.dispose();
});
</script>

<style scoped>
.webgl-wrap {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
.webgl-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0;
  transition: opacity 1.6s ease;
}
.webgl-canvas.ready { opacity: 1; }

.aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.45;
  will-change: transform;
}
.a1 {
  width: 55vw; height: 55vw;
  top: -15vw; left: -15vw;
  background: radial-gradient(circle, var(--accent-violet), transparent 65%);
  animation: drift1 22s ease-in-out infinite alternate;
}
.a2 {
  width: 45vw; height: 45vw;
  bottom: -15vw; right: -10vw;
  background: radial-gradient(circle, var(--accent-cyan), transparent 65%);
  opacity: 0.3;
  animation: drift2 26s ease-in-out infinite alternate;
}
.a3 {
  width: 35vw; height: 35vw;
  top: 40%; left: 45%;
  background: radial-gradient(circle, var(--accent-pink), transparent 65%);
  opacity: 0.18;
  animation: drift3 30s ease-in-out infinite alternate;
}
:global([data-theme="light"] .webgl-wrap .aurora) { opacity: 0.35; }

@keyframes drift1 { to { transform: translate(20vw, 25vh) scale(1.2); } }
@keyframes drift2 { to { transform: translate(-25vw, -20vh) scale(0.9); } }
@keyframes drift3 { to { transform: translate(-30vw, 20vh) scale(1.3); } }
</style>
