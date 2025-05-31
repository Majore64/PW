<template>
  <div class="finalizar-form-view bg-light min-vh-100">
    <!-- Cabeçalho -->
    <div class="top-bar" style="background-color: #93E5E0; height: 70px;">
      <img 
        src="@/assets/images/logo.png" 
        alt="Logo"
        style="height: 60px; display: block; margin: 0 auto; padding-top: 10px;"
      >
    </div>

    <!-- Botão Voltar -->
    <div class="container-fluid mt-3">
      <button 
        @click="$router.push('/finalizar')" 
        class="btn btn-link text-dark text-decoration-none ps-3"
      >
        ← Voltar para lista
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

    <!-- Mensagem de ocorrência não encontrada -->
    <div v-else-if="notFound" class="container my-4 text-center">
      <div class="alert alert-warning">
        <i class="bi bi-exclamation-triangle me-2"></i>
        Ocorrência não encontrada ou você não tem permissão para finalizá-la.
        <div class="mt-2">Redirecionando...</div>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="container my-4" v-else-if="occurrence">
      <div class="border border-secondary rounded-3 bg-white shadow-sm overflow-hidden">
        <div class="p-4">
          <!-- Título -->
          <h2 class="text-center mb-4 text-primary">
            <i class="bi bi-check-circle-fill me-2"></i>
            Finalizar Ocorrência
          </h2>
          
          <!-- Card de Visualização -->
          <div class="mb-4 p-3 bg-light rounded-3">
            <div class="d-flex align-items-center mb-3">
              <i :class="typeIcon" class="fs-1 pe-3 text-secondary"></i>
              <div>
                <h5 class="m-0 text-capitalize">{{ occurrence.tipoOcorrencia }}</h5>
                <small class="text-muted">
                  Criado por: {{ occurrence.nomeFuncionario }}
                </small>
              </div>
            </div>
            <div class="mt-2">
              <p class="m-0"><strong>Localização:</strong> {{ occurrence.localizacao }}</p>
              <p class="m-0"><strong>Data:</strong> {{ occurrence.data }}</p>
              <p class="m-0"><strong>Alocado a:</strong> {{ occurrence.alocadoA }}</p>
              <p class="m-0"><strong>Descrição:</strong> {{ occurrence.descricao }}</p>
              <p class="m-0"><strong>Status: </strong> 
                <span :class="occurrence.resolvido ? 'text-success' : 'text-warning'">
                  {{ occurrence.resolvido ? 'Resolvido' : 'Pendente' }}
                </span>
              </p>
              <!-- Mostrar materiais se existirem -->
              <div v-if="occurrence.materiais && occurrence.materiais.length > 0" class="mt-2">
                <strong>Materiais:</strong>
                <ul class="mb-0">
                  <li v-for="material in occurrence.materiais" :key="material.nome">
                    {{ material.nome }} - Quantidade: {{ material.quantidade }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Formulário -->
          <form @submit.prevent="handleSubmit">
            <!-- Campo de Solução -->
            <div class="mb-4">
              <label class="form-label fw-bold text-secondary">
                <i class="bi bi-chat-left-text me-2"></i>
                Descrição da Solução:
              </label>
              <textarea
                v-model="resolutionComment"
                class="form-control"
                rows="4"
                placeholder="Descreva como resolveu a ocorrência..."
                required
              ></textarea>
            </div>

            <!-- Upload de Prova -->
            <div class="mb-4">
              <label class="form-label fw-bold text-secondary">
                <i class="bi bi-paperclip me-2"></i>
                Anexar Comprovativo:
              </label>
              <div class="border rounded p-3 bg-white">
                <input 
                  type="file"
                  ref="fileInput"
                  class="d-none"
                  accept="image/*, video/*, audio/*, .pdf"
                  @change="handleFileUpload"
                >
                <button 
                  type="button"
                  @click="() => fileInput && fileInput.click()"
                  class="btn btn-outline-primary w-100"
                >
                  <i class="bi bi-upload me-2"></i>
                  {{ fileName || 'Selecionar Arquivo' }}
                </button>
                
                <!-- Pré-visualização -->
                <div v-if="filePreview" class="mt-3 text-center">
                  <img 
                    v-if="fileType === 'image'" 
                    :src="filePreview" 
                    class="img-thumbnail"
                    style="max-height: 150px"
                  >
                  <div v-else class="alert alert-info mt-2">
                    Arquivo anexado: {{ fileName }}
                  </div>
                  <button 
                    type="button"
                    @click="removeFile"
                    class="btn btn-sm btn-danger mt-2"
                  >
                    <i class="bi bi-trash"></i> Remover
                  </button>
                </div>
                <small class="text-muted d-block mt-2">
                  Formatos aceites: JPG, PNG, PDF, MP3, MP4 (até 5MB)
                </small>
              </div>
            </div>

            <!-- Botão de Submissão -->
            <div class="text-center mt-4">
              <button 
                type="submit"
                class="btn btn-success px-4 py-2"
                :disabled="!resolutionComment.trim()"
              >
                <i class="bi bi-check-circle me-2"></i>
                Confirmar Resolução
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Loading/Error State -->
    <div v-else-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- Popup de Avaliação -->
    <div v-if="showFeedback" class="feedback-modal-overlay">
      <div class="feedback-modal">
        <div class="feedback-header">
          <h3>Como avalias o nosso serviço?</h3>
          <button @click="closeFeedback" class="close-btn">&times;</button>
        </div>
        
        <div class="rating-stars">
          <span 
            v-for="star in 5" 
            :key="star"
            @click="setRating(star)"
            :class="{ 'active': star <= currentRating }"
          >★</span>
        </div>
        
        <textarea
          v-model="feedbackComment"
          placeholder="Deixe seu comentário (opcional)..."
          class="feedback-comment"
          rows="3"
        ></textarea>
        
        <button 
          @click="submitRating"
          :disabled="currentRating === 0"
          class="submit-btn"
        >
          Enviar Avaliação
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Estados reativos
const loading = ref(true)
const occurrence = ref(null)
const resolutionComment = ref('')
const fileInput = ref(null)
const filePreview = ref(null)
const fileType = ref(null)
const fileName = ref('')
const fileData = ref(null)
const showFeedback = ref(false)
const currentRating = ref(0)
const feedbackComment = ref('')
const isAuthenticated = ref(true)
const notFound = ref(false)
const currentUser = ref(null)

// Funções para trabalhar com localStorage
const getFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Erro ao ler ${key} do localStorage:`, error)
    return null
  }
}

const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Erro ao salvar ${key} no localStorage:`, error)
  }
}

