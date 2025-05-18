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

    <!-- Conteúdo Principal -->
    <div class="container my-4" v-if="occurrence">
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
                <h5 class="m-0 text-capitalize">{{ formattedType }}</h5>
                <small class="text-muted">
                  Criado por: {{ occurrence.createdByName }}
                </small>
              </div>
            </div>
            <div class="mt-2">
              <p class="m-0"><strong>Localização:</strong> {{ occurrence.location }}</p>
              <p class="m-0"><strong>Data:</strong> {{ formatDate(occurrence.createdAt) }}</p>
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
                  @click="fileInput.click()"
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
    <div v-else class="text-center py-5">
      <div v-if="loading" class="spinner-border text-primary"></div>
      <div v-else class="alert alert-danger">
        Ocorrência não encontrada ou já finalizada
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOccurrencesStore } from '@/stores/useOccurrencesStore'

const route = useRoute()
const router = useRouter()
const store = useOccurrencesStore()

// Estados reativos
const loading = ref(true)
const occurrence = ref(null)
const resolutionComment = ref('')
const fileInput = ref(null)
const filePreview = ref(null)
const fileType = ref(null)
const fileName = ref('')
const fileData = ref(null)

// Formatadores
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('pt-PT')
}

const formattedType = computed(() => {
  const types = {
    'falta_material': 'Falta de Material',
    'local_sujo': 'Local Sujo',
    'equipamento_danificado': 'Equipamento Danificado',
    'material_fora_lugar': 'Material Fora do Lugar'
  }
  return types[occurrence.value?.type] || occurrence.value?.type
})

const typeIcon = computed(() => {
  const icons = {
    'falta_material': 'bi bi-capsule-pill',
    'local_sujo': 'bi bi-trash',
    'equipamento_danificado': 'bi bi-tools',
    'material_fora_lugar': 'bi bi-briefcase'
  }
  return icons[occurrence.value?.type] || 'bi bi-exclamation-circle'
})

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
  fileInput.value.value = ''
  filePreview.value = null
  fileData.value = null
  fileName.value = ''
}

// Carrega a ocorrência
onMounted(async () => {
  try {
    const occurrenceId = Number(route.params.id)
    occurrence.value = store.getOccurrenceById(occurrenceId)
    
    if (!occurrence.value || occurrence.value.status === 'resolved') {
      router.push('/finalizar')
    }
  } catch (error) {
    console.error('Erro ao carregar ocorrência:', error)
  } finally {
    loading.value = false
  }
})

// Submissão
const handleSubmit = () => {
  if (!resolutionComment.value.trim()) return

  store.resolveOccurrence({
    id: occurrence.value.id,
    comment: resolutionComment.value.trim(),
    proof: fileData.value ? {
      data: fileData.value,
      type: fileType.value,
      name: fileName.value
    } : null
  })

  router.push('/finalizar')
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
</style>