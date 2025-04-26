<template>
    <div class="detalhes-page">
      <div class="top-bar">
        <button @click="$router.back()" class="close-button">✕</button>
        <h1 class="titulo">Detalhes da Ocorrência</h1>
      </div>
  
      <div class="info-container">
        <div class="info-left">
          <div class="tipo-ocorrencia">{{ ocorrencia?.tipo }}</div>
  
          <p><strong>Data:</strong> {{ ocorrencia?.data }}</p>
  
          <p><strong>Localização:</strong> {{ ocorrencia?.zona }} - {{ ocorrencia?.andar }}</p>
  
          <p><strong>Denunciante:</strong> {{ ocorrencia?.email }}</p>
  
          <p><strong>Descrição:</strong></p>
          <p>{{ ocorrencia?.descricao }}</p>
        </div>
  
        <div class="info-right">
          <img :src="ocorrencia?.imagem || mapaExemplo" alt="Mapa" class="mapa" />
  
          <div class="registos">
            <p><strong>Registos pelo denunciante:</strong></p>
            <img :src="ocorrencia?.imagem || imagemExemplo" alt="Imagem do problema" class="imagem-registo" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router'
  import { useOcorrenciasStore } from '@/stores/ocorrencias'
  
  import mapaExemplo from '@/assets/mapa.png'
  import imagemExemplo from '@/assets/exemplo.png'
  
  const route = useRoute()
  const store = useOcorrenciasStore()
  
  const id = Number(route.params.id)
  const ocorrencia = store.lista[id]
  </script>
  
  <style scoped>
  .detalhes-page {
    padding: 2rem;
    background-color: #f3f6f9;
    min-height: 100vh;
  }
  
  .top-bar {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .close-button {
    background-color: #1c2d50;
    color: white;
    border: none;
    border-radius: 50%;
    padding: 0.5rem 0.7rem;
    font-size: 1.2rem;
    cursor: pointer;
  }
  
  .titulo {
    font-size: 2rem;
    font-weight: bold;
    color: #12203c;
  }
  
  .info-container {
    margin-top: 2rem;
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }
  
  .info-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .tipo-ocorrencia {
    background-color: #a2e2e2;
    padding: 0.8rem;
    font-size: 1.4rem;
    text-align: center;
    border-radius: 12px;
    font-weight: bold;
  }
  
  .info-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .mapa {
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
  }
  
  .registos {
    margin-top: 1rem;
  }
  
  .imagem-registo {
    width: 100%;
    max-height: 200px;
    object-fit: cover;
    border-radius: 10px;
  }
  </style>
  