const getCurrentUser = () => {
  return getFromLocalStorage('user')
}

const getOccurrences = () => {
  return getFromLocalStorage('ocorrencias') || []
}

const getFuncionarios = () => {
  return getFromLocalStorage('funcionarios') || []
}

const updateOccurrence = (updatedOccurrence) => {
  const occurrences = getOccurrences(); // Carregar ocorrências do localStorage
  console.log('Ocorrências carregadas para atualização:', occurrences);

  const index = occurrences.findIndex(occ => occ.id === updatedOccurrence.id);
  console.log('Índice da ocorrência encontrada:', index);

  if (index !== -1) {
    occurrences[index] = { ...occurrences[index], ...updatedOccurrence };
    saveToLocalStorage('ocorrencias', occurrences);
    console.log('Ocorrência atualizada:', occurrences[index]);
    return true;
  }

  console.error('Ocorrência não encontrada para atualização:', updatedOccurrence);
  return false;
}

const addRating = (rating, comment) => {
  const ratings = getFromLocalStorage('rating') || []
  const newRating = {
    id: ratings.length + 1,
    rating: rating,
    comment: comment || '',
    data: new Date().toLocaleDateString('pt-PT')
  }
  ratings.push(newRating)
  saveToLocalStorage('rating', ratings)
}

// Computed para ícone do tipo de ocorrência
const typeIcon = computed(() => {
  if (!occurrence.value) return 'bi bi-exclamation-circle'
  
  const type = occurrence.value.tipoOcorrencia?.toLowerCase()
  const icons = {
    'material em falta': 'bi bi-capsule-pill',
    'limpeza necessária': 'bi bi-trash',
    'equipamento danificado': 'bi bi-tools',
    'material mal alocado': 'bi bi-briefcase'
  }
  return icons[type] || 'bi bi-exclamation-circle'
})

// Verificar se o usuário atual pode finalizar esta ocorrência
const canUserResolveOccurrence = (occ, user) => {
  if (!user || !occ) return false
  
  // Usuário pode finalizar se:
  // 1. É a pessoa a quem foi alocada a ocorrência
  // 2. É um administrador/gestor (pode implementar lógica específica aqui)
  
  const funcionarios = getFuncionarios()
  const currentUserData = funcionarios.find(f => f.email === user.email)
  
  if (!currentUserData) return false
  
  // Verificar se o usuário atual é quem deve resolver (alocadoA)
  return occ.alocadoA === currentUserData.nome || occ.alocadoA === '-'
}

