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
        Ocorrência não encontrada ou você não tem permissão para visualizá-la.
        <div class="mt-2">Redirecionando...</div>
      </div>
    </div>

    <!-- Container Principal -->
    <div v-else-if="occurrence" class="container my-4">
      <div class="border border-secondary rounded-3 bg-white shadow-sm overflow-hidden">
        <!-- Conteúdo -->
        <div class="p-3">
          <!-- Título Principal -->
          <h2 class="text-center mb-4 text-secondary">{{ formattedType }}</h2>

          <!-- Informações Básicas -->
          <div class="mb-4 px-3">
            <p class="mb-2"><strong>Alerta dado por:</strong> {{ occurrence.nomeFuncionario }}</p>
            <p class="mb-2"><strong>Data da ocorrência:</strong> {{ formattedDate }}</p>
            <p class="mb-2"><strong>Localização:</strong> {{ occurrence.localizacao }}</p>
            <p class="mb-2"><strong>Alocado a:</strong> {{ alocadoA }}</p> 
            
            <!-- Seção de Materiais Necessários -->
            <div v-if="occurrence.materiais?.length" class="mt-2">
              <p class="mb-3"><strong>Materiais necessários:</strong></p>
              <div class="d-flex flex-wrap gap-2">
                <div v-for="(item, idx) in occurrence.materiais" :key="idx" class="material-item">
                  <span class="material-name">{{ item.name }}</span>
                  <span class="material-quantity">{{ item.quantity }} un.</span>
                </div>
              </div>
            </div>
          </div>

          <hr class="my-2">

          <!-- Descrição -->
          <div class="bg-secondary rounded-3 overflow-hidden">
            <div class="p-3">
              <h5 class="mb-3 text-white position-relative pb-2">
                {{ occurrence.resolvido ? 'Solução Aplicada' : 'Descrição' }}
                <span class="position-absolute bottom-0 start-0 w-100 border-bottom border-dark"></span>
              </h5>
            </div>
            <div class="p-3 pt-0 text-white" style="min-height: 100px; overflow-y: auto;">
              <p class="mb-0">{{ currentDescricao }}</p>
            </div>
          </div>

          <!-- Botão Media -->
          <div v-if="hasMedia" class="text-center mt-4">
            <button 
              @click="showMedia = true"
              class="btn btn-outline-secondary"
            >
              <i class="bi" :class="mediaIcon"></i>
              {{ mediaButtonText }}
            </button>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOccurrencesStore } from '@/stores/useOccurrencesStore';

const route = useRoute();
const router = useRouter();
const store = useOccurrencesStore();
const showMedia = ref(false);
const notFound = ref(false);
const isAuthenticated = ref(true);

const occurrence = computed(() => {
  const id = Number(route.params.id);
  
  // Primeiro tenta buscar do localStorage
  try {
    const localStorageOccurrences = JSON.parse(localStorage.getItem('ocorrencias') || '[]');
    const localOccurrence = localStorageOccurrences.find(occ => occ.id === id);
    
    if (localOccurrence) {
      console.log('Ocorrência encontrada no localStorage:', localOccurrence);
      return localOccurrence;
    }
  } catch (error) {
    console.error('Erro ao buscar ocorrências do localStorage:', error);
  }
  
  // Se não encontrou no localStorage, busca do store
  return store.getOccurrenceById(id);
});

const alocadoA = computed(() => {
  const id = Number(route.params.id);
  
  try {
    const localStorageOccurrences = JSON.parse(localStorage.getItem('ocorrencias') || '[]');
    console.log('Todas as ocorrências do localStorage:', localStorageOccurrences);
    
    const localOccurrence = localStorageOccurrences.find(occ => occ.id === id);
    
    if (localOccurrence && localOccurrence.alocadoA) {
      console.log('AlocadoA encontrado no localStorage:', localOccurrence.alocadoA);
      return localOccurrence.alocadoA;
    }
    
    if (occurrence.value) {
      const similarOccurrence = localStorageOccurrences.find(occ => 
        occ.tipoOcorrencia === occurrence.value.tipoOcorrencia && 
        occ.localizacao === occurrence.value.localizacao
      );
      
      if (similarOccurrence && similarOccurrence.alocadoA) {
        console.log('AlocadoA encontrado em ocorrência similar:', similarOccurrence.alocadoA);
        return similarOccurrence.alocadoA;
      }
    }
  } catch (error) {
    console.error('Erro ao buscar alocadoA do localStorage:', error);
  }
  
  console.log('Usando valor padrão para alocadoA: Diogo');
  return 'Diogo';
});

