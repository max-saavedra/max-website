<template>
  <div id="app-root">
    <IntroLoader />
    <WebGLBackground />
    <div class="cursor-glow" ref="glow" aria-hidden="true"></div>

    <NavBar :theme="theme" @toggle-theme="toggleTheme" />

    <main>
      <HeroSection />
      <SkillsMarquee />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <EventsSection />
      <!--
        Hidden until there is real content (data in portfolio.js is placeholder):
        <BlogSection />
        <SocialProofSection />
        Re-enable by uncommenting here, importing them below and adding them to navItems in NavBar.vue.
      -->
      <ContactSection />
    </main>

    <FooterSection />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, defineAsyncComponent } from "vue";
import IntroLoader from "./components/IntroLoader.vue";
import NavBar from "./components/NavBar.vue";
import HeroSection from "./components/HeroSection.vue";
import SkillsMarquee from "./components/SkillsMarquee.vue";
import ExperienceSection from "./components/ExperienceSection.vue";
import ProjectsSection from "./components/ProjectsSection.vue";
import SkillsSection from "./components/SkillsSection.vue";
import EventsSection from "./components/EventsSection.vue";
import ContactSection from "./components/ContactSection.vue";
import FooterSection from "./components/FooterSection.vue";

// Three.js is heavy: load the 3D scene in its own chunk so content paints first
const WebGLBackground = defineAsyncComponent(() => import("./components/WebGLBackground.vue"));

const THEME_KEY = "portfolio-theme";
const theme = ref("dark");

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
}

watch(theme, (val) => {
  document.documentElement.setAttribute("data-theme", val);
  try { localStorage.setItem(THEME_KEY, val); } catch { /* storage unavailable */ }
});

// Cursor spotlight (desktop only)
const glow = ref(null);
function onPointer(e) {
  if (glow.value) glow.value.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
}

onMounted(() => {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch { /* storage unavailable */ }
  if (saved) theme.value = saved;
  document.documentElement.setAttribute("data-theme", theme.value);
  window.addEventListener("pointermove", onPointer, { passive: true });
});
onUnmounted(() => window.removeEventListener("pointermove", onPointer));
</script>

<style>
#app-root {
  min-height: 100vh;
  position: relative;
  /* clip (not hidden) so off-screen reveal transforms never cause sideways scroll and sticky still works */
  overflow-x: clip;
}

main, footer {
  position: relative;
  z-index: 2;
}

.cursor-glow {
  position: fixed;
  top: 0;
  left: 0;
  width: 600px;
  height: 600px;
  margin: -300px 0 0 -300px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent-violet) 16%, transparent), transparent 60%);
  pointer-events: none;
  z-index: 1;
  transition: transform 0.25s var(--ease-out);
  will-change: transform;
}
@media (pointer: coarse) {
  .cursor-glow { display: none; }
}
</style>
