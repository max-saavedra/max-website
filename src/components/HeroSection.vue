<template>
  <section id="hero" class="hero-section">
    <div class="container hero-container">
      <!-- Text side -->
      <div class="hero-text">
        <span class="hero-eyebrow glass fade-up" style="--d: 0ms">
          <span class="live-dot"></span>
          Available for opportunities · {{ personal.location }}
        </span>

        <h1 class="hero-name" :aria-label="personal.shortName">
          <span v-for="(word, w) in nameWords" :key="w" class="word" aria-hidden="true">
            <span
              v-for="(ch, c) in word.chars"
              :key="c"
              class="char"
              :class="{ 'gradient-text': w === nameWords.length - 1 }"
              :style="{ '--i': word.offset + c }"
            >{{ ch }}</span>
          </span>
        </h1>

        <div class="hero-role fade-up" style="--d: 500ms">
          <span class="role-prompt">&gt;_</span>
          <span class="role-text">{{ roleText }}</span>
          <span class="caret"></span>
        </div>

        <p class="hero-bio fade-up" style="--d: 650ms">{{ personal.tagline }}</p>

        <div class="hero-cta fade-up" style="--d: 800ms">
          <a v-magnetic="0.25" :href="personal.cvFile" target="_blank" rel="noopener" class="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download CV
          </a>
          <a v-magnetic="0.25" href="#contact" @click.prevent="scrollToId('contact')" class="btn btn-ghost">
            Let's talk
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>

        <div class="hero-socials fade-up" style="--d: 950ms">
          <a
            v-for="s in socialLinks"
            :key="s.name"
            :href="s.url"
            target="_blank"
            rel="noopener"
            class="btn-icon"
            :aria-label="s.label"
            :title="s.label"
          >
            <SocialIcon :name="s.name" />
          </a>
        </div>
      </div>

      <!-- Floating glass ID card over the 3D core -->
      <div class="hero-visual fade-up" style="--d: 600ms">
        <div class="float-wrap">
          <div class="id-card card" v-tilt="14">
            <div class="id-top">
              <span class="id-chip"></span>
              <span class="id-label">ID · SE-{{ personal.graduationYear }}</span>
            </div>
            <div class="id-photo">
              <img :src="profilePhotoUrl" :alt="`${personal.name} profile photo`" loading="eager" @error="onImgError" />
            </div>
            <div class="id-name">{{ personal.name }}</div>
            <div class="id-meta">{{ personal.degree }}</div>
            <div class="id-meta muted">{{ personal.university }}</div>
            <div class="id-status">
              <span class="live-dot"></span> Open to work
            </div>
          </div>

          <span class="orbit-chip glass c1">PyTorch</span>
          <span class="orbit-chip glass c2">YOLO</span>
          <span class="orbit-chip glass c3">FastAPI</span>
          <span class="orbit-chip glass c4">LLMs</span>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="container">
      <div class="hero-stats">
        <div v-for="(s, i) in stats" :key="s.label" class="stat glass fade-up" :style="{ '--d': `${1050 + i * 100}ms` }">
          <div class="stat-num gradient-text"><CountUp :to="s.value" :suffix="s.suffix" :delay="1300 + i * 100" /></div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <div class="scroll-hint fade-up" style="--d: 1500ms" aria-hidden="true">
      <div class="mouse"><span></span></div>
      <span class="scroll-text">Scroll</span>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { personal, social, projects, certifications, publications, events } from "../assets/data/portfolio.js";
import { scrollToId, prefersReducedMotion } from "../lib/motion.js";
import SocialIcon from "./SocialIcon.vue";
import CountUp from "./CountUp.vue";

// Split name into words → chars, keeping a running index for stagger
const nameWords = computed(() => {
  let offset = 0;
  return personal.shortName.split(" ").map((w) => {
    const word = { chars: [...w], offset };
    offset += w.length;
    return word;
  });
});

const socialLinks = [
  { name: "github", url: social.github, label: "GitHub" },
  { name: "linkedin", url: social.linkedin, label: "LinkedIn" },
  { name: "orcid", url: social.orcid, label: "ORCID" },
  { name: "blog", url: social.blog, label: "Blog" },
].filter((s) => s.url);

const stats = [
  { value: projects.length, suffix: "+", label: "AI & software projects" },
  { value: certifications.length, suffix: "", label: "Certifications" },
  { value: publications.length, suffix: "", label: "Peer-reviewed paper" },
  { value: events.length, suffix: "", label: "Tech community events" },
];

// --- Role scramble -----------------------------------------------------------
const roles = personal.roles?.length ? personal.roles : [personal.title];
const roleText = ref(roles[0]);
const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";
let roleIdx = 0;
let roleTimer;
let rafId;

function scrambleTo(target) {
  const from = roleText.value;
  const len = Math.max(from.length, target.length);
  const queue = Array.from({ length: len }, (_, i) => ({
    from: from[i] || "",
    to: target[i] || "",
    start: Math.floor(Math.random() * 18),
    end: Math.floor(Math.random() * 18) + 18,
  }));
  let frame = 0;
  const update = () => {
    let out = "";
    let done = 0;
    for (const q of queue) {
      if (frame >= q.end) { done++; out += q.to; }
      else if (frame >= q.start) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      else out += q.from;
    }
    roleText.value = out;
    if (done < queue.length) { frame++; rafId = requestAnimationFrame(update); }
  };
  update();
}

