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
      <!-- Botões de ação -->
      <div class="d-flex justify-content-end gap-2 me-4 mb-2">
        <button class="btn text-white" @click="router.push('/editar')" style="background-color: #93E5E0;">
          <i class="bi bi-pencil-square"></i> Editar
        </button>
        <button class="btn btn-danger" @click="handleLogout">
          <i class="bi bi-box-arrow-right"></i> Sair
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

    <!-- Modal de Confirmação de Logout -->
    <div v-if="showLogoutConfirm" class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirmar Logout</h5>
          <button type="button" class="btn-close" @click="showLogoutConfirm = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Tem certeza que deseja sair da sua conta?</p>
          <p class="text-muted small">As suas ocorrências serão mantidas para quando fizer login novamente.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="showLogoutConfirm = false">
            Cancelar
          </button>
          <button type="button" class="btn btn-danger" @click="confirmLogout">
            <i class="bi bi-box-arrow-right me-1"></i>
            Sair
          </button>
        </div>
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
const showLogoutConfirm = ref(false)

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
    .filter(o => !o.resolvido) // Mudança: !o.resolvido em vez de status === 'pending'
    .sort((a, b) => new Date(b.data) - new Date(a.data)) // Ordena por data (mais recente primeiro)
    .slice(0, 3) // Limita a 3 ocorrências
})

// Funções de logout
const handleLogout = () => {
  showLogoutConfirm.value = true
}

const confirmLogout = () => {
  try {
    store.logout()
    showLogoutConfirm.value = false
    router.push('/')
  } catch (error) {
    console.error('Erro durante logout:', error)
    alert('Erro ao fazer logout. Tente novamente.')
  }
}
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

/* Estilos para o modal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-title {
  margin: 0;
  font-weight: 600;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.btn-close:hover {
  background-color: #f8f9fa;
  color: #000;
}

.modal-body {
  padding: 1rem;
}

.modal-body p {
  margin-bottom: 0.5rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}
</style>
