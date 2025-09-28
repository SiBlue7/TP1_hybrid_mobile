<template>
  <div style="position: relative; z-index: 1">
    <main class="page">
      <section class="card">
        <h1 style="margin: 0 0 12px">🏆 Classement (Top 5)</h1>
        <ol style="margin: 0; padding-left: 18px">
          <li v-for="(s, i) in top" :key="i" style="margin: 8px 0">
            <strong>{{ s.player }}</strong> — {{ s.score }}/10 —
            {{ formatTime(s.timeSec) }}
          </li>
        </ol>
        <div style="height: 8px"></div>
        <RouterLink to="/quiz" class="btn">Rejouer</RouterLink>
      </section>
    </main>
  </div>
  <PokeSides :images="images" :speed="100" :width="150" :gap="18" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { top5 } from "@/services/storage";

import PokeSides from "@/components/PokeSides.vue";
import { usePokeImages } from "@/services/usePokeImages";

const { images, load } = usePokeImages(80, 1, 1025);
onMounted(load);

const top = ref([]);
function formatTime(sec) {
  const m = Math.floor(sec / 60),
    r = sec % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
onMounted(async () => {
  document.addEventListener(
    "deviceready",
    async () => {
      top.value = await top5();
    },
    false
  );
  if (!window.cordova) top.value = await top5();
});
</script>
