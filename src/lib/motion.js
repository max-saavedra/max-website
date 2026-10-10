/**
 * motion.js
 * =========
 * Shared motion layer: Lenis smooth scrolling, a global scroll/pointer state
 * read by the WebGL scene, and the v-reveal / v-tilt / v-magnetic directives.
 */
import Lenis from "lenis";

export const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const finePointer =
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

// Mutable state shared with the render loop (not reactive on purpose: read every frame)
export const motionState = {
  scroll: 0,      // px
  progress: 0,    // 0..1 over the whole document
  velocity: 0,
  pointerX: 0,    // -1..1
  pointerY: 0,    // -1..1
};

let lenis = null;

export function initMotion() {
  if (!prefersReducedMotion) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    lenis.on("scroll", (e) => {
      motionState.velocity = e.velocity;
    });
  }

  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    motionState.scroll = window.scrollY;
    motionState.progress = max > 0 ? window.scrollY / max : 0;
  };
  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  window.addEventListener(
    "pointermove",
    (e) => {
      motionState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      motionState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true }
  );
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = id === "hero" ? 0 : -24;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.6 });
  } else {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
  }
}

// ---------------------------------------------------------------------------
// v-reveal="'up'"  — fades/translates the element in when it enters viewport.
// Optional delay: v-reveal:120="'up'"  (ms, via arg)
// ---------------------------------------------------------------------------
const revealObserver =
  typeof window !== "undefined"
    ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      )
    : null;

export const vReveal = {
  mounted(el, binding) {
    el.dataset.reveal = binding.value || "up";
    if (binding.arg) el.style.setProperty("--d", `${binding.arg}ms`);
    if (prefersReducedMotion) {
      el.classList.add("is-visible");
      return;
    }
    revealObserver.observe(el);
  },
  unmounted(el) {
    revealObserver?.unobserve(el);
  },
};

// ---------------------------------------------------------------------------
// v-tilt — perspective tilt following the pointer, plus --mx/--my for glare.
// v-tilt="12" sets the max angle in degrees.
// ---------------------------------------------------------------------------
export const vTilt = {
  mounted(el, binding) {
    if (!finePointer || prefersReducedMotion) return;
    const max = Number(binding.value) || 10;
    el.dataset.tilt = "";

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.classList.add("is-tilting");
      el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) scale3d(1.02, 1.02, 1.02)`;
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
    };
    const onLeave = () => {
      el.classList.remove("is-tilting");
      el.style.transform = "";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el._tiltCleanup = () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  },
  unmounted(el) {
    el._tiltCleanup?.();
  },
};

// ---------------------------------------------------------------------------
// v-magnetic — element drifts toward the pointer while hovered.
// ---------------------------------------------------------------------------
export const vMagnetic = {
  mounted(el, binding) {
    if (!finePointer || prefersReducedMotion) return;
    const strength = Number(binding.value) || 0.3;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    };
    const onLeave = () => {
      el.style.transform = "";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el._magCleanup = () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  },
  unmounted(el) {
    el._magCleanup?.();
  },
};
