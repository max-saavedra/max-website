<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-giant" aria-hidden="true">{{ personal.shortName }}</div>
      <div class="footer-inner glass">
        <span class="footer-name">© {{ year }} {{ personal.name }}</span>
        <span class="footer-copy">Built with Vue 3, Three.js & Vite</span>
        <button class="to-top" @click="scrollToId('hero')" aria-label="Back to top">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { personal } from "../assets/data/portfolio.js";
import { scrollToId } from "../lib/motion.js";

const year = new Date().getFullYear();
</script>

<style scoped>
.footer {
  padding: 2rem 0 1.5rem;
  overflow: hidden;
}
.footer-giant {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(3.5rem, 15vw, 13rem);
  line-height: 0.85;
  letter-spacing: -0.05em;
  text-align: center;
  white-space: nowrap;
  color: transparent;
  -webkit-text-stroke: 1px var(--border-default);
  background: linear-gradient(to bottom, color-mix(in srgb, var(--accent-violet) 30%, transparent), transparent 80%);
  -webkit-background-clip: text;
  background-clip: text;
  margin-bottom: 1.5rem;
  user-select: none;
}
.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.85rem 0.85rem 0.85rem 1.4rem;
  border-radius: 999px;
}
.footer-name { font-size: 0.82rem; color: var(--text-secondary); }
.footer-copy { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); }
.to-top {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #fff;
  background: var(--gradient-brand);
  transition: transform var(--transition-normal);
}
.to-top:hover { transform: translateY(-3px); }

@media (max-width: 640px) {
  .footer-inner { justify-content: center; text-align: center; border-radius: var(--radius-md); padding: 1rem; }
}
</style>
