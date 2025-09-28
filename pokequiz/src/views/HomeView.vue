<template>
  <div style="position: relative; z-index: 1">
    <main class="page">
      <section class="card" style="text-align: center">
        <h1 style="margin: 0 0 8px">Poké Quiz</h1>
        <p style="margin: 0 0 16px; color: var(--muted)">
          Devine le nom du Pokémon le plus vite possible.
        </p>
        <RouterLink to="/quiz" class="btn">Jouer maintenant</RouterLink>
        <div style="height: 8px"></div>
        <RouterLink to="/leaderboard" class="btn secondary"
          >Voir le classement</RouterLink
        >
      </section>
    </main>
  </div>
  <PokeSides :images="images" :speed="100" :width="150" :gap="18" />
</template>

<script setup>
import { onMounted } from "vue";
import PokeSides from "@/components/PokeSides.vue";
import { usePokeImages } from "@/services/usePokeImages";

const { images, load } = usePokeImages(80, 1, 1025); // 80 tentatives → assez d'images valides
onMounted(load);
</script>

<style scoped>
.home {
  padding: 16px;
  display: grid;
  gap: 12px;
}
.btn {
  display: inline-block;
  padding: 12px 16px;
  background: #222;
  color: #fff;
  border-radius: 8px;
  text-align: center;
}
</style>
<script setup></script>
