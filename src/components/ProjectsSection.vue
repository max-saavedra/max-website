<template>
  <section
    id="projects"
    ref="sectionEl"
    class="projects"
    :class="{ pinned }"
    :style="pinned ? { height: `${sectionHeight}px` } : null"
  >
    <div class="sticky">
      <div class="container head-row">
        <div class="section-head">
          <span class="section-label" v-reveal="'up'">02 / Engineering</span>
          <h2 class="section-title" v-reveal:100="'blur'">Selected <span class="gradient-text">projects</span></h2>
          <p class="section-subtitle" v-reveal:200="'up'">
            Chosen for architectural depth. Each one reflects a deliberate design decision, not just a working implementation.
          </p>
        </div>
        <div v-if="pinned" class="progress-counter" aria-hidden="true">
          <span class="current">{{ String(currentIdx + 1).padStart(2, "0") }}</span>
          <span class="bar"><span :style="{ transform: `scaleX(${progress})` }"></span></span>
          <span class="total">{{ String(featuredProjects.length).padStart(2, "0") }}</span>
        </div>
      </div>

      <div class="track-viewport">
        <div class="track" ref="trackEl" :style="pinned ? { transform: `translate3d(${-progress * distance}px,0,0)` } : null">
          <div
            v-for="(project, idx) in featuredProjects"
            :key="project.id"
            class="slot"
            v-reveal:[idx*80]="'up'"
          >
            <article class="card project-card" v-tilt="7">
              <div class="project-visual" :style="{ '--h': idx * 70 }">
                <div class="visual-grid"></div>
                <span class="visual-num">{{ String(idx + 1).padStart(2, "0") }}</span>
                <div class="visual-orb"></div>
              </div>

              <div class="project-body">
                <h3 class="project-name">{{ project.name }}</h3>
                <p class="project-why">
                  <span class="why-label">Why</span>{{ project.why }}
                </p>
                <p class="project-desc">{{ project.description }}</p>
                <div class="project-stack">
                  <span v-for="tech in project.stack" :key="tech" class="tag">{{ tech }}</span>
                </div>
                <div class="project-links">
                  <a v-if="project.github" :href="project.github" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">
                    <SocialIcon name="github" :size="14" /> Code
                  </a>
                  <a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                    Live demo
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M7 17L17 7M7 7h10v10"/></svg>
                  </a>
                </div>
              </div>
            </article>
          </div>

          <!-- End card -->
          <div class="slot slot-end" v-reveal="'scale'">
            <a :href="social.github" target="_blank" rel="noopener" class="card end-card" v-tilt="10">
              <SocialIcon name="github" :size="56" />
              <span class="end-title">More on GitHub</span>
              <span class="end-sub">Explore every repository →</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from "vue";
import { projects, social } from "../assets/data/portfolio.js";
import { prefersReducedMotion } from "../lib/motion.js";
import SocialIcon from "./SocialIcon.vue";

const featuredProjects = computed(() => projects.filter((p) => p.featured).slice(0, 4));

// --- Pinned horizontal scroll (desktop only) --------------------------------
const sectionEl = ref(null);
const trackEl = ref(null);
const pinned = ref(false);
const distance = ref(0);
const sectionHeight = ref(0);
const progress = ref(0);

const currentIdx = computed(() =>
  Math.min(Math.round(progress.value * (featuredProjects.value.length - 1)), featuredProjects.value.length - 1)
);

function measure() {
  pinned.value = window.innerWidth >= 900 && !prefersReducedMotion;
  if (!pinned.value) return;
  nextTick(() => {
    const track = trackEl.value;
    if (!track) return;
    distance.value = Math.max(track.scrollWidth - window.innerWidth, 0);
    sectionHeight.value = window.innerHeight + distance.value;
    onScroll();
  });
}

function onScroll() {
  if (!pinned.value || !sectionEl.value) return;
  const top = sectionEl.value.getBoundingClientRect().top;
  progress.value = distance.value > 0 ? Math.min(Math.max(-top / distance.value, 0), 1) : 0;
}

let ro;
onMounted(() => {
  measure();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measure);
  ro = new ResizeObserver(measure);
  if (trackEl.value) ro.observe(trackEl.value);
  document.fonts?.ready.then(measure);
});
onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", measure);
  ro?.disconnect();
});
</script>