// Lógica de arquivo
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('Tamanho máximo do arquivo: 5MB')
    return
  }

  fileName.value = file.name
  fileType.value = file.type.split('/')[0]

  const reader = new FileReader()
  reader.onload = (e) => {
    filePreview.value = e.target.result
    fileData.value = e.target.result.split(',')[1]
  }
  reader.readAsDataURL(file)
}

const removeFile = () => {
  if (fileInput.value) fileInput.value.value = ''
  filePreview.value = null
  fileData.value = null
  fileName.value = ''
}

// Carrega a ocorrência
onMounted(async () => {
  try {
    // Verificar autenticação
    currentUser.value = getCurrentUser()
    if (!currentUser.value) {
      console.warn('Nenhum usuário logado. Redirecionando para login.')
      isAuthenticated.value = false
      setTimeout(() => {
        router.push('/')
      }, 2000)
      return
    }

    const occurrenceId = Number(route.params.id)
    if (isNaN(occurrenceId)) {
      throw new Error('ID inválido')
    }
    
    const occurrences = getOccurrences()
    const foundOccurrence = occurrences.find(occ => occ.id === occurrenceId)
    
    if (!foundOccurrence) {
      console.warn('Ocorrência não encontrada.')
      notFound.value = true
      setTimeout(() => {
        router.push('/finalizar')
      }, 2000)
      return
    }

    // Verificar se o usuário pode resolver esta ocorrência
    if (!canUserResolveOccurrence(foundOccurrence, currentUser.value)) {
      console.warn('Usuário não tem permissão para resolver esta ocorrência.')
      notFound.value = true
      setTimeout(() => {
        router.push('/finalizar')
      }, 2000)
      return
    }

    if (foundOccurrence.resolvido) {
      console.warn('Ocorrência já finalizada.')
      notFound.value = true
      setTimeout(() => {
        router.push('/finalizar')
      }, 2000)
      return
    }
    
    occurrence.value = foundOccurrence
  } catch (error) {
    console.error('Erro ao carregar ocorrência:', error)
    notFound.value = true
    setTimeout(() => {
      router.push('/finalizar')
    }, 2000)
  } finally {
    loading.value = false
  }
})

// Lógica de avaliação
const setRating = (rating) => {
  currentRating.value = rating
}

const closeFeedback = () => {
  showFeedback.value = false
  router.push('/finalizar')
}

const submitRating = () => {
  if (currentRating.value > 0) {
    addRating(currentRating.value, feedbackComment.value)
    closeFeedback()
  }
}

// Submissão
const handleSubmit = async () => {
  try {
    if (!resolutionComment.value.trim()) {
      alert('Por favor, descreva a solução aplicada');
      return;
    }

    const updateData = {
      id: occurrence.value.id, // Certifique-se de que o ID está sendo passado corretamente
      resolvido: true,
      dataResolucao: new Date().toLocaleDateString('pt-PT'),
      solucao: resolutionComment.value.trim(),
      resolvidoPor: currentUser.value.name || currentUser.value.email,
    };

    if (fileData.value) {
      updateData.provaF = filePreview.value;
      updateData.tipoProva = fileType.value;
      updateData.nomeArquivo = fileName.value;
    }

    console.log('Dados para atualização:', updateData);

    const success = updateOccurrence(updateData);

    if (success) {
      alert('Ocorrência finalizada com sucesso!');
      const shouldShowFeedback = Math.random() > 0.5; // 50% de chance de mostrar avaliação
      if (shouldShowFeedback) {
        setTimeout(() => {
          showFeedback.value = true;
        }, 1000);
      } else {
        router.push('/finalizar');
      }
    } else {
      throw new Error('Falha ao atualizar ocorrência');
    }
  } catch (error) {
    console.error('Erro ao finalizar:', error);
    alert('Ocorreu um erro ao finalizar. Tente novamente.');
    router.push('/finalizar');
  }
}
</script>

<style scoped>
.finalizar-form-view {
  background-color: #f8f9fa;
}

.top-bar {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.form-control {
  border-radius: 8px;
  padding: 12px;
}

.btn-success {
  border-radius: 8px;
  font-weight: 600;
  min-width: 200px;
}

.alert-info {
  background-color: #e2f3fd;
  border-color: #b8e2fb;
}

.feedback-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.feedback-modal {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.rating-stars {
  font-size: 2.5rem;
  text-align: center;
  margin: 20px 0;
}

.rating-stars span {
  cursor: pointer;
  color: #ccc;
  margin: 0 5px;
  transition: color 0.2s;
}

.rating-stars span.active {
  color: #FFD700;
}

.feedback-comment {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 20px;
  resize: vertical;
}

.submit-btn {
  background-color: #5cbdb9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.submit-btn:not(:disabled):hover {
  background-color: #4aa8a5;
}
</style>