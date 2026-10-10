<template>
  <div class="marquee-band" aria-label="Technologies">
    <div class="band band-a glass">
      <div class="track">
        <template v-for="n in 2" :key="`a${n}`">
          <span v-for="item in rowA" :key="`a${n}-${item}`" class="item">
            {{ item }}<span class="sep">✦</span>
          </span>
        </template>
      </div>
    </div>
    <div class="band band-b">
      <div class="track reverse">
        <template v-for="n in 2" :key="`b${n}`">
          <span v-for="item in rowB" :key="`b${n}-${item}`" class="item outline">
            {{ item }}<span class="sep">/</span>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { skills } from "../assets/data/portfolio.js";

const all = [...new Set(Object.values(skills).flat())];
const half = Math.ceil(all.length / 2);
const rowA = all.slice(0, half);
const rowB = all.slice(half);
</script>

<style scoped>
.marquee-band {
  position: relative;
  z-index: 2;
  padding: 3rem 0;
  overflow: hidden;
}
.band {
  overflow: hidden;
  white-space: nowrap;
  padding: 1.1rem 0;
}
.band-a {
  border-radius: 0;
  border-left: none;
  border-right: none;
  transform: rotate(-2.5deg) scale(1.05);
}
.band-b {
  transform: rotate(1.5deg) scale(1.05);
  margin-top: -0.25rem;
}
.track {
  display: inline-flex;
  animation: scroll 45s linear infinite;
}
.track.reverse { animation-direction: reverse; animation-duration: 55s; }
.marquee-band:hover .track { animation-play-state: paused; }

@keyframes scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.item {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.5rem, 3.5vw, 2.6rem);
  letter-spacing: -0.02em;
  color: var(--text-primary);
  padding: 0 0.2rem;
}
.item.outline {
  color: transparent;
  -webkit-text-stroke: 1px var(--text-secondary);
}
.sep {
  margin: 0 1.6rem;
  font-size: 0.6em;
  background: var(--gradient-brand);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-stroke: 0;
}
</style>