<style scoped>
.projects {
  position: relative;
  padding: var(--section-pad) 0;
}
.projects.pinned { padding: 0; }
.pinned .sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding-top: calc(var(--nav-h) + 1rem);
}
.pinned .section-head { margin-bottom: 1.25rem; }
.pinned .section-subtitle { font-size: 0.98rem; }
.pinned .section-title { font-size: clamp(2.4rem, 5vw, 3.8rem); }

.head-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
}

.progress-counter {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 2.25rem;
  flex-shrink: 0;
}
.progress-counter .current { color: var(--text-primary); font-size: 1.1rem; }
.progress-counter .bar {
  width: 120px;
  height: 2px;
  background: var(--border-default);
  overflow: hidden;
  border-radius: 2px;
}
.progress-counter .bar span {
  display: block;
  height: 100%;
  background: var(--gradient-brand);
  transform-origin: left;
}

/* Track */
.track {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 clamp(1rem, 4vw, 2rem);
  max-width: var(--container-max);
  margin: 0 auto;
}
.pinned .track {
  flex-direction: row;
  width: max-content;
  max-width: none;
  margin: 0;
  gap: 2rem;
  padding: 1rem max(2rem, calc((100vw - var(--container-max)) / 2 + 2rem));
  will-change: transform;
}

.pinned .slot { width: min(560px, 42vw); flex-shrink: 0; }
.pinned .slot-end { width: 320px; }
.slot { display: flex; }

.project-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  width: 100%;
  border-radius: var(--radius-lg);
}
.pinned .project-card { height: clamp(360px, calc(100vh - 340px), 600px); }

/* Generated visual header */
.project-visual {
  position: relative;
  height: 160px;
  flex-shrink: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 30%, hsl(calc(260 + var(--h)) 90% 60% / 0.55), transparent 55%),
    radial-gradient(circle at 80% 70%, hsl(calc(190 + var(--h)) 95% 55% / 0.5), transparent 55%),
    linear-gradient(135deg, hsl(calc(250 + var(--h)) 60% 12%), hsl(calc(220 + var(--h)) 60% 8%));
  border-bottom: 1px solid var(--glass-border);
}
.visual-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: linear-gradient(to bottom, black, transparent);
  animation: gridMove 8s linear infinite;
}
@keyframes gridMove { to { background-position: 28px 28px; } }
.visual-num {
  position: absolute;
  right: 1.25rem;
  bottom: -1.2rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 7rem;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255,255,255,0.45);
}
.visual-orb {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  width: 64px;
  height: 64px;
  margin-top: -32px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #fff, hsl(calc(200 + var(--h)) 95% 60%) 40%, hsl(calc(270 + var(--h)) 80% 40%));
  box-shadow: 0 0 40px hsl(calc(200 + var(--h)) 95% 60% / 0.7);
  animation: orb 6s ease-in-out infinite;
}
@keyframes orb {
  50% { transform: translate3d(14px, -8px, 0) scale(1.1); }
}

.project-body {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.6rem 1.75rem 1.75rem;
  flex: 1;
  min-height: 0;
}
.project-name { font-size: 1.45rem; line-height: 1.2; }
.project-why {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-style: italic;
  line-height: 1.55;
  padding-left: 0.9rem;
  border-left: 2px solid var(--accent-cyan);
}
.why-label {
  font-family: var(--font-mono);
  font-style: normal;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent-cyan);
  margin-right: 0.5rem;
}
.project-desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.65;
}
.pinned .project-desc {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-shrink: 0;
}
.pinned .project-why { flex-shrink: 0; }
.project-stack { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: auto; }
.project-links { display: flex; gap: 0.6rem; }

/* End card */
.end-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  min-height: 240px;
  text-decoration: none;
  color: var(--text-primary);
  border-radius: var(--radius-lg);
  text-align: center;
}
.pinned .end-card { height: clamp(360px, calc(100vh - 340px), 600px); }
.end-title { font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; }
.end-sub { font-size: 0.85rem; color: var(--accent-cyan); }

@media (max-width: 899px) {
  .head-row { display: block; }
}
/* Short laptop screens: drop the secondary text so the pinned cards fit */
@media (max-height: 820px) {
  .pinned .project-why, .pinned .section-subtitle { display: none; }
  .pinned .project-visual { height: 110px; }
}
</style>
