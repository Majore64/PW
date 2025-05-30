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

    <!-- Mensagem de erro de autenticação -->
    <div v-if="!isAuthenticated" class="container my-4 text-center">
      <div class="alert alert-warning">
        <i class="bi bi-exclamation-triangle me-2"></i>
        Você precisa estar autenticado para acessar esta página.
        <div class="mt-2">Redirecionando para o login...</div>
      </div>
    </div>

    <div v-else>
      <!-- Título -->
      <div class="container">
        <h1 class="text-center my-4 text-secondary">Finalizar Ocorrências</h1>
      </div>

      <!-- Lista de Cards -->
      <div class="container mb-5">
        <template v-if="pendingOccurrences.length">
          <div v-for="occurrence in pendingOccurrences" :key="occurrence.id" class="mb-4">
            <div class="card">
              <div class="card-body" @click="goToDetails(occurrence.id)">
                <h5 class="card-title">{{ formatType(occurrence.type) }}</h5>
                <p class="card-text">Criado por: {{ occurrence.createdByName }}</p>
                <p class="card-text">Localização: {{ occurrence.location }}</p>
                <button 
                  @click.stop="goToFinalize(occurrence.id)"
                  class="btn btn-primary"
                >
                  Finalizar
                </button>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="text-center text-muted py-4">
            <i class="bi bi-check-circle fs-1"></i>
            <p class="mt-2">Nenhuma ocorrência pendente</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useOccurrencesStore } from '@/stores/useOccurrencesStore';

const router = useRouter();
const store = useOccurrencesStore();
const isAuthenticated = ref(true);

// Verificar autenticação
onMounted(() => {
  if (!store.currentUser) {
    console.warn('Nenhum usuário logado. Redirecionando para login.');
    isAuthenticated.value = false;
    setTimeout(() => {
      router.push('/');
    }, 2000);
  }
});

const pendingOccurrences = computed(() => {
  if (!store.currentUser) return [];
  return store.userPendingOccurrences(store.currentUserId);
});

const formatType = (type) => {
  const types = {
    'falta_material': 'Falta de Material',
    'local_sujo': 'Local Sujo',
    'equipamento_danificado': 'Equipamento Danificado',
    'material_fora_lugar': 'Material Fora do Lugar'
  };
  return types[type] || type;
};

const goToDetails = (id) => {
  router.push({ name: 'VisualizarOcorrencia', params: { id } });
};

const goToFinalize = (id) => {
  router.push({ name: 'FinalizarForm', params: { id } });
};
</script>

<style scoped>
.top-bar {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #5cbdb9;
  border-color: #5cbdb9;
}
</style>