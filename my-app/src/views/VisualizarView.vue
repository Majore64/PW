<template>
  <div class="visualizar-view bg-light min-vh-100">
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
      <button @click="$router.go(-1)" class="btn btn-link text-dark text-decoration-none ps-3">
        ← Voltar
      </button>
    </div>

    <!-- Container Principal -->
    <div class="container my-4">
      <div class="border border-secondary rounded-3 bg-white shadow-sm overflow-hidden">
        <!-- Conteúdo -->
        <div class="p-3">
          <!-- Título Principal (ajustado conforme pedido) -->
          <h2 class="text-center mb-4 text-secondary">{{ formattedType }}</h2>

          <!-- Informações Básicas -->
          <div class="mb-4 px-3">
            <p class="mb-2"><strong>Alerta dado por:</strong> {{ occurrence.createdByName }}</p>
            <p class="mb-2"><strong>Data da ocorrência:</strong> {{ formattedDate }}</p>
            <p class="mb-0"><strong>Localização:</strong> {{ occurrence.location }}</p>
          </div>

          <hr class="my-4">

          <!-- Descrição -->
          <div class="bg-secondary rounded-3 overflow-hidden">
            <div class="p-3">
              <h5 class="mb-3 text-white position-relative pb-2">
                {{ occurrence.status === 'pending' ? 'Descrição' : 'Solução Aplicada' }}
                <span class="position-absolute bottom-0 start-0 w-100 border-bottom border-dark"></span>
              </h5>
            </div>
            <div class="p-3 pt-0 text-white" style="min-height: 100px; max-height: 300px; overflow-y: auto;">
              <p class="mb-0">{{ currentDescription }}</p>
            </div>
          </div>

          <!-- Botão Media Centralizado (nova adição conforme pedido) -->
          <div v-if="hasMedia" class="text-center mt-4">
            <button 
              @click="showMedia = true"
              class="btn btn-outline-secondary"
            >
              <i class="bi" :class="mediaIcon"></i>
              {{ mediaButtonText }}
            </button>
          </div>

          <!-- Status no rodapé (ajustado conforme pedido) -->
          <div class="text-center mt-4">
            <span 
              class="badge rounded-pill fs-6 px-3 py-2"
              :class="statusClass"
            >
              {{ formattedStatus }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Media -->
    <div v-if="showMedia" class="modal-backdrop" @click.self="showMedia = false">
      <div class="modal-content bg-white p-4 rounded-3 border border-secondary">
        <button 
          @click="showMedia = false" 
          class="btn-close position-absolute top-0 end-0 m-2"
        ></button>
        
        <div v-if="isImage" class="text-center">
          <img :src="mediaSrc" class="img-fluid" style="max-height: 80vh;">
        </div>
        
        <div v-else-if="isVideo" class="text-center">
          <video controls class="w-100" style="max-height: 80vh;">
            <source :src="mediaSrc">
          </video>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useOccurrencesStore } from '@/stores/useOccurrencesStore';

const route = useRoute();
const store = useOccurrencesStore();
const showMedia = ref(false);

const occurrence = computed(() => store.getOccurrenceById(Number(route.params.id)));

// Formata o tipo para exibição (mantido como estava)
const formattedType = computed(() => {
  const types = {
    'falta_material': 'Falta de Material',
    'local_sujo': 'Local Sujo',
    'equipamento_danificado': 'Equipamento Danificado',
    'material_fora_lugar': 'Material Fora do Lugar'
  };
  return types[occurrence.value?.type] || occurrence.value?.type;
});

// Descrição dinâmica
const currentDescription = computed(() => {
  return occurrence.value?.status === 'resolved' 
    ? occurrence.value?.resolutionComment || 'Nenhuma descrição de solução fornecida'
    : occurrence.value?.description || 'Sem descrição';
});

// Lógica de media/prova
const mediaData = computed(() => {
  return occurrence.value?.status === 'resolved'
    ? occurrence.value?.resolutionProof
    : occurrence.value?.media;
});

const hasMedia = computed(() => {
  return mediaData.value?.data && mediaData.value?.type;
});

const mediaSrc = computed(() => {
  return `data:${mediaData.value.type};base64,${mediaData.value.data}`;
});

const mediaButtonText = computed(() => {
  return occurrence.value?.status === 'resolved' ? 'Ver Prova' : 'Ver Media';
});

const mediaIcon = computed(() => {
  const type = mediaData.value?.type || '';
  if (type.includes('image')) return 'bi-image-fill';
  if (type.includes('video')) return 'bi-camera-reels-fill';
  return 'bi-paperclip';
});

const isImage = computed(() => mediaData.value?.type?.includes('image'));
const isVideo = computed(() => mediaData.value?.type?.includes('video'));

// Status (mantido como estava)
const formattedStatus = computed(() => {
  return occurrence.value?.status === 'pending' ? 'PENDENTE' : 'RESOLVIDO';
});

const statusClass = computed(() => {
  return occurrence.value?.status === 'pending' 
    ? 'bg-warning text-dark'  // Amarelo
    : 'bg-success text-white'; // Verde
});
</script>

<style scoped>
/* Estilos originais mantidos integralmente */

.text-white p {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.top-bar {
  background-color: #93E5E0;
}

.btn-link {
  transition: all 0.2s;
}
.btn-link:hover {
  transform: translateX(-2px);
}

/* Barra de rolagem personalizada */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #5cbdb9;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #4aa8a5;
}

/* Estilos do modal (minimalista) */
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
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.btn-close {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>