onMounted(() => {
  if (prefersReducedMotion || roles.length < 2) return;
  roleTimer = setInterval(() => {
    roleIdx = (roleIdx + 1) % roles.length;
    scrambleTo(roles[roleIdx]);
  }, 3200);
});
onUnmounted(() => {
  clearInterval(roleTimer);
  cancelAnimationFrame(rafId);
});

// --- Photo -------------------------------------------------------------------
const profilePhotoUrl = new URL(`../assets/profile/${personal.profilePhoto}`, import.meta.url).href;
function onImgError(e) {
  e.target.src = "https://placehold.co/320x320/0d1117/8b6cff?text=MS";
}
</script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: calc(var(--nav-h) + 3rem) 0 6rem;
}

.hero-container {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
}

/* Eyebrow */
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 999px;
  margin-bottom: 1.75rem;
}
.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-green);
  box-shadow: 0 0 0 0 var(--accent-green);
  animation: ping 2s ease infinite;
  flex-shrink: 0;
}
@keyframes ping {
  0%   { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent-green) 70%, transparent); }
  80%, 100% { box-shadow: 0 0 0 10px transparent; }
}

/* Name */
.hero-name {
  font-size: clamp(3.2rem, 10vw, 7.5rem);
  font-weight: 700;
  line-height: 0.92;
  letter-spacing: -0.045em;
  margin-bottom: 1.5rem;
  perspective: 800px;
}
.word {
  display: inline-block;
  white-space: nowrap;
  margin-right: 0.22em;
}
.word:last-child { display: block; margin-right: 0; }
.char.gradient-text {
  /* gradient per character must span the whole word */
  background-size: 400% auto;
}

/* Role */
.hero-role {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: clamp(0.95rem, 2vw, 1.25rem);
  color: var(--text-primary);
  margin-bottom: 1.25rem;
  min-height: 1.8em;
}
.role-prompt { color: var(--accent-cyan); }
.caret {
  width: 0.55em;
  height: 1.1em;
  background: var(--accent-cyan);
  animation: blink 1s steps(1) infinite;
}
@keyframes blink { 50% { opacity: 0; } }

.hero-bio {
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  color: var(--text-secondary);
  max-width: 520px;
  margin-bottom: 2.25rem;
}

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-bottom: 2rem;
}
.hero-cta .btn { transition: transform 0.35s var(--ease-out), box-shadow var(--transition-normal), background-position 0.6s; }

.hero-socials { display: flex; gap: 0.6rem; }

/* Visual: ID card */
.hero-visual {
  display: flex;
  justify-content: center;
}
.float-wrap {
  position: relative;
  animation: float 7s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-16px); }
}

.id-card {
  width: min(320px, 78vw);
  padding: 1.4rem;
  border-radius: var(--radius-lg);
  text-align: center;
  --glass-blur: 22px;
}
.id-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}
.id-chip {
  width: 34px;
  height: 26px;
  border-radius: 6px;
  background: linear-gradient(135deg, #f6d27a, #b8892d);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.2);
}
.id-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: var(--text-muted);
}
.id-photo {
  width: 150px;
  height: 150px;
  margin: 0 auto 1.1rem;
  border-radius: 50%;
  padding: 3px;
  background: conic-gradient(from 0deg, var(--accent-violet), var(--accent-cyan), var(--accent-pink), var(--accent-violet));
  animation: rotateHue 6s linear infinite;
}
.id-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid var(--bg-base);
}
@keyframes rotateHue { to { filter: hue-rotate(360deg); } }
.id-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}
.id-meta { font-size: 0.8rem; color: var(--text-secondary); }
.id-meta.muted { color: var(--text-muted); font-size: 0.75rem; }
.id-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: var(--accent-green);
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent-green) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent-green) 30%, transparent);
}

.orbit-chip {
  position: absolute;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  color: var(--text-primary);
  white-space: nowrap;
  animation: bob 5s ease-in-out infinite;
  pointer-events: none;
}
.c1 { top: 8%;  left: -18%; animation-delay: 0s; }
.c2 { top: 30%; right: -16%; animation-delay: -1.2s; }
.c3 { bottom: 22%; left: -22%; animation-delay: -2.4s; }
.c4 { bottom: 4%; right: -12%; animation-delay: -3.6s; }
@keyframes bob {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50%      { transform: translate3d(0, -12px, 0); }
}

/* Stats */
.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: clamp(3rem, 6vw, 5rem);
}
.stat {
  padding: 1.25rem 1.4rem;
  border-radius: var(--radius-md);
}
.stat-num {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1;
  margin-bottom: 0.4rem;
}
.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Scroll hint */
.scroll-hint {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  margin-left: -20px;
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.mouse {
  width: 22px;
  height: 34px;
  border: 1.5px solid var(--text-muted);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 6px;
}
.mouse span {
  width: 3px;
  height: 7px;
  border-radius: 3px;
  background: var(--accent-cyan);
  animation: wheel 1.8s ease-in-out infinite;
}
@keyframes wheel {
  0%   { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(10px); opacity: 0; }
}
.scroll-text {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* Responsive */
@media (max-width: 900px) {
  .hero-container { grid-template-columns: 1fr; }
  .hero-visual { order: -1; }
  .id-card { width: min(280px, 80vw); }
  .id-photo { width: 110px; height: 110px; }
  .orbit-chip { display: none; }
  .hero-stats { grid-template-columns: repeat(2, 1fr); }
  .scroll-hint { display: none; }
}
@media (max-width: 520px) {
  .hero-cta .btn { flex: 1; justify-content: center; }
}
</style>
