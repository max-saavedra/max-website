<template>
  <span ref="el">{{ display }}{{ suffix }}</span>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { prefersReducedMotion } from "../lib/motion.js";

const props = defineProps({
  to: { type: Number, required: true },
  suffix: { type: String, default: "" },
  duration: { type: Number, default: 1800 },
  delay: { type: Number, default: 0 },
});

const el = ref(null);
const display = ref(prefersReducedMotion ? props.to : 0);
let observer;

function run() {
  const start = performance.now() + props.delay;
  const step = (now) => {
    const t = Math.min(Math.max((now - start) / props.duration, 0), 1);
    display.value = Math.round((1 - Math.pow(1 - t, 4)) * props.to);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

onMounted(() => {
  if (prefersReducedMotion) return;
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      run();
      observer.disconnect();
    }
  }, { threshold: 0.6 });
  observer.observe(el.value);
});
onUnmounted(() => observer?.disconnect());
</script>
