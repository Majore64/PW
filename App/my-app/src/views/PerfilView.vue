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

    <!-- Mensagem de funcionário não encontrado -->
    <div v-else-if="!funcionarioEncontrado" class="container my-4 text-center">
      <div class="alert alert-danger">
        <i class="bi bi-exclamation-triangle me-2"></i>
        Funcionário não encontrado no sistema.
        <div class="mt-2">Entre em contato com o administrador.</div>
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
          v-if="user.picture" 
          :src="user.picture" 
          alt="User Image" 
          style="height: 105px; width: 105px; border-radius: 100%; margin-right: 1rem;" 
        />
        <i 
          v-else 
          class="bi bi-person-fill text-secondary pr-4" 
          style="font-size: 8rem; margin-right: 2rem;"
        ></i>

        <div class="d-flex flex-column">
          <span class="fs-4 fw-bold">{{ funcionario.nome }}</span>
          <span class="fs-5">{{ user.email }}</span>
          <span class="fs-6 text-muted">{{ funcionario.funcao }} - {{ funcionario.area }}</span>
          <span class="fs-6 text-muted">Nº: {{ funcionario.numero }}</span>
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
import OccurrenceCard from '@/components/OccurrenceCard.vue'

const router = useRouter()
const isAuthenticated = ref(false)
const funcionarioEncontrado = ref(false)
const showLogoutConfirm = ref(false)

const user = ref({
  name: '',
  email: '',
  picture: ''
})

const funcionario = ref({
  id: null,
  nome: '',
  numero: '',
  funcao: '',
  area: '',
  email: '',
  contacto: ''
})

const allOccurrences = ref([])

onMounted(() => {
  try {
    // 1. Verificar se existe usuário do Google no localStorage
    const googleUser = JSON.parse(localStorage.getItem('user'))
    if (!googleUser || !googleUser.email) {
      console.warn('Nenhum usuário do Google logado. Redirecionando para login.')
      isAuthenticated.value = false
      setTimeout(() => {
        router.push('/')
      }, 2000)
      return
    }

    isAuthenticated.value = true
    user.value = {
      name: googleUser.name || '',
      email: googleUser.email || '',
      picture: googleUser.picture || ''
    }

    // 2. Buscar funcionários no localStorage
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || []
    
    // 3. Encontrar o funcionário com o mesmo email do usuário Google
    const funcionarioCorrespondente = funcionarios.find(func => 
      func.email && func.email.toLowerCase() === googleUser.email.toLowerCase()
    )

    if (!funcionarioCorrespondente) {
      console.warn('Funcionário não encontrado para o email:', googleUser.email)
      funcionarioEncontrado.value = false
      return
    }

    funcionarioEncontrado.value = true
    funcionario.value = funcionarioCorrespondente

    // 4. Carregar todas as ocorrências do localStorage
    allOccurrences.value = JSON.parse(localStorage.getItem('ocorrencias')) || []

    console.log('Funcionário encontrado:', funcionario.value)
    console.log('Total de ocorrências:', allOccurrences.value.length)
    console.log('Ocorrências pendentes do funcionário:', pendingOccurrences.value.length)

  } catch (error) {
    console.error('Erro ao carregar dados do perfil:', error)
    isAuthenticated.value = false
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }
})

// Ocorrências pendentes do funcionário atual
const pendingOccurrences = computed(() => {
  if (!funcionario.value.numero || !allOccurrences.value.length) {
    return []
  }
  
  return allOccurrences.value
    .filter(ocorrencia => {
      // Filtrar por funcionário (comparando numeroFuncionario com numero do funcionário)
      const isFuncionarioOcorrencia = ocorrencia.numeroFuncionario === funcionario.value.numero || 
                                     ocorrencia.numeroFuncionario === funcionario.value.id
      
      // Filtrar apenas pendentes (não resolvidas)
      const isPendente = !ocorrencia.resolvido
      
      return isFuncionarioOcorrencia && isPendente
    })
    .sort((a, b) => {
      // Ordenar por data (mais recente primeiro)
      const dateA = new Date(a.data.split('/').reverse().join('-'))
      const dateB = new Date(b.data.split('/').reverse().join('-'))
      return dateB - dateA
    })
    .slice(0, 3) // Limitar a 3 ocorrências mais recentes
})

// Funções de logout
const handleLogout = () => {
  showLogoutConfirm.value = true
}

const confirmLogout = () => {
  try {
    // Remover dados do usuário do localStorage
    localStorage.removeItem('user')
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