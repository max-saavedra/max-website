<template>
  <section id="experience" class="section">
    <div class="container">
      <div class="section-head">
        <span class="section-label" v-reveal="'up'">01 / Experience & Research</span>
        <h2 class="section-title" v-reveal:100="'blur'">Where theory <span class="gradient-text">meets practice</span></h2>
        <p class="section-subtitle" v-reveal:200="'up'">
          Professional roles and research contributions that shaped my engineering perspective.
        </p>
      </div>

      <div class="exp-layout">
        <!-- Timeline -->
        <div class="timeline" ref="timelineEl">
          <div class="timeline-rail"><div class="timeline-fill" :style="{ transform: `scaleY(${fill})` }"></div></div>

          <div v-for="(item, idx) in experience" :key="item.id" class="timeline-item" v-reveal:[idx*120]="'left'">
            <div class="timeline-node"><span></span></div>
            <article class="card exp-card" v-tilt="4">
              <div class="exp-header">
                <span class="exp-period">{{ item.period }}</span>
                <span class="exp-index">0{{ idx + 1 }}</span>
              </div>
              <h3 class="exp-role">{{ item.role }}</h3>
              <p class="exp-company">{{ item.company }}</p>
              <p class="exp-location">{{ item.location }}</p>
              <p class="exp-desc">{{ item.description }}</p>
              <ul class="achievement-list">
                <li v-for="(ach, i) in item.achievements" :key="i">
                  <span class="ach-bullet"></span>{{ ach }}
                </li>
              </ul>
              <div class="tags">
                <span v-for="tech in item.tech" :key="tech" class="tag">{{ tech }}</span>
              </div>
            </article>
          </div>
        </div>

        <!-- Research (sticky) -->
        <aside class="research-col">
          <div class="research-sticky">
            <h3 class="column-heading" v-reveal="'up'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              Research & Publications
            </h3>

            <div v-for="(pub, idx) in publications" :key="pub.id" v-reveal:[idx*120]="'right'">
              <article class="card pub-card" v-tilt="6">
                <div class="pub-glow" aria-hidden="true"></div>
                <span class="pub-badge">{{ pub.type === "paper" ? "Peer-reviewed · " + pub.year : "Whitepaper" }}</span>
                <h4 class="pub-title">{{ pub.title }}</h4>
                <p class="pub-authors">{{ pub.authors }}</p>
                <p class="pub-venue"><em>{{ pub.venue }}</em></p>
                <p class="pub-abstract">{{ pub.abstract }}</p>
                <div class="tags">
                  <span v-for="tag in pub.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
                <a v-if="pub.doi" :href="pub.doi" target="_blank" rel="noopener" class="btn btn-primary btn-sm pub-doi">
                  Read the paper
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <path d="M7 17L17 7M7 7h10v10"/>
                  </svg>
                </a>
              </article>
            </div>

            <div v-if="publications.length === 0" class="card">
              <p class="muted">
                Research in progress. Check my
                <a :href="social.github" target="_blank" rel="noopener">GitHub</a> meanwhile.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { experience, publications, social } from "../assets/data/portfolio.js";

// Scroll-linked progress for the timeline rail
const timelineEl = ref(null);
const fill = ref(0);

function onScroll() {
  const el = timelineEl.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const start = window.innerHeight * 0.7;
  const p = (start - r.top) / r.height;
  fill.value = Math.min(Math.max(p, 0), 1);
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
onUnmounted(() => window.removeEventListener("scroll", onScroll));
</script>

<style scoped>
.exp-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: start;
}

/* Timeline */
.timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-left: 2.75rem;
}
.timeline-rail {
  position: absolute;
  left: 11px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border-default);
  border-radius: 2px;
  overflow: hidden;
}
.timeline-fill {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, var(--accent-violet), var(--accent-cyan), var(--accent-pink));
  transform-origin: top;
  box-shadow: 0 0 12px var(--accent-cyan);
}
.timeline-item { position: relative; }
.timeline-node {
  position: absolute;
  left: calc(-2.75rem + 2px);
  top: 1.6rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--bg-base);
  border: 2px solid var(--accent-cyan);
  box-shadow: 0 0 18px -2px var(--accent-cyan);
}
.timeline-node span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-cyan);
}

.exp-card { padding: 1.75rem; }
.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.9rem;
}
.exp-period {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--accent-cyan);
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent-cyan) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent-cyan) 25%, transparent);
}
.exp-index {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px var(--border-default);
}
.exp-role { font-size: 1.45rem; margin-bottom: 0.35rem; }
.exp-company { font-weight: 500; color: var(--text-primary); font-size: 0.95rem; }
.exp-location { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.9rem; }
.exp-desc { font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 1rem; }

.achievement-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}
.achievement-list li {
  display: flex;
  gap: 0.7rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.55;
}
.ach-bullet {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  margin-top: 0.5em;
  border-radius: 2px;
  background: var(--gradient-brand);
  transform: rotate(45deg);
}
.tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }

/* Research */
.research-col { align-self: stretch; }
.research-sticky {
  position: sticky;
  top: calc(var(--nav-h) + 2rem);
}
.column-heading {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 1.25rem;
}
.pub-card {
  overflow: hidden;
  padding: 2rem;
}
.pub-glow {
  position: absolute;
  top: -40%;
  right: -30%;
  width: 70%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent-pink) 35%, transparent), transparent 70%);
  filter: blur(30px);
  z-index: -1;
  animation: pulse 6s ease-in-out infinite;
}
@keyframes pulse { 50% { transform: scale(1.3); opacity: 0.6; } }
.pub-badge {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-pink);
  margin-bottom: 1rem;
}
.pub-title {
  font-size: 1.35rem;
  line-height: 1.25;
  margin-bottom: 0.75rem;
}
.pub-authors { font-size: 0.85rem; color: var(--accent-cyan); margin-bottom: 0.2rem; }
.pub-venue { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem; }
.pub-abstract { font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.25rem; }
.pub-doi { margin-top: 1.5rem; }
.muted { color: var(--text-muted); }

@media (max-width: 900px) {
  .exp-layout { grid-template-columns: 1fr; }
  .research-sticky { position: static; }
  .timeline { padding-left: 2.25rem; }
  .timeline-node { left: calc(-2.25rem + 2px); }
}
</style>
