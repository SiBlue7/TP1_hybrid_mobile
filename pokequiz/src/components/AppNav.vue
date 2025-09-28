<template>
  <nav class="app-nav" role="navigation" aria-label="Navigation principale">
    <RouterLink
      :to="{ path: '/' }"
      class="tab"
      :class="{ active: isActive('/') }"
      aria-label="Accueil"
    >
      <svg viewBox="0 0 24 24" class="ico">
        <path
          d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"
        />
      </svg>
      <span>Accueil</span>
    </RouterLink>

    <RouterLink
      :to="{ path: '/quiz' }"
      class="tab"
      :class="{ active: isActive('/quiz') }"
      aria-label="Quiz"
    >
      <svg viewBox="0 0 24 24" class="ico">
        <path d="M12 3a7 7 0 0 0-7 7h4a3 3 0 1 1 3 3v4h3v-4a7 7 0 0 0-3-13z" />
      </svg>
      <span>Quiz</span>
    </RouterLink>

    <RouterLink
      :to="{ path: '/leaderboard' }"
      class="tab"
      :class="{ active: isActive('/leaderboard') }"
      aria-label="Classement"
    >
      <svg viewBox="0 0 24 24" class="ico">
        <path
          d="M7 21H4a1 1 0 0 1-1-1v-7h4v8zM14 21H9V8h5v13zM21 21h-3V4h4v16a1 1 0 0 1-1 1z"
        />
      </svg>
      <span>Top</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
const isActive = (p) => route.path === p;
</script>

<style scoped>
.app-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--nav-h);
  padding-bottom: env(safe-area-inset-bottom);
  background: color-mix(in oklab, var(--surface), black 6%);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1000;
}
.tab {
  flex: 1;
  height: calc(var(--nav-h) - 10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  text-decoration: none;
  gap: 4px;
  font-weight: 600;
  min-width: 80px;
}
.tab.active {
  color: var(--text);
}
.ico {
  width: 22px;
  height: 22px;
  fill: currentColor;
}
@media (min-width: 768px) {
  .app-nav {
    left: 50%;
    transform: translateX(-50%);
    max-width: 680px;
    border-radius: 16px 16px 0 0;
  }
}
</style>
