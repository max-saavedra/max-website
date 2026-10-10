<template>
  <section id="events" class="section">
    <div class="container">
      <div class="section-head">
        <span class="section-label" v-reveal="'up'">04 / Community</span>
        <h2 class="section-title" v-reveal:100="'blur'">Events & <span class="gradient-text">community</span></h2>
        <p class="section-subtitle" v-reveal:200="'up'">
          Staying connected with the engineering community as a volunteer, participant and learner.
        </p>
      </div>

      <div class="events-grid" ref="gridEl">
        <div v-for="(event, idx) in events" :key="event.id" class="event-slot" :class="`e${idx % 3}`" v-reveal:[idx*120]="'up'">
          <article class="card event-card" v-tilt="8">
            <div class="event-photo-wrap">
              <img
                :src="getEventPhoto(event.photo)"
                :alt="`${event.name} photo`"
                class="event-photo"
                :style="{ transform: `translate3d(0, ${offsets[idx] || 0}px, 0) scale(1.18)` }"
                loading="lazy"
                @error="onImgError"
              />
              <div class="photo-shade"></div>
              <span class="event-role glass">{{ event.role }}</span>
            </div>
            <div class="event-body">
              <div class="event-meta">
                <span>{{ event.date }}</span>
                <span class="dot-sep"></span>
                <span>{{ event.location }}</span>
              </div>
              <h3 class="event-name">{{ event.name }}</h3>
              <p class="event-desc">{{ event.description }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { events } from "../assets/data/portfolio.js";
import { prefersReducedMotion } from "../lib/motion.js";

const FALLBACK = "https://placehold.co/600x340/0a0c1a/8b6cff?text=Event";

function getEventPhoto(filename) {
  if (!filename) return FALLBACK;
  return new URL(`../assets/events/${filename}`, import.meta.url).href;
}
function onImgError(e) {
  e.target.src = FALLBACK;
}

// Inner-image parallax
const gridEl = ref(null);
const offsets = ref([]);
function onScroll() {
  if (!gridEl.value) return;
  const vh = window.innerHeight;
  offsets.value = [...gridEl.value.querySelectorAll(".event-photo-wrap")].map((wrap) => {
    const r = wrap.getBoundingClientRect();
    const center = (r.top + r.height / 2 - vh / 2) / vh; // -1..1 while on screen
    return Math.max(Math.min(center, 1), -1) * -24;
  });
}

onMounted(() => {
  if (prefersReducedMotion) return;
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
onUnmounted(() => window.removeEventListener("scroll", onScroll));
</script>

<style scoped>
.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: start;
}
.event-slot { display: flex; }
.event-slot.e1 { margin-top: 4rem; }
.event-slot.e2 { margin-top: 2rem; }

.event-card {
  width: 100%;
  padding: 0;
  overflow: hidden;
  border-radius: var(--radius-lg);
}
.event-photo-wrap {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}
.event-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter var(--transition-slow);
  filter: saturate(0.9);
}
.event-card:hover .event-photo { filter: saturate(1.15); }
.photo-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(5, 6, 15, 0.75), transparent 55%);
}
.event-role {
  position: absolute;
  top: 1rem;
  left: 1rem;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #fff;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.28);
}
.event-body { padding: 1.5rem 1.6rem 1.75rem; }
.event-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--accent-cyan);
  margin-bottom: 0.6rem;
}
.dot-sep { width: 3px; height: 3px; border-radius: 50%; background: var(--text-muted); }
.event-name { font-size: 1.2rem; line-height: 1.25; margin-bottom: 0.7rem; }
.event-desc { font-size: 0.86rem; color: var(--text-secondary); line-height: 1.65; }

@media (max-width: 900px) {
  .events-grid { grid-template-columns: 1fr 1fr; }
  .event-slot.e1, .event-slot.e2 { margin-top: 0; }
}
@media (max-width: 600px) {
  .events-grid { grid-template-columns: 1fr; }
}
</style>
