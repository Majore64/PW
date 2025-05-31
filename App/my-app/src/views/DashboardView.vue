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
import OccurrenceCard from '@/components/OccurrenceCard.vue'

export default {
  name: 'DashboardView',
  components: { OccurrenceCard },
  setup() {
    const router = useRouter()
    const isAuthenticated = ref(true)
    const currentUser = ref(null)
    const currentEmployee = ref(null)
    const allOccurrences = ref([])
    
    // Função para converter data no formato DD/MM/YYYY para objeto Date
    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split('/')
      return new Date(year, month - 1, day)
    }
    
    // Função para buscar dados do localStorage
    const loadDataFromLocalStorage = () => {
      try {
        // Buscar usuário logado
        const userData = localStorage.getItem('user')
        if (!userData) {
          console.warn('Nenhum usuário logado encontrado no localStorage')
          isAuthenticated.value = false
          return
        }
        
        currentUser.value = JSON.parse(userData)
        
        // Buscar funcionário pelo email
        const funcionariosData = localStorage.getItem('funcionarios')
        if (funcionariosData) {
          const funcionarios = JSON.parse(funcionariosData)
          currentEmployee.value = funcionarios.find(func => 
            func.email === currentUser.value.email
          )
          
          if (!currentEmployee.value) {
            console.warn('Funcionário não encontrado para o email:', currentUser.value.email)
            isAuthenticated.value = false
            return
          }
        }
        
        // Buscar ocorrências
        const ocorrenciasData = localStorage.getItem('ocorrencias')
        if (ocorrenciasData) {
          allOccurrences.value = JSON.parse(ocorrenciasData)
        }
        
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error)
        isAuthenticated.value = false
      }
    }
    
    // Verificar autenticação e carregar dados
    onMounted(() => {
      loadDataFromLocalStorage()
      
      if (!isAuthenticated.value) {
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    })
    
    // Computed para buscar as 2 ocorrências mais antigas alocadas ao usuário
    const oldestOccurrences = computed(() => {
      if (!currentEmployee.value || !allOccurrences.value.length) {
        return []
      }
      
      // Filtrar ocorrências alocadas ao funcionário atual e não resolvidas
      const userOccurrences = allOccurrences.value.filter(occurrence => 
        occurrence.alocadoA === currentEmployee.value.nome && 
        !occurrence.resolvido
      )
      
      // Ordenar por data (mais antigas primeiro) e pegar apenas as 2 primeiras
      return userOccurrences
        .sort((a, b) => parseDate(a.data) - parseDate(b.data))
        .slice(0, 2)
    })

    return { 
      oldestOccurrences, 
      isAuthenticated,
      currentUser,
      currentEmployee
    }
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