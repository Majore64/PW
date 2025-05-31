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
            <p class="mb-2"><strong>Alocado a:</strong> {{ occurrence.alocadoA }}</p>
            
            <!-- Seção de Materiais Necessários -->
            <div v-if="occurrence.materiais?.length" class="mt-2">
              <p class="mb-3"><strong>Materiais necessários:</strong></p>
              <div class="d-flex flex-wrap gap-2">
                <div v-for="(item, idx) in occurrence.materiais" :key="idx" class="material-item">
                  <span class="material-name">{{ item.nome }}</span>
                  <span class="material-quantity">{{ item.quantidade }} un.</span>
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
              <p class="mb-0">{{ currentDescription }}</p>
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

const route = useRoute();
const router = useRouter();
const showMedia = ref(false);
const notFound = ref(false);
const isAuthenticated = ref(true);

const occurrence = ref(null);

onMounted(() => {
  const id = Number(route.params.id);
  console.log('ID recebido pela rota:', id);

  // Buscar exatamente como está no localStorage
  const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias') || '[]');
  // Procurar pelo id
  const foundOccurrence = ocorrencias.find(o => Number(o.id) === id);

  if (!foundOccurrence) {
    console.warn('Ocorrência não encontrada.');
    notFound.value = true;
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
    return;
  }

  occurrence.value = foundOccurrence;
});

// Computed para data (usa o campo 'data' do localStorage)
const formattedDate = computed(() => {
  if (!occurrence.value?.data) return '';
  
  // Converter o formato DD/MM/YYYY para YYYY-MM-DD
  const [day, month, year] = occurrence.value.data.split('/');
  const isoDate = `${year}-${month}-${day}`;
  
  const date = new Date(isoDate);
  return date.toLocaleDateString('pt-PT'); // Apenas a data
});

// Computed para tipo (usa o campo 'tipoOcorrencia')
const formattedType = computed(() => {
  return occurrence.value?.tipoOcorrencia || '';
});

// Computed para descrição (usa o campo 'descricao')
const currentDescription = computed(() => {
  return occurrence.value?.descricao || 'Sem descrição';
});

// Computed para materiais (usa o campo 'materiais')
const materiais = computed(() => {
  return occurrence.value?.materiais || [];
});

// Computed para status/resolvido
const formattedStatus = computed(() => {
  return occurrence.value?.resolvido ? 'RESOLVIDO' : 'PENDENTE';
});

const statusClass = computed(() => {
  return occurrence.value?.resolvido 
    ? 'bg-success text-white'
    : 'bg-warning text-dark';
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
