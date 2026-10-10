<template>
  <section id="skills" class="section">
    <div class="container">
      <div class="section-head">
        <span class="section-label" v-reveal="'up'">03 / Technical Arsenal</span>
        <h2 class="section-title" v-reveal:100="'blur'">Skills & <span class="gradient-text">certifications</span></h2>
        <p class="section-subtitle" v-reveal:200="'up'">
          Organized by domain. Each certification represents a practised competency, not just a badge collected.
        </p>
      </div>

      <!-- Bento grid of domains -->
      <div class="bento">
        <div
          v-for="([domain, tools], idx) in domains"
          :key="domain"
          class="bento-slot"
          :class="`s${idx}`"
          v-reveal:[idx*90]="'flip'"
        >
          <div class="card domain-card" v-tilt="8">
            <div class="domain-top">
              <span class="domain-icon" :style="{ '--h': idx * 55 }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
                  <path :d="iconFor(domain)" />
                </svg>
              </span>
              <span class="domain-count">{{ String(tools.length).padStart(2, "0") }}</span>
            </div>
            <h3 class="domain-name">{{ domain }}</h3>
            <div class="tools-row">
              <span v-for="tool in tools" :key="tool" class="skill-pill">{{ tool }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Certifications -->
      <div class="cert-head" v-reveal="'up'">
        <h3 class="cert-title">Certifications & badges <span class="cert-total">{{ certifications.length }}</span></h3>
        <div class="filters glass" role="tablist" aria-label="Filter certifications by issuer">
          <button
            v-for="f in filters"
            :key="f"
            class="filter-btn"
            :class="{ active: activeFilter === f }"
            role="tab"
            :aria-selected="activeFilter === f"
            @click="activeFilter = f"
          >{{ f }}</button>
        </div>
      </div>

      <TransitionGroup name="cert" tag="div" class="cert-grid">
        <div v-for="cert in filteredCerts" :key="cert.id" class="cert-slot">
          <div class="card cert-card" v-tilt="10">
            <div class="cert-logo-wrap">
              <img v-if="cert.logo" :src="cert.logo" :alt="`${cert.issuer} logo`" class="cert-logo" loading="lazy" />
            </div>
            <div class="cert-info">
              <h4 class="cert-name">{{ cert.name }}</h4>
              <p class="cert-meta">{{ cert.issuer }} · {{ cert.year }}</p>
            </div>
            <div class="cert-actions">
              <a v-if="cert.file" :href="cert.file" target="_blank" rel="noopener" class="cert-action" :aria-label="`View ${cert.name} certificate`" title="View certificate">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </a>
              <a v-if="cert.verify" :href="cert.verify" target="_blank" rel="noopener" class="cert-action" :aria-label="`Verify ${cert.name}`" title="Verify">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
              </a>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Organizations -->
      <div class="orgs" v-reveal="'up'">
        <span class="orgs-label">Learned & collaborated with</span>
        <div class="orgs-row">
          <a v-for="org in endorsements" :key="org.name" :href="org.url" target="_blank" rel="noopener" class="org glass" :title="org.name">
            <img :src="org.logo" :alt="org.name" loading="lazy" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { skills, certifications, endorsements } from "../assets/data/portfolio.js";

const domains = Object.entries(skills);

const ICONS = {
  Systems: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01",
  "AI & ML": "M12 2a4 4 0 0 1 4 4v1a3 3 0 0 1 3 3v1a3 3 0 0 1-1 5.2V18a4 4 0 0 1-6 3.46A4 4 0 0 1 6 18v-1.8A3 3 0 0 1 5 11v-1a3 3 0 0 1 3-3V6a4 4 0 0 1 4-4zM12 2v20",
  Backend: "M12 2C7 2 3 3.8 3 6v12c0 2.2 4 4 9 4s9-1.8 9-4V6c0-2.2-4-4-9-4zM3 6c0 2.2 4 4 9 4s9-1.8 9-4M3 12c0 2.2 4 4 9 4s9-1.8 9-4",
  Cloud: "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z",
  Frontend: "M3 4h18v14H3zM3 8h18M8 21h8M12 18v3",
  "Research & Tools": "M10 2v6L4 20a1 1 0 0 0 .9 1.5h14.2A1 1 0 0 0 20 20L14 8V2M8 2h8M7 15h10",
};
const iconFor = (d) => ICONS[d] || "M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z";

// Group issuers into readable filter buckets
function bucket(issuer) {
  if (/huawei/i.test(issuer)) return "Huawei";
  if (/google/i.test(issuer)) return "Google";
  if (/universidad|linux foundation/i.test(issuer)) return "Academic";
  return "Other";
}
const filters = ["All", ...new Set(certifications.map((c) => bucket(c.issuer)))];
const activeFilter = ref("All");
const filteredCerts = computed(() =>
  activeFilter.value === "All" ? certifications : certifications.filter((c) => bucket(c.issuer) === activeFilter.value)
);
</script>

<style scoped>
/* Bento */
.bento {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: clamp(4rem, 8vw, 6rem);
}
.bento-slot { display: flex; }
.bento-slot.s1,
.bento-slot.s3,
.bento-slot.s4 { grid-column: span 2; }

.domain-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.6rem;
  border-radius: var(--radius-lg);
}
.domain-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.domain-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  color: #fff;
  background: linear-gradient(135deg, hsl(calc(255 + var(--h)) 85% 62%), hsl(calc(195 + var(--h)) 90% 50%));
  box-shadow: 0 10px 24px -8px hsl(calc(230 + var(--h)) 85% 55% / 0.8);
}
.domain-count {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px var(--border-default);
}
.domain-name { font-size: 1.35rem; }
.tools-row { display: flex; flex-wrap: wrap; gap: 0.45rem; }
.skill-pill {
  font-family: var(--font-mono);
  font-size: 0.76rem;
  padding: 0.35em 0.8em;
  border-radius: 999px;
  color: var(--text-secondary);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  transition: all var(--transition-fast);
}
.skill-pill:hover {
  color: var(--text-primary);
  border-color: var(--accent-cyan);
  box-shadow: 0 0 16px -4px var(--accent-cyan);
}

