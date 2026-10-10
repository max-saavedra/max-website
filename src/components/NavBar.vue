<template>
  <header class="navbar fade-up" :class="{ scrolled: isScrolled }" style="--d: 200ms">
    <div class="nav-pill glass">
      <a href="#hero" class="navbar-logo" @click.prevent="go('hero')" aria-label="Back to top">
        <span class="logo-mark">M</span>
        <span class="logo-text">max<span class="gradient-text">.dev</span></span>
      </a>

      <nav class="navbar-links" aria-label="Main navigation" ref="linksEl">
        <span class="nav-indicator" :style="indicatorStyle"></span>
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="`#${item.id}`"
          class="nav-link"
          :class="{ active: activeSection === item.id }"
          :data-id="item.id"
          @click.prevent="go(item.id)"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="navbar-controls">
        <button
          class="btn-icon theme-toggle"
          :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`"
          @click="$emit('toggle-theme')"
        >
          <Transition name="spin" mode="out-in">
            <svg v-if="theme === 'dark'" key="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="17" height="17">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <svg v-else key="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="17" height="17">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </Transition>
        </button>

        <button class="hamburger btn-icon" :class="{ open: menuOpen }" aria-label="Toggle menu" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
          <span></span><span></span>
        </button>
      </div>

      <div class="scroll-progress" :style="{ transform: `scaleX(${progress})` }"></div>
    </div>

    <!-- Mobile fullscreen menu -->
    <Transition name="menu">
      <nav v-if="menuOpen" class="mobile-menu" aria-label="Mobile navigation">
        <a
          v-for="(item, i) in navItems"
          :key="item.id"
          :href="`#${item.id}`"
          class="mobile-link"
          :class="{ active: activeSection === item.id }"
          :style="{ '--i': i }"
          @click.prevent="mobileGo(item.id)"
        >
          <span class="mobile-num">0{{ i + 1 }}</span>{{ item.label }}
        </a>
      </nav>
    </Transition>
  </header>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick, watch } from "vue";
import { scrollToId } from "../lib/motion.js";

defineProps({ theme: { type: String, default: "dark" } });
defineEmits(["toggle-theme"]);

const isScrolled = ref(false);
const menuOpen = ref(false);
const activeSection = ref("hero");
const progress = ref(0);
const linksEl = ref(null);
const indicatorStyle = reactive({ width: "0px", transform: "translateX(0px)", opacity: 0 });

const navItems = [
  { id: "hero",       label: "Home"       },
  { id: "experience", label: "Experience" },
  { id: "projects",   label: "Projects"   },
  { id: "skills",     label: "Skills"     },
  { id: "events",     label: "Events"     },
  { id: "contact",    label: "Contact"    },
];

function go(id) {
  scrollToId(id);
}

function mobileGo(id) {
  menuOpen.value = false;
  setTimeout(() => scrollToId(id), 250);
}

function moveIndicator() {
  const container = linksEl.value;
  if (!container) return;
  const link = container.querySelector(`[data-id="${activeSection.value}"]`);
  if (!link) return;
  indicatorStyle.width = `${link.offsetWidth}px`;
  indicatorStyle.transform = `translateX(${link.offsetLeft}px)`;
  indicatorStyle.opacity = 1;
}

function onScroll() {
  isScrolled.value = window.scrollY > 40;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.value = max > 0 ? window.scrollY / max : 0;

  const probe = window.scrollY + window.innerHeight * 0.35;
  for (let i = navItems.length - 1; i >= 0; i--) {
    const el = document.getElementById(navItems[i].id);
    if (el && el.offsetTop <= probe) {
      activeSection.value = navItems[i].id;
      break;
    }
  }
}

watch(activeSection, () => nextTick(moveIndicator));

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", moveIndicator);
  onScroll();
  // Wait for web fonts so link widths are final
  (document.fonts?.ready ?? Promise.resolve()).then(moveIndicator);
});
onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", moveIndicator);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 14px;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  padding: 0 clamp(0.75rem, 3vw, 1.5rem);
  pointer-events: none;
}

.nav-pill {
  pointer-events: auto;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 1080px;
  height: 60px;
  padding: 0 0.6rem 0 1rem;
  border-radius: 999px;
  overflow: hidden;
  transition: background var(--transition-normal), box-shadow var(--transition-normal);
}
.navbar:not(.scrolled) .nav-pill {
  background: transparent;
  box-shadow: none;
  border-color: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: var(--text-primary);
  flex-shrink: 0;
}
.logo-mark {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  font-family: var(--font-display);
  font-weight: 700;
  color: #fff;
  background: var(--gradient-brand);
  box-shadow: 0 6px 20px -6px var(--accent-violet);
  transition: transform var(--transition-normal);
}
.navbar-logo:hover .logo-mark { transform: rotate(-12deg) scale(1.08); }
.logo-text {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
}

.navbar-links {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
}
.nav-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  height: 36px;
  margin-top: -18px;
  border-radius: 999px;
  background: var(--glass-bg-strong);
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 var(--glass-highlight);
  transition: transform 500ms var(--ease-out), width 500ms var(--ease-out), opacity 300ms;
  z-index: 0;
}
.nav-link {
  position: relative;
  z-index: 1;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  padding: 0.5rem 0.95rem;
  text-decoration: none;
  transition: color var(--transition-fast);
}
.nav-link:hover, .nav-link.active { color: var(--text-primary); }

.navbar-controls {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
  margin-left: auto;
}
.theme-toggle { overflow: hidden; }

.spin-enter-active, .spin-leave-active { transition: transform 0.35s var(--ease-out), opacity 0.35s; }
.spin-enter-from { transform: rotate(-90deg) scale(0.5); opacity: 0; }
.spin-leave-to   { transform: rotate(90deg) scale(0.5); opacity: 0; }

.scroll-progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--gradient-brand);
  transform-origin: left;
  pointer-events: none;
}

/* Hamburger */
.hamburger { display: none; flex-direction: column; gap: 5px; }
.hamburger span {
  display: block;
  width: 16px;
  height: 1.5px;
  background: currentColor;
  border-radius: 2px;
  transition: transform var(--transition-normal);
}
.hamburger.open span:nth-child(1) { transform: translateY(3.25px) rotate(45deg); }
.hamburger.open span:nth-child(2) { transform: translateY(-3.25px) rotate(-45deg); }

/* Mobile menu */
.mobile-menu {
  pointer-events: auto;
  position: fixed;
  inset: 88px 12px auto 12px;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: var(--radius-lg);
  background: var(--glass-bg-strong);
  backdrop-filter: blur(28px) saturate(170%);
  -webkit-backdrop-filter: blur(28px) saturate(170%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}
.mobile-link {
  display: flex;
  align-items: baseline;
  gap: 0.9rem;
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 0.55rem 0.75rem;
  text-decoration: none;
  border-radius: var(--radius-sm);
  animation: fadeUp 0.5s var(--ease-out) both;
  animation-delay: calc(var(--i) * 50ms);
}
.mobile-link.active { color: var(--text-primary); }
.mobile-num { font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent-cyan); }

.menu-enter-active, .menu-leave-active { transition: opacity 0.3s, transform 0.4s var(--ease-out); }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateY(-12px) scale(0.98); }

@media (max-width: 900px) {
  .navbar-links { display: none; }
  .hamburger { display: inline-flex; }
  .navbar .nav-pill,
  .navbar:not(.scrolled) .nav-pill {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(160%);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(160%);
    border-color: var(--glass-border);
  }
}
</style>
