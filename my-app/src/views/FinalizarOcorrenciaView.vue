<template>
  <div class="finalizar-view">
    <!-- Cabeçalho consistente -->
    <div class="top-bar" style="background-color: #93E5E0; height: 70px;">
      <img 
        src="@/assets/images/logo.png" 
        alt="Logo"
        style="height: 60px; display: block; margin: 0 auto; padding-top: 10px;"
      >
    </div>

    <!-- Navegação -->
    <div class="container-fluid mt-3">
      <button 
        @click="$router.push('/dashboard')" 
        class="btn btn-link text-dark text-decoration-none ps-3"
      >
        ← Voltar
      </button>
    </div>

    <!-- Título -->
    <div class="container">
      <h1 class="text-center my-4 text-secondary">Finalizar Ocorrências</h1>
    </div>

    <!-- Lista de Cards -->
    <div class="container mb-5">
      <template v-if="pendingOccurrences.length">
        <FinalizeOccurrenceCard
          v-for="occurrence in pendingOccurrences"
          :key="occurrence.id"
          :occurrence="occurrence"
          class="mb-4"
        />
      </template>
      <template v-else>
        <div class="text-center text-muted py-4">
          <i class="bi bi-check-circle fs-1"></i>
          <p class="mt-2">Nenhuma ocorrência pendente</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useOccurrencesStore } from '@/stores/useOccurrencesStore';
import FinalizeOccurrenceCard from '@/components/FinalizeOccurrenceCard.vue';

const store = useOccurrencesStore();

const pendingOccurrences = computed(() => {
  return store.userPendingOccurrences(store.currentUser?.id);
});
</script>