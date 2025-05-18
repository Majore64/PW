<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOccurrencesStore } from '@/stores/useOccurrencesStore'
import OccurrenceCard from '@/components/OccurrenceCard.vue'

const router = useRouter()
const store = useOccurrencesStore()

const user = ref({
  name: '',
  email: '',
  imageUrl: ''
})

onMounted(() => {
  const data = localStorage.getItem('user')
  if (data) {
    const parsed = JSON.parse(data)
    user.value.name = parsed.name || ''
    user.value.email = parsed.email || ''
    user.value.imageUrl = parsed.picture || ''
    store.currentUser = parsed
  }
})

// Modificado para mostrar apenas pendentes mais recentes
const pendingOccurrences = computed(() => {
  const occurrences = store.userOccurrences(store.currentUser?.id)
  return occurrences
    .filter(o => o.status === 'pending') // Filtra apenas pendentes
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Ordena por data (mais recente primeiro)
    .slice(0, 3) // Limita a 3 ocorrências
})
</script>

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
        <span class="fs-5 fw-medium me-2">Pendentes Recentes</span> <!-- Alterado o título -->
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
      <p v-if="pendingOccurrences.length === 0" class="text-center text-muted mt-3">Sem ocorrências pendentes.</p> <!-- Mensagem atualizada -->
    </div>
  </div>
</template>

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