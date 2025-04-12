<template>
  <div>
    <Header v-if="$route.path === '/'" />
    <RouterView />
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'

</script>

<style>
body {
  margin: 0px;
  padding: 100 px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #121212;
  color: white;
  width: full;
  height: full;

}
</style>