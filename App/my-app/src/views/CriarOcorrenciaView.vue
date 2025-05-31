<template>
  <div class="criar-ocorrencia-view">
    <!-- Cabeçalho -->
    <div class="top-bar">
      <img src="@/assets/images/logo.png" alt="Logo" class="logo">
    </div>

    <!-- Botão Voltar -->
    <div class="d-flex justify-content-around mb-2 mt-4" style="width: 50%;">
      <button class="btn p-0 d-flex gap-2" @click="$router.push('/dashboard')">
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
      <!-- Modal de Equipamentos -->
      <EquipmentSelector
        v-if="showEquipmentModal"
        :occurrenceType="tempOccurrenceType"
        @confirm="handleEquipmentSelection"
        @cancel="showEquipmentModal = false"
      />

      <!-- Ícone -->
      <div class="text-center">
        <i class="bi bi-file-earmark-plus text-secondary" style="font-size: 5rem;"></i>
      </div>

      <!-- Mídia e Campos -->
      <div class="text-center mt-4">
        <div class="mb-3 d-flex justify-content-center gap-3">
          <!-- Botão Foto -->
          <div>
            <input 
              type="file" 
              id="photoInput" 
              accept="image/*" 
              @change="handleMediaUpload($event, 'photo')" 
              style="display: none"
            >
            <label
              v-if="!form.media || form.media.tipoOcorrencia !== 'photo'"
              for="photoInput"
              class="btn btn-secondary text-white mx-2"
              style="width:140px; cursor: pointer"
            >
              <i class="bi bi-camera"></i> Inserir foto
            </label>
            <button
              v-else
              @click="form.media = null"
              class="btn text-white mx-2"
              style="width:140px; background-color: #5cbdb9; border-color: #5cbdb9;"
            >
              <i class="bi bi-x-circle"></i> Remover foto
            </button>
          </div>

          <!-- Botão Vídeo -->
          <div>
            <input 
              type="file" 
              id="videoInput" 
              accept="video/*" 
              @change="handleMediaUpload($event, 'video')" 
              style="display: none"
            >
            <label
              v-if="!form.media || form.media.tipoOcorrencia !== 'video'"
              for="videoInput"
              class="btn btn-secondary text-white mx-2"
              style="width:140px; cursor: pointer"
            >
              <i class="bi bi-camera-video"></i> Inserir vídeo
            </label>
            <button
              v-else
              @click="form.media = null"
              class="btn text-white mx-2"
              style="width:140px; background-color: #5cbdb9; border-color: #5cbdb9;"
            >
              <i class="bi bi-x-circle"></i> Remover vídeo
            </button>
          </div>
        </div>

        <!-- Campos de Texto -->
        <div class="mt-4">
          <select 
            v-model="form.localizacao" 
            class="form-select border-secondary m-4"
            style="width:340px; height:45px;"
            required
          >
            <option value="" disabled selected>Selecione uma localização...</option>
            <option 
              v-for="(localizacao, index) in locationOptions" 
              :key="index" 
              :value="localizacao"
            >
              {{ localizacao }}
            </option>
          </select>

          <textarea 
            v-model="form.descricao" 
            class="form-control border-secondary m-4" 
            rows="4" 
            placeholder="Descrição..." 
            style="width:340px"
          ></textarea>
        </div>
      </div>

      <!-- Tipo de Ocorrência -->
      <div class="fw-medium text-dark m-4" style="font-size: 23px">Tipo de Ocorrência</div>

      <!-- Botões de Tipo -->
      <div class="text-center m-1">
        <div class="d-flex flex-wrap justify-content-center gap-3 mb-3">
          <button 
            v-for="(tipoOcorrencia, index) in occurrenceTypes" 
            :key="index"
            @click="setType(tipoOcorrencia)"
            :class="['tipo-btn', { 'accent-btn': form.tipoOcorrencia === tipoOcorrencia }]"
            style="min-width: 200px; padding: 10px 15px;"
          >
            <i :class="getIconForType(tipoOcorrencia)" class="icon-btn me-2"></i> 
            {{ tipoOcorrencia }}
          </button>
        </div>

        <!-- Botão Criar -->
        <button 
          @click="handleSubmit" 
          :disabled="!form.tipoOcorrencia || !form.localizacao"
          class="btn btn-secondary text-white mt-1 fs-3 rounded-4" 
          style="width:90px; height: 43px; font-size: 1rem; padding-top: 2px"
        >
          Criar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOccurrencesStore } from '@/stores/useOccurrencesStore';
import EquipmentSelector from '@/components/EquipmentSelector.vue';

const router = useRouter();
const store = useOccurrencesStore();
const isAuthenticated = ref(true);

const form = ref({
  tipoOcorrencia: '',
  localizacao: '',
  descricao: '',
  media: null,
  materiais: []
});

