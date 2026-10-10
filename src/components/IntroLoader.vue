<template>
  <Transition name="loader">
    <div v-if="visible" class="loader" aria-hidden="true">
      <div class="loader-inner">
        <div class="loader-mark">
          <span v-for="(c, i) in 'MAX'" :key="i" class="loader-char" :style="{ '--i': i }">{{ c }}</span>
        </div>
        <div class="loader-bar"><span :style="{ transform: `scaleX(${count / 100})` }"></span></div>
        <div class="loader-count">{{ String(count).padStart(3, "0") }}</div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { prefersReducedMotion } from "../lib/motion.js";

const visible = ref(!prefersReducedMotion);
const count = ref(0);

onMounted(() => {
  if (!visible.value) return;
  const duration = 1300;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    count.value = Math.round((1 - Math.pow(1 - t, 3)) * 100);
    if (t < 1) requestAnimationFrame(step);
    else setTimeout(() => (visible.value = false), 180);
  };
  requestAnimationFrame(step);
});
</script>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  background: var(--bg-base);
}
.loader-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}
.loader-mark {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(3rem, 10vw, 6rem);
  letter-spacing: 0.1em;
  overflow: hidden;
  line-height: 1;
}
.loader-char {
  display: inline-block;
  background: var(--gradient-brand);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: rise 0.8s var(--ease-out) both;
  animation-delay: calc(var(--i) * 90ms);
}
@keyframes rise {
  from { transform: translateY(110%); }
  to   { transform: none; }
}
.loader-bar {
  width: 180px;
  height: 2px;
  background: var(--border-default);
  border-radius: 2px;
  overflow: hidden;
}
.loader-bar span {
  display: block;
  height: 100%;
  background: var(--gradient-brand);
  transform-origin: left;
}
.loader-count {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  color: var(--text-muted);
}

.loader-leave-active {
  transition: clip-path 0.9s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.9s ease;
}
.loader-leave-to {
  clip-path: inset(0 0 100% 0);
}
</style>
