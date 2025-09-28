<template>
  <div class="poke-sides" aria-hidden="true">
    <div class="poke-col left">
      <div class="track" :style="leftStyle">
        <img
          v-for="(src, i) in doubled"
          :key="'L' + i"
          :src="src"
          alt=""
          @error="(e) => e.target?.remove?.()"
        />
      </div>
    </div>

    <div class="poke-col right">
      <div class="track" :style="rightStyle">
        <img
          v-for="(src, i) in doubled"
          :key="'R' + i"
          :src="src"
          alt=""
          @error="(e) => e.target?.remove?.()"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  images: { type: Array, required: true },
  speed: { type: Number, default: 30 },
  width: { type: Number, default: 140 },
  gap: { type: Number, default: 16 },
});

const doubled = computed(() => [...props.images, ...props.images]);

const leftStyle = computed(() => ({
  "--duration": `${props.speed}s`,
  "--col-width": `${props.width}px`,
  "--gap": `${props.gap}px`,
}));

const rightStyle = leftStyle;
</script>

<style scoped>
.poke-sides {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.poke-col {
  position: absolute;
  top: 0;
  bottom: 0;
  width: var(--col-width, 140px);
  overflow: hidden;

  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0,
    black 10%,
    black 90%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0,
    black 10%,
    black 90%,
    transparent 100%
  );
}

.poke-col.left {
  left: 0;
}
.poke-col.right {
  right: 0;
}

.track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: var(--gap, 16px);
  will-change: transform;
}

.track img {
  width: calc(var(--col-width, 140px) - 24px);
  margin-inline: 12px;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.35));
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

.poke-sides:hover .track {
  animation-play-state: paused;
}
.poke-sides:hover .track img {
  opacity: 1;
}

.left .track {
  animation: scroll-up var(--duration, 30s) linear infinite;
}
.right .track {
  animation: scroll-down var(--duration, 30s) linear infinite;
}

@keyframes scroll-up {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
}

@keyframes scroll-down {
  from {
    transform: translateY(-50%);
  }
  to {
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .left .track,
  .right .track {
    animation: none;
  }
}

@media (max-width: 768px) {
  .poke-col {
    display: none;
  }
}
</style>