const showEquipmentModal = ref(false);
const tempOccurrenceType = ref('');
const locationOptions = ref([]); 

const occurrenceTypes = ref([]);
const loadOccurrenceTypes = () => {
  try {
    // Verifica se estamos no cliente (localStorage só existe no navegador)
    if (typeof window !== 'undefined') {
      const storedTypes = localStorage.getItem('tipoOcorrencias');
      
      if (storedTypes) {
        // Parse seguro do JSON
        occurrenceTypes.value = JSON.parse(storedTypes);
        console.log('Tipos carregados:', occurrenceTypes.value);
      } else {
        console.warn('Nenhum tipo encontrado no localStorage');
      }
    }
  } catch (error) {
    console.error('Erro ao carregar tipos:', error);
  }
};

const loadLocationOptions = () => {
  try {
    const storedLocations = localStorage.getItem('tipoLocalizacoes');
    if (storedLocations) {
      locationOptions.value = JSON.parse(storedLocations);
      console.log('Localizações carregadas:', locationOptions.value);
    }
  } catch (error) {
    console.error('Erro ao carregar localizações:', error);
  }
};

const initializeOccurrenceTypes = () => {
  const defaultTypes = [
    "Material mal alocado",
    "Material em falta",
    "Limpeza necessária"
  ];
  
  // Verifica se já existe no localStorage
  if (!localStorage.getItem('tipoOcorrencias')) {
    // Armazena como JSON válido
    localStorage.setItem('tipoOcorrencias', JSON.stringify(defaultTypes));
    console.log('Tipos de ocorrência inicializados no localStorage');
  }
};

const initializeMaterialsInLocalStorage = () => {
  // Verifica se o localStorage está disponível
  if (typeof localStorage === 'undefined') {
    console.error('localStorage não está disponível neste ambiente');
    return;
  }

  // Dados iniciais dos materiais
  const initialMaterials = [
    {
      id: Date.now(), // Usa timestamp como ID único
      nomeMaterial: "Esfregona",
      quantidade: 10,
      estado: "Disponivel",
      quantRest: 7
    },
    {
      id: Date.now() + 1, // ID diferente para o próximo item
      nomeMaterial: "Detergente",
      quantidade: 15,
      estado: "Disponivel",
      quantRest: 12
    },
    {
      id: Date.now() + 2,
      nomeMaterial: "Luvas descartáveis",
      quantidade: 100,
      estado: "Disponivel",
      quantRest: 45
    }
  ];

  // Verifica se já existe algum dado de materiais
  const existingMaterials = localStorage.getItem('materiais');
  
  // Só inicializa se não existirem materiais
  if (!existingMaterials) {
    try {
      localStorage.setItem('materiais', JSON.stringify(initialMaterials));
      console.log('Materiais inicializados no localStorage:', initialMaterials);
    } catch (error) {
      console.error('Erro ao salvar materiais no localStorage:', error);
    }
  } else {
    console.log('Materiais já existem no localStorage');
  }
};

const initializeLocalizations = () => {
  try {
    // Verifica se estamos no ambiente do navegador
    if (typeof window === 'undefined') return;

    const defaultLocalizations = [
      "Piso 1, sala 1",
      "Piso 1, sala 2",
      "Piso 1, sala 3",
      "Piso 2, sala 1",
      "Piso 2, sala 2",
      "Piso 2, sala 3"
    ];

    // Verifica se já existe e está no formato correto
    const storedLocations = localStorage.getItem('tipoLocalizacoes');
    
    if (!storedLocations) {
      localStorage.setItem('tipoLocalizacoes', JSON.stringify(defaultLocalizations));
      console.log('Localizações padrão criadas no localStorage');
    } else {
      try {
        // Tenta parsear para verificar se é JSON válido
        JSON.parse(storedLocations);
      } catch {
        // Se não for JSON válido, recria com os valores padrão
        localStorage.setItem('tipoLocalizacoes', JSON.stringify(defaultLocalizations));
        console.log('Localizações corrompidas - recriadas com valores padrão');
      }
    }
  } catch (error) {
    console.error('Erro ao inicializar localizações:', error);
  }
};

const setType = (tipoOcorrencia) => {
  form.value.tipoOcorrencia = tipoOcorrencia;
  tempOccurrenceType.value = tipoOcorrencia;
  showEquipmentModal.value = true;
};

const handleEquipmentSelection = ({ materiais }) => {
  form.value.materiais = materiais;
  showEquipmentModal.value = false;
}

const handleMediaUpload = (event, mediaType) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 4 * 1024 * 1024) {
    alert('O arquivo é muito grande. Tamanho máximo: 4MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.media = {
      tipoOcorrencia: mediaType,
      data: e.target.result,
      mimeType: file.type,
      name: file.name
    }
  }
  reader.readAsDataURL(file)
}

