<template>
  <section id="contact" class="section contact">
    <div class="container">
      <div class="cta-block">
        <span class="section-label" v-reveal="'up'">05 / Contact</span>
        <h2 class="cta-title" v-reveal:100="'blur'">
          Let's build something<br /><span class="gradient-text">intelligent.</span>
        </h2>
        <p class="section-subtitle cta-sub" v-reveal:200="'up'">
          Open to full-time roles, research collaborations and interesting technical conversations.
        </p>
        <div class="cta-actions" v-reveal:300="'up'">
          <a v-magnetic="0.3" :href="`mailto:${personal.email}`" class="btn btn-primary btn-xl">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            Say hello
          </a>
          <button v-magnetic="0.3" class="btn btn-ghost btn-xl" @click="copyEmail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            {{ copied ? "Copied!" : personal.email }}
          </button>
        </div>
      </div>

      <div class="contact-layout">
        <div class="info-col">
          <div v-reveal="'left'">
            <div class="card info-card" v-tilt="5">
              <div class="info-head">Phone</div>
              <div v-for="p in personal.phone" :key="p.label" class="phone-row">
                <span class="phone-label">{{ p.label }}</span>
                <span class="phone-num">{{ p.number }}</span>
              </div>
            </div>
          </div>

          <div v-reveal:100="'left'">
            <div class="card info-card" v-tilt="5">
              <div class="info-head">Elsewhere</div>
              <div class="social-grid">
                <a v-for="s in socialLinks" :key="s.name" :href="s.url" target="_blank" rel="noopener" class="social-tile">
                  <SocialIcon :name="s.name" :size="20" />
                  <span>{{ s.label }}</span>
                  <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M7 17L17 7M7 7h10v10"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div v-reveal:200="'left'">
            <div class="card info-card" v-tilt="5">
              <div class="info-head">Outside the code</div>
              <p class="interests">{{ personal.interests }}</p>
              <p class="location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ personal.location }}
              </p>
            </div>
          </div>
        </div>

        <div class="photos-col" v-reveal:150="'scale'">
          <div class="polaroid p1 glass" v-tilt="12">
            <img :src="profilePhotoUrl" :alt="personal.name" loading="lazy" @error="onImgError" />
            <span class="caption">Me</span>
          </div>
          <div class="polaroid p2 glass" v-tilt="12">
            <img :src="petPhotoUrl" :alt="`${personal.name}'s dog`" loading="lazy" @error="onImgError" />
            <span class="caption">My companion</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { personal, social } from "../assets/data/portfolio.js";
import SocialIcon from "./SocialIcon.vue";

const copied = ref(false);
function copyEmail() {
  navigator.clipboard?.writeText(personal.email).then(() => {
    copied.value = true;
    setTimeout(() => (copied.value = false), 2200);
  });
}

const socialLinks = [
  { name: "github", url: social.github, label: "GitHub" },
  { name: "linkedin", url: social.linkedin, label: "LinkedIn" },
  { name: "orcid", url: social.orcid, label: "ORCID" },
  { name: "blog", url: social.blog, label: "Blog" },
].filter((s) => s.url);

const profilePhotoUrl = new URL(`../assets/profile/${personal.profilePhoto}`, import.meta.url).href;
const petPhotoUrl = new URL(`../assets/profile/${personal.petPhoto}`, import.meta.url).href;
function onImgError(e) {
  e.target.src = "https://placehold.co/360x420/0a0c1a/8b6cff?text=Photo";
}
</script>

<style scoped>
.cta-block {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: clamp(4rem, 8vw, 6rem);
}
.cta-title {
  font-size: clamp(2.8rem, 9vw, 7rem);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.045em;
  margin-bottom: 1.5rem;
}
.cta-sub { margin: 0 auto 2.5rem; }
.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
.btn-xl { font-size: 1rem; padding: 1.05rem 1.9rem; transition: transform 0.35s var(--ease-out), box-shadow var(--transition-normal), background var(--transition-normal); }

.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
}
.info-col { display: flex; flex-direction: column; gap: 1.1rem; }
.info-card { padding: 1.5rem 1.6rem; }
.info-head {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-cyan);
  margin-bottom: 0.9rem;
}
.phone-row { display: flex; align-items: center; gap: 1rem; padding: 0.25rem 0; }
.phone-label {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  min-width: 80px;
}
.phone-num { font-family: var(--font-mono); font-size: 0.95rem; }

.social-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
.social-tile {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 0.9rem;
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  font-size: 0.88rem;
  font-weight: 500;
  transition: all var(--transition-normal);
}
.social-tile .arrow { margin-left: auto; opacity: 0.4; transition: transform var(--transition-normal), opacity var(--transition-normal); }
.social-tile:hover { border-color: var(--accent-violet); box-shadow: 0 0 22px -6px var(--accent-violet); }
.social-tile:hover .arrow { opacity: 1; transform: translate(2px, -2px); }

.interests { font-size: 0.95rem; color: var(--text-secondary); font-style: italic; margin-bottom: 0.75rem; }
.location {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Polaroids */
.photos-col {
  position: relative;
  height: 520px;
}
.polaroid {
  position: absolute;
  width: 62%;
  padding: 0.75rem 0.75rem 2.6rem;
  border-radius: var(--radius-md);
}
.polaroid img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: 10px;
}
.caption {
  position: absolute;
  left: 0; right: 0; bottom: 0.75rem;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
}
.p1 { left: 0; top: 0; rotate: -6deg; z-index: 2; }
.p2 { right: 0; bottom: 0; rotate: 7deg; z-index: 1; }
.polaroid:hover { z-index: 3; }

@media (max-width: 900px) {
  .contact-layout { grid-template-columns: 1fr; }
  .photos-col { height: 440px; max-width: 420px; width: 100%; margin: 0 auto; order: -1; }
}
@media (max-width: 480px) {
  .social-grid { grid-template-columns: 1fr; }
  .photos-col { height: 360px; }
  .btn-xl { width: 100%; justify-content: center; font-size: 0.85rem; white-space: normal; word-break: break-all; }
}
</style>
