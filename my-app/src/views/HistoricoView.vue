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

// Obtém ocorrências do usuário ordenadas (pendentes primeiro, depois resolvidas)
const userOccurrences = computed(() => {
  const occurrences = store.userOccurrences(store.currentUser?.id);
  
  // Separa pendentes e resolvidas
  const pending = occurrences.filter(o => o.status === 'pending');
  const resolved = occurrences.filter(o => o.status === 'resolved');
  
  // Ordena cada grupo
  const sortFn = (a, b) => sortOrder.value === 'recentes' 
    ? new Date(b.createdAt) - new Date(a.createdAt)
    : new Date(a.createdAt) - new Date(b.createdAt);
  
  return [
    ...pending.sort(sortFn),
    ...resolved.sort(sortFn)
  ];
});

// Ocorrências visíveis
const displayedOccurrences = computed(() => {
  return showAll.value 
    ? userOccurrences.value 
    : userOccurrences.value.slice(0, initialItemCount);
});

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'recentes' ? 'antigos' : 'recentes';
};

const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

// Estilo dinâmico para o card baseado no status
const getCardStyle = (status) => {
  return {
    'pending': 'border-left: 4px solid #FFC107; background-color: #FFF8E1;',
    'resolved': 'border-left: 4px solid #4CAF50; background-color: #E8F5E9;'
  }[status];
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

    <!-- Contadores -->
    <div class="d-flex justify-content-center gap-4 mb-4">
      <span class="badge rounded-pill px-3 py-2" style="background-color: #FFF8E1; color: #FFA000;">
        <i class="bi bi-exclamation-circle me-1"></i>
        Pendentes: {{ userOccurrences.filter(o => o.status === 'pending').length }}
      </span>
      <span class="badge rounded-pill px-3 py-2" style="background-color: #E8F5E9; color: #2E7D32;">
        <i class="bi bi-check-circle me-1"></i>
        Resolvidas: {{ userOccurrences.filter(o => o.status === 'resolved').length }}
      </span>
    </div>

    <!-- Lista de Ocorrências -->
    <div class="occurrences-container mx-auto" style="max-width: 315px;">
      <div 
        v-for="occurrence in displayedOccurrences" 
        :key="occurrence.id"
        class="occurrence-wrapper"
        :style="getCardStyle(occurrence.status)"
      >
        <OccurrenceCard :occurrence="occurrence" />
        <div class="status-badge">
          <span v-if="occurrence.status === 'pending'" class="badge bg-warning text-dark">
            PENDENTE
          </span>
          <span v-else class="badge bg-success text-white">
            RESOLVIDO
          </span>
        </div>
      </div>
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
  gap: 20px;
}

.occurrence-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.badge {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>