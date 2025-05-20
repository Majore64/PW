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
            v-if="!form.media || form.media.type !== 'photo'"
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
            v-if="!form.media || form.media.type !== 'video'"
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
        <textarea 
          v-model="form.location" 
          class="form-control border-secondary m-4" 
          rows="1" 
          placeholder="Localização..." 
          style="width:340px"
          required
        ></textarea>

        <textarea 
          v-model="form.description" 
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
      <div class="d-flex justify-content-center mb-3">
        <button 
          @click="setType('falta_material')"
          :class="['tipo-btn', { 'accent-btn': form.type === 'falta_material' }]"
        >
          <i class="bi bi-capsule-pill icon-btn"></i> 
          Falta de Material Médico
        </button>

        <button 
          @click="setType('local_sujo')"
          :class="['tipo-btn', { 'accent-btn': form.type === 'local_sujo' }]"
        >
          <i class="bi bi-trash icon-btn"></i> 
          Local Sujo
        </button>
      </div>

      <div class="d-flex justify-content-center mb-3">
        <button 
          @click="setType('equipamento_danificado')"
          :class="['tipo-btn', { 'accent-btn': form.type === 'equipamento_danificado' }]"
        >
          <i class="bi bi-tools icon-btn"></i> 
          Equipamento Danificado
        </button>

        <button 
          @click="setType('material_fora_lugar')"
          :class="['tipo-btn', { 'accent-btn': form.type === 'material_fora_lugar' }]"
        >
          <i class="bi bi-briefcase-fill icon-btn"></i> 
          Material Fora do Lugar
        </button>
      </div>

      <!-- Botão Criar -->
      <button 
        @click="handleSubmit" 
        :disabled="!form.type || !form.location"
        class="btn btn-secondary text-white mt-1 fs-3 rounded-4" 
        style="width:100px"
      >
        Criar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useOccurrencesStore } from '@/stores/useOccurrencesStore';
import EquipmentSelector from '@/components/EquipmentSelector.vue';

const router = useRouter();
const store = useOccurrencesStore();

const form = ref({
  type: '',
  location: '',
  description: '',
  media: null,
  equipment: [],
  equipmentNotes: ''
});

const showEquipmentModal = ref(false);
const tempOccurrenceType = ref('');

const setType = (type) => {
  form.value.type = type;
  tempOccurrenceType.value = type;
  showEquipmentModal.value = true; // Agora abre para todos os tipos
};

const handleEquipmentSelection = ({ equipment, notes }) => {
  form.value.equipment = equipment
  form.value.equipmentNotes = notes
  showEquipmentModal.value = false
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
      type: mediaType,
      data: e.target.result,
      mimeType: file.type,
      name: file.name
    }
  }
  reader.readAsDataURL(file)
}

const handleSubmit = async () => {
  if (!form.value.type || !form.value.location) {
    alert('Preencha o tipo e a localização!')
    return
  }

  try {
    await store.addOccurrence(form.value)
    alert('Ocorrência criada com sucesso!')
    resetForm()
    router.push('/dashboard')
  } catch (error) {
    alert('Erro ao criar ocorrência: ' + error.message)
  }
}

const resetForm = () => {
  form.value = {
    type: '',
    location: '',
    description: '',
    media: null,
    equipment: [],
    equipmentNotes: ''
  }
}
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
    width: 175px;
    transition: all 0.3s ease;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.5rem;
    border-radius: 6px;
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