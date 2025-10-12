<template>
  <main class="page">
    <header
      v-if="!finished"
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      "
    >
      <h1 style="margin: 0">
        Qui est ce Pokémon ? ({{ Math.min(qIndex + 1, 10) }}/10)
      </h1>
      <div v-if="started" style="opacity: 0.8">⏱️ {{ elapsedLabel }}</div>
    </header>
    <header v-else>
      <h1>Quiz terminé</h1>
    </header>

    <section v-if="!finished" class="card-poke" style="margin-top: 12px">
      <img
        v-if="current?.image"
        :src="current.image"
        alt="pokemon"
        class="poke-img"
        :class="{ reveal: revealColor }"
      />
      <div v-else style="text-align: center; padding: 40px 0">Chargement…</div>

      <form
        @submit.prevent="submit"
        style="display: flex; gap: 8px; margin-top: 16px"
      >
        <input
          v-model.trim="answer"
          placeholder="Nom du Pokémon"
          class="input"
          autofocus
        />
        <button class="btn" :disabled="!answer">Valider</button>
      </form>

      <p v-if="feedback" :class="feedbackClass" style="margin-top: 12px">
        {{ feedback }}
      </p>
    </section>

    <section v-else class="card" style="margin-top: 12px">
      <h2 style="margin: 0 0 4px">Résultat : {{ score }}/10</h2>
      <p style="margin: 0 0 12px">Temps : {{ elapsedLabel }}</p>

      <form @submit.prevent="save" style="display: flex; gap: 8px">
        <input
          v-model.trim="player"
          placeholder="Ton nom"
          class="input"
          :disabled="saving || saveState === 'ok'"
        />
        <button class="btn" :disabled="!player || saving || saveState === 'ok'">
          <span v-if="saving">Enregistrement…</span>
          <span v-else-if="saveState === 'ok'">✔️ Enregistré</span>
          <span v-else>Enregistrer</span>
        </button>
      </form>

      <p v-if="saveState === 'ok'" class="ok" style="margin-top: 12px">
        Score enregistré avec succès.
      </p>
      <p v-else-if="saveState === 'ko'" class="ko" style="margin-top: 12px">
        Échec de l’enregistrement — réessaie.
      </p>

      <div style="height: 8px"></div>
      <RouterLink
        to="/leaderboard"
        class="btn secondary"
        style="width: 100%; justify-content: center"
        >Voir le classement</RouterLink
      >
    </section>
  </main>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { randomIds, getPokemonById } from "@/services/pokemon";
import { isCorrectAnswer } from "@/utils/normalize";
import { appendScore } from "@/services/storage";

const router = useRouter();
const saving = ref(false);
const saveState = ref("idle");

const ids = ref([]);
const qIndex = ref(0);
const current = ref(null);
const answer = ref("");
const score = ref(0);
const feedback = ref("");
const started = ref(false);
const finished = ref(false);
const player = ref("");
const revealColor = ref(false);

const tick = ref(0);
let timerId = null;

const GOOD = [200]; // 1 vibration
const BAD = [200, 100, 200]; // 2 vibrations
const END = [200, 100, 200, 100, 200]; // 3 vibrations

function vibrate(pattern) {
  if (window?.cordova && window?.AdvVibrate?.vibrate) {
    window.AdvVibrate.vibrate(
      pattern,
      () => {},
      (e) => console.warn(e)
    );
    return;
  }
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

function startTimer() {
  stopTimer();
  tick.value = 0;
  timerId = setInterval(() => {
    if (!finished.value) tick.value += 1;
  }, 1000);
}
function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}
const elapsedLabel = computed(() => {
  const s = tick.value,
    m = Math.floor(s / 60),
    r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
});

const feedbackClass = computed(() =>
  feedback.value.startsWith("✅") ? "ok" : "ko"
);

async function loadCurrent() {
  current.value = null;
  revealColor.value = false;
  const id = ids.value[qIndex.value];
  try {
    current.value = await getPokemonById(id);
  } catch (e) {
    console.warn("API error, skip", e);
    next();
  }
}
function next() {
  feedback.value = "";
  answer.value = "";
  qIndex.value++;
  if (qIndex.value >= 10) {
    finished.value = true;
    started.value = false;
    stopTimer();
    vibrate(END);
  } else {
    loadCurrent();
  }
}
function submit() {
  if (!current.value) return;
  const ok = isCorrectAnswer(answer.value, current.value);

  if (ok) {
    score.value++;
    revealColor.value = true;
    feedback.value = `✅ Bravo ! C'était ${
      current.value.nameFR || current.value.nameEN
    }.`;
    vibrate(GOOD);
  } else {
    const name = current.value.nameFR || current.value.nameEN || "inconnu";
    feedback.value = `❌ Raté. C'était ${name}.`;
    vibrate(BAD);
  }

  setTimeout(next, 800);
}
async function save() {
  if (saving.value || !player.value) return;
  saving.value = true;
  saveState.value = "idle";
  try {
    const entry = {
      player: player.value,
      score: score.value,
      timeSec: tick.value,
      createdAt: new Date().toISOString(),
    };
    await appendScore(entry);
    saveState.value = "ok";
    setTimeout(() => {
      router.push("/leaderboard");
    }, 1000);
  } catch (e) {
    console.error("Save error", e);
    saveState.value = "ko";
  } finally {
    saving.value = false;
  }
}
onMounted(async () => {
  document.addEventListener("deviceready", () => {}, false);

  ids.value = randomIds(10, 1, 1025);
  started.value = true;
  startTimer();
  await loadCurrent();
});
onUnmounted(stopTimer);
</script>
