<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOccurrencesStore } from '@/stores/useOccurrencesStore';
import OccurrenceCard from '@/components/OccurrenceCard.vue';

const router = useRouter();
const store = useOccurrencesStore();

// Estado para controle da view
const sortOrder = ref('recentes');
const showAll = ref(false);
const initialItemCount = 4;

// Obtém ocorrências do usuário ordenadas
const userOccurrences = computed(() => {
  const occurrences = store.userOccurrences(store.currentUser?.id);
  
  return occurrences.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder.value === 'recentes' ? dateB - dateA : dateA - dateB;
  });
});

// Ocorrências visíveis
const displayedOccurrences = computed(() => {
  return showAll.value 
    ? userOccurrences.value 
    : userOccurrences.value.slice(0, initialItemCount);
});

// Função para alternar ordenação (FALTANTE NO CÓDIGO ANTERIOR)
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'recentes' ? 'antigos' : 'recentes';
};

// Alterna entre mostrar todos/4 itens
const toggleShowAll = () => {
  showAll.value = !showAll.value;
};
</script>

<template>
  <div class="historico-view">
    <!-- Cabeçalho -->
    <div class="top-bar" style="background-color: #93E5E0; height: 70px;">
      <img 
        src="@/assets/images/logo.png" 
        alt="Logo"
        style="height: 60px; display: block; margin: 0 auto; padding-top: 10px;"
      >
    </div>
    
    <!-- Botão Voltar -->
    <div class="d-flex justify-content-around mb-5 mt-4" style="width: 45%;">
      <button class="btn p-0 d-flex gap-2" @click="router.push('/dashboard')">
        <i class="bi bi-arrow-left"></i>
        <span>Página Inicial</span>
      </button>
    </div>

    <!-- Filtro Recentes/Antigos -->
    <div 
      class="card-header rounded-5 d-flex align-items-center mb-5" 
      style="max-width: 300px; margin: 0 auto; background-color: #93E5E0; cursor: pointer;"
      @click="toggleSortOrder"
    >
      <i class="bi bi-arrows-vertical fs-4 me-2 ms-3"></i>
      <h5 class="mb-0 fs-5 fw-medium">
        {{ sortOrder === 'recentes' ? 'Mais Recentes' : 'Mais Antigos' }}
      </h5>
    </div>

    <!-- Lista de Ocorrências -->
    <div class="occurrences-container mx-auto" style="max-width: 315px;">
      <OccurrenceCard 
        v-for="occurrence in displayedOccurrences" 
        :key="occurrence.id" 
        :occurrence="occurrence"
      />
    </div>

    <!-- Botão Expandir/Recolher -->
    <div 
      class="d-flex justify-content-center mt-4 mb-4"
      v-if="userOccurrences.length > initialItemCount"
    >
      <i 
        class="bi" 
        :class="showAll ? 'bi-dash-circle' : 'bi-plus-circle'" 
        style="cursor: pointer; font-size: 2rem;"
        @click="toggleShowAll"
      ></i>
    </div>
  </div>
</template>

<style scoped>
.occurrences-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
</style>