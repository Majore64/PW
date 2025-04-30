<template>
  <div class="dashboard-view">
    <!-- Faixa Superior -->
    <div class="top-bar" style="background-color: #93E5E0; height: 70px;">
      <img 
        src="@/assets/images/logo.png" 
        alt="Logo"
        style="height: 60px; display: block; margin: 0 auto; padding-top: 10px;"
      >
    </div>

    <!--Texto -->
    <div class="content">
      <h1 class="text-center my-5 fs-2 text-secondary" style="font-family: 'Catamaran', sans-serif; font-weight: 900;">OCORRÊNCIAS PENDENTES</h1>
    </div>
     
    <!-- Cards dinâmicos -->
    <div class="occurrences-container mx-4">
      <OccurrenceCard 
        v-for="occurrence in oldestOccurrences" 
        :key="occurrence.id" 
        :occurrence="occurrence"
      />
    </div>

    <!-- Menu Inferior Atualizado -->
    <div class="bottom-nav border-top p-4" style="height: 110px; margin-top: -15px;">
      <!-- Linha 1: Criar | Finalizar | Histórico -->
      <div class="d-flex justify-content-around mb-5 mt-4">
        <button class="btn p-0 text-center" style="width: 30%;" @click="$router.push('/criar')">
          <i class="bi bi-plus-lg d-block text-secondary" style="font-size: 40px;"></i>
          <span class="d-block large">Criar</span>
          <span class="d-block large">ocorrências</span>
        </button>
        <button class="btn p-0 text-center" style="width: 30%;" @click="$router.push('/finalizar')">
          <i class="bi bi-check-lg d-block text-secondary" style="font-size: 40px;"></i>
          <span class="d-block large">Finalizar</span>
          <span class="d-block large">ocorrências</span>
        </button>
        <button class="btn p-0 text-center" style="width: 30%;" @click="$router.push('/historico')">
          <i class="bi bi-clock d-block text-secondary" style="font-size: 40px;"></i>
          <span class="d-block large">Histórico</span>
        </button>
      </div>

      <!-- Linha 2: (vazio) | Perfil | (vazio) -->
      <div class="d-flex justify-content-around">
        <div style="width: 30%;"></div> <!-- Espaço vazio -->
        <button class="btn p-0 text-center" style="width: 30%;" @click="$router.push('/perfil')">
          <i class="bi bi-person d-block text-secondary" style="font-size: 40px;"></i>
          <span class="d-block large">Perfil</span>
        </button>
        <div style="width: 30%;"></div> <!-- Espaço vazio -->
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useOccurrencesStore } from '@/stores/useOccurrencesStore'
import OccurrenceCard from '@/components/OccurrenceCard.vue'

export default {
  name: 'DashboardView',
  components: { OccurrenceCard },
  setup() {
    const store = useOccurrencesStore()
    
    // Pega as 2 ocorrências mais antigas do usuário atual
    const oldestOccurrences = computed(() => {
      return store.oldestUserOccurrences(store.currentUser?.id, 2)
    })

    return { oldestOccurrences }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Catamaran:wght@400;700&display=swap');

.top-bar {
  width: 100%;
  position: relative;
  z-index: 2000;
}

.bottom-nav {
  z-index: 1000; /* Garante que fique acima de outros elementos */
}

.occurrences-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}
</style>