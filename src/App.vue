<template>
  <div>
    <RouterView />
  </div>
</template>

<script setup>

// Header removido do App.vue para aparecer apenas no HomeView.vue
</script>

<style>
body {
  background-color: white; /* remove o preto do fundo */
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width: 100%;
  height: 100%;
  max-width: none;
}
</style>
