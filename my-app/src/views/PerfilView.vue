<template>
  <div class="perfil-view">
    <!-- Cabeçalho -->
    <div class="top-bar">
      <img src="@/assets/images/logo.png" alt="Logo" class="logo" />
    </div>

    <!-- Botão voltar -->
    <div class="d-flex justify-content-around mb-5 mt-4" style="width: 50%;">
      <button class="btn p-0 d-flex gap-2" @click="router.push('/dashboard')">
        <i class="bi bi-arrow-left"></i>
        <span>Página Inicial</span>
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
      <!-- Botão Editar -->
      <div class="d-flex justify-content-end">
        <button class="btn text-white me-5" @click="router.push('/editar')" style="width:110px; background-color: #93E5E0;">
          <i class="bi bi-pencil-square"></i> Editar
        </button>
      </div>

      <!-- Perfil -->
      <div class="d-flex align-items-center ms-3" style="width: 100%; height: 200px; position: relative;">
        <img 
          v-if="user.imageUrl" 
          :src="user.imageUrl" 
          alt="User Image" 
          style="height: 105px; width: 105px; border-radius: 100%; margin-right: 1rem;" 
        />
        <i 
          v-else 
          class="bi bi-person-fill text-secondary pr-4" 
          style="font-size: 8rem; margin-right: 2rem;"
        ></i>

        <div class="d-flex flex-column">
          <span class="fs-4 fw-bold">{{ user.name }}</span>
          <span class="fs-5">{{ user.email }}</span>
        </div>
      </div>

      <!-- Separador -->
      <div class="bg-black mt-3 me-4 ms-4" style="height: 1px;"></div>

      <!-- Histórico com botão Ver tudo -->
      <div class="d-flex justify-content-between align-items-center pt-3 w-100">
        <div class="d-flex align-items-center ps-3">
          <span class="fs-5 fw-medium me-2">Pendentes Recentes</span>
          <i class="bi bi-file-earmark-text-fill fs-5"></i>
        </div>
        <div>
          <span class="text-primary pe-4" style="cursor: pointer;" @click="router.push('/historico')">Ver tudo</span>
        </div>
      </div>

      <!-- Lista de ocorrências PENDENTES -->
      <div class="occurrences-container mx-4 mt-4 mb-4">
        <OccurrenceCard 
          v-for="occurrence in pendingOccurrences" 
          :key="occurrence.id" 
          :occurrence="occurrence"
        />
        <p v-if="pendingOccurrences.length === 0" class="text-center text-muted mt-3">Sem ocorrências pendentes.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOccurrencesStore } from '@/stores/useOccurrencesStore'
import OccurrenceCard from '@/components/OccurrenceCard.vue'

const router = useRouter()
const store = useOccurrencesStore()
const isAuthenticated = ref(true)

const user = ref({
  name: '',
  email: '',
  imageUrl: ''
})

onMounted(() => {
  // Verificar autenticação
  if (!store.currentUser) {
    console.warn('Nenhum usuário logado. Redirecionando para login.')
    isAuthenticated.value = false
    setTimeout(() => {
      router.push('/')
    }, 2000)
    return
  }

  // Carregar dados do usuário
  user.value.name = store.currentUser.name || ''
  user.value.email = store.currentUser.email || ''
  user.value.imageUrl = store.currentUser.picture || ''
})

// Modificado para mostrar apenas pendentes mais recentes
const pendingOccurrences = computed(() => {
  if (!store.currentUser) return []
  
  const occurrences = store.userOccurrences(store.currentUserId)
  return occurrences
    .filter(o => o.status === 'pending') // Filtra apenas pendentes
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Ordena por data (mais recente primeiro)
    .slice(0, 3) // Limita a 3 ocorrências
})
</script>

<style scoped>
.perfil-view {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.top-bar {
  background-color: #93E5E0;
  height: 70px;
}

.logo {
  height: 60px;
  display: block;
  margin: 0 auto;
  padding-top: 10px;
}

.occurrences-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>