// Função para salvar ocorrência no localStorage
const saveOccurrenceToLocalStorage = (occurrenceData) => {
  try {
    // Recupera ocorrências existentes ou cria array vazio
    const existingOccurrences = JSON.parse(localStorage.getItem('ocorrencias') || '[]');
    
    // Cria nova ocorrência com estrutura similar à mostrada na imagem
    const newOccurrence = {
      tipoOcorrencia: occurrenceData.tipoOcorrencia,
      localizacao: occurrenceData.localizacao,
      descricao: occurrenceData.descricao || "",
      alocadoA: "Diogo", // Campo dinâmico - pode ser alterado futuramente
      data: new Date().toISOString(),
      numeroFuncionario: store.currentUser?.name || "Usuário Desconhecido",
      nomeFuncionario: store.currentUser?.name || "Usuário Desconhecido",
      materiais: occurrenceData.materiais || [],
      media: occurrenceData.media || null,
      id: Date.now(), // ID único baseado em timestamp
      resolvido: false,
      validado: false
    };
    
    // Adiciona nova ocorrência ao array
    existingOccurrences.push(newOccurrence);
    
    // Salva de volta no localStorage
    localStorage.setItem('ocorrencias', JSON.stringify(existingOccurrences));
    
    console.log('Ocorrência salva no localStorage:', newOccurrence);
    return newOccurrence;
  } catch (error) {
    console.error('Erro ao salvar ocorrência no localStorage:', error);
    throw error;
  }
};

const handleSubmit = async () => {
  if (!form.value.tipoOcorrencia || !form.value.localizacao) {
    alert('Preencha o tipo e a localização!')
    return
  }

  try {
    // Salva no store (mantém funcionalidade existente)
    await store.addOccurrence(form.value)
    
    // Salva também no localStorage com alocadoA = "Diogo"
    saveOccurrenceToLocalStorage(form.value);
    
    alert('Ocorrência criada com sucesso!')
    resetForm()
    router.push('/dashboard')
  } catch (error) {
    alert('Erro ao criar ocorrência: ' + error.message)
  }
}

const resetForm = () => {
  form.value = {
    tipoOcorrencia: '',
    localizacao: '',
    descricao: '',
    media: null,
    materiais: []
  }
};

onMounted(() => {
  console.log('=== onMounted INICIADO ===');
  
  // Força a criação de tipoFuncoes PRIMEIRO
  console.log('Criando tipoFuncoes...');
  const funcoes = ["Médico", "Funcionário de Limpeza", "Enfermeiro"];
  localStorage.setItem('tipoFuncoes', JSON.stringify(funcoes));
  console.log('tipoFuncoes criado:', localStorage.getItem('tipoFuncoes'));
  
  // Depois executa as outras inicializações
  initializeOccurrenceTypes();
  initializeMaterialsInLocalStorage();
  initializeLocalizations();
  loadLocationOptions();

  if (!store.currentUser) {
    console.warn('Nenhum usuário logado. Redirecionando para login.');
    isAuthenticated.value = false;
    setTimeout(() => {
      router.push('/');
    }, 2000);
    return;
  }
  
  loadOccurrenceTypes();
  loadLocationOptions(); 
  
  console.log('=== onMounted FINALIZADO ===');
});

const getIconForType = (tipoOcorrencia) => {
  const iconMap = {
    'Material mal alocado': 'bi-briefcase-fill',
    'Material em falta': 'bi-capsule-pill',
    'Limpeza necessária': 'bi-trash',
    'Equipamento Danificado': 'bi-tools',
    'Falta de Material Médico': 'bi-capsule-pill',
    'Local Sujo': 'bi-trash',
    'Material Fora do Lugar': 'bi-briefcase-fill'
  };
  return iconMap[tipoOcorrencia] || 'bi-exclamation-circle'; // Ícone padrão
};
</script>

<style scoped lang="scss">
$accent: #5cbdb9;
$primary-light: #93E5E0;

.criar-ocorrencia-view {
  .top-bar {
    background-color: $primary-light;
    height: 70px;
  }

  .logo {
    height: 60px;
    display: block;
    margin: 0 auto;
    padding-top: 10px;
  }

  .media-btn {
    width: 140px;
    cursor: pointer;
  }

  .tipo-btn {
    background-color: $primary-light;
    border: 2px solid $primary-light;
    color: white;
    min-width: 175px;
    transition: all 0.3s ease;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.5rem;
    border-radius: 6px;
    flex: 1 0 auto;
    max-width: 250px;
  }

  .d-flex.flex-wrap {
    gap: 10px;
  }

  .accent-btn {
    background-color: $accent !important;
    border-color: $accent !important;
  }

  .icon-btn {
    font-size: 24px;
    margin-right: 8px;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .img-thumbnail,
  video {
    max-width: 100%;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
}
</style>