const formattedDate = computed(() => {
  if (!occurrence.value?.data) return '';
  const date = new Date(occurrence.value.data);
  return date.toLocaleDateString('pt-PT') + ' ' + date.toLocaleTimeString('pt-PT');
});

const formattedType = computed(() => {
  const types = {
    'Material mal alocado': 'Material Mal Alocado',
    'Material em falta': 'Material em Falta',
    'Limpeza necessária': 'Limpeza Necessária',
  };
  return types[occurrence.value?.tipoOcorrencia] || occurrence.value?.tipoOcorrencia;
});

const currentDescricao = computed(() => {
  return occurrence.value?.resolvido 
    ? occurrence.value?.resolutionComment || 'Nenhuma descrição de solução fornecida'
    : occurrence.value?.descricao || 'Sem descrição';
});

const mediaData = computed(() => {
  return occurrence.value?.resolvido
    ? occurrence.value?.resolutionProof
    : occurrence.value?.media;
});

const hasMedia = computed(() => {
  return mediaData.value?.data && mediaData.value?.tipoOcorrencia;
});

const mediaSrc = computed(() => {
  if (!mediaData.value) return '';
  return `data:${mediaData.value.tipoOcorrencia};base64,${mediaData.value.data}`;
});

const mediaButtonText = computed(() => {
  return occurrence.value?.resolvido ? 'Ver Prova' : 'Ver Media';
});

const mediaIcon = computed(() => {
  const tipoOcorrencia = mediaData.value?.tipoOcorrencia || '';
  if (tipoOcorrencia.includes('image')) return 'bi-image-fill';
  if (tipoOcorrencia.includes('video')) return 'bi-camera-reels-fill';
  return 'bi-paperclip';
});

const isImage = computed(() => {
  const tipoOcorrencia = mediaData.value?.tipoOcorrencia || '';
  return tipoOcorrencia.includes('image');
});

const isVideo = computed(() => {
  const tipoOcorrencia = mediaData.value?.tipoOcorrencia || '';
  return tipoOcorrencia.includes('video');
});

// Função para buscar ocorrência diretamente do localStorage
const getOccurrenceFromLocalStorage = (id) => {
  try {
    const localStorageOccurrences = JSON.parse(localStorage.getItem('ocorrencias') || '[]');
    return localStorageOccurrences.find(occ => occ.id === Number(id));
  } catch (error) {
    console.error('Erro ao buscar ocorrência do localStorage:', error);
    return null;
  }
};

onMounted(() => {
  const id = Number(route.params.id);
  
  // Verifica autenticação
  if (!store.currentUser) {
    console.warn('Nenhum usuário logado. Redirecionando para login.');
    isAuthenticated.value = false;
    setTimeout(() => {
      router.push('/');
    }, 2000);
    return;
  }

  // Verifica se a ocorrência existe
  if (!occurrence.value) {
    console.warn('Ocorrência não encontrada ou acesso não autorizado.');
    notFound.value = true;
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  } else {
    // Garante que alocadoA tenha um valor
    if (!occurrence.value.alocadoA) {
      occurrence.value.alocadoA = 'Diogo';
    }
    console.log('Ocorrência carregada:', occurrence.value);
  }
});
</script>

<style scoped>
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

/* Estilos para Materiais */
.material-item {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  padding: 0.4rem;
  display: inline-flex;
  align-items: center;
}

.material-name {
  margin: 0 0.3rem;
}

.material-quantity {
  background-color: #e9ecef;
  border-radius: 10px;
  padding: 0 0.5rem;
  font-size: 0.85rem;
}

/* Barra de rolagem */
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

/* Modal */
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
