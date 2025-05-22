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

    <!-- Mensagem de erro de autenticação -->
    <div v-if="!isAuthenticated" class="container my-5 text-center">
      <div class="alert alert-warning">
        <i class="bi bi-exclamation-triangle me-2"></i>
        Você precisa estar autenticado para acessar esta página.
        <div class="mt-2">Redirecionando para o login...</div>
      </div>
    </div>

    <div v-else>
      <!--Texto -->
      <div class="content">
        <h1 class="text-center my-5 fs-2 text-secondary" style="font-family: 'Catamaran', sans-serif; font-weight: 900;">
          OCORRÊNCIAS PENDENTES
        </h1>
      </div>
       
      <!-- Cards dinâmicos -->
      <div class="occurrences-container mx-4">
        <template v-if="oldestOccurrences && oldestOccurrences.length">
          <OccurrenceCard 
            v-for="occurrence in oldestOccurrences" 
            :key="occurrence.id" 
            :occurrence="occurrence"
          />
        </template>
        <template v-else>
          <div class="text-center text-muted py-4">
            <i class="bi bi-check-circle fs-1"></i>
            <p class="mt-2">Nenhuma ocorrência pendente</p>
          </div>
        </template>
      </div>

      <!-- Menu Inferior -->
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
          <div style="width: 30%;"></div>
          <button class="btn p-0 text-center" style="width: 30%;" @click="$router.push('/perfil')">
            <i class="bi bi-person d-block text-secondary" style="font-size: 40px;"></i>
            <span class="d-block large">Perfil</span>
          </button>
          <div style="width: 30%;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOccurrencesStore } from '@/stores/useOccurrencesStore'
import OccurrenceCard from '@/components/OccurrenceCard.vue'

export default {
  name: 'DashboardView',
  components: { OccurrenceCard },
  setup() {
    const store = useOccurrencesStore()
    const router = useRouter()
    const isAuthenticated = ref(true)
    
    // Verificar se há um usuário logado
    onMounted(() => {
      if (!store.currentUser) {
        console.warn('Nenhum usuário logado. Redirecionando para login.')
        isAuthenticated.value = false
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    })
    
    const oldestOccurrences = computed(() => {
      if (!store.currentUser) return []
      return store.oldestUserOccurrences(store.currentUserId, 2)
    })

    return { oldestOccurrences, isAuthenticated }
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
  z-index: 1000;
}

.occurrences-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
  min-height: 200px;
}
</style>