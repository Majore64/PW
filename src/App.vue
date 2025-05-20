<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ChatBot from '@/components/ChatBot.vue'
import { ref } from 'vue'

const mostrarChat = ref(false)
</script>

<template>
  <Header @ativarChatBot="mostrarChat = !mostrarChat" />
  <RouterView />
  <Footer />
  <ChatBot v-if="mostrarChat" @fechar="mostrarChat = false" />
</template>

<style>
body {
  background-color: white;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width: 100%;
  height: 100%;
  max-width: none;
}
</style>
