<template>
  <div class="app">
    <transition name="fade" mode="out-in">
      <RouterView class="page" />
    </transition>
    <AppNav />
  </div>
</template>

<script setup>
import AppNav from "@/components/AppNav.vue";
</script>

<style>
.app {
  min-height: 100dvh;
}
</style>