/* Cert header & filters */
.cert-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.cert-title { font-size: clamp(1.5rem, 3vw, 2rem); display: flex; align-items: center; gap: 0.75rem; }
.cert-total {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: var(--gradient-brand);
  color: #fff;
}
.filters {
  display: flex;
  gap: 0.25rem;
  padding: 0.3rem;
  border-radius: 999px;
  flex-wrap: wrap;
}
.filter-btn {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  color: var(--text-secondary);
  transition: all var(--transition-normal);
}
.filter-btn:hover { color: var(--text-primary); }
.filter-btn.active {
  color: #fff;
  background: linear-gradient(120deg, var(--accent-violet), var(--accent-cyan));
  box-shadow: 0 6px 18px -6px var(--accent-violet);
}

/* Cert grid */
.cert-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 0.9rem;
}
.cert-slot { display: flex; }
.cert-card {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.1rem;
}
.cert-logo-wrap {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  display: grid;
  place-items: center;
  padding: 6px;
}
.cert-logo { max-width: 100%; max-height: 100%; object-fit: contain; }
.cert-info { flex: 1; min-width: 0; }
.cert-name {
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 0.15rem;
}
.cert-meta { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); }
.cert-actions { display: flex; gap: 0.35rem; flex-shrink: 0; }
.cert-action {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--text-secondary);
  border: 1px solid var(--glass-border);
  transition: all var(--transition-fast);
}
.cert-action:hover { color: var(--text-primary); border-color: var(--accent-cyan); box-shadow: 0 0 14px -4px var(--accent-cyan); }

.cert-move, .cert-enter-active, .cert-leave-active { transition: all 0.5s var(--ease-out); }
.cert-enter-from, .cert-leave-to { opacity: 0; transform: scale(0.9) translateY(16px); }
.cert-leave-active { position: absolute; }

/* Orgs */
.orgs {
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}
.orgs-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.orgs-row { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
.org {
  display: grid;
  place-items: center;
  width: 130px;
  height: 64px;
  border-radius: var(--radius-md);
  padding: 0.85rem 1.2rem;
  transition: transform var(--transition-normal);
}
.org:hover { transform: translateY(-4px); }
.org img { max-height: 100%; max-width: 100%; object-fit: contain; transition: filter var(--transition-normal), opacity var(--transition-normal); }
:global([data-theme="dark"] .orgs .org img) { filter: brightness(0) invert(1); opacity: 0.85; }
:global([data-theme] .orgs .org:hover img) { filter: none; opacity: 1; }

@media (max-width: 900px) {
  .bento { grid-template-columns: 1fr 1fr; }
  .bento-slot.s1, .bento-slot.s3, .bento-slot.s4 { grid-column: span 1; }
}
@media (max-width: 600px) {
  .bento { grid-template-columns: 1fr; }
}
</style>
