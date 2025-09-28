import { ref } from "vue";
import { randomIds, getPokemonById } from "@/services/pokemon";

export function usePokeImages(n = 60, min = 1, max = 1025) {
  const images = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const ids = randomIds(n, min, max);
      const settled = await Promise.allSettled(
        ids.map((id) => getPokemonById(id))
      );
      images.value = settled
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value?.image)
        .filter(Boolean);
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return { images, loading, error, load };
}
