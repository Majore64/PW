<template>
  <div class="container">
    <div class="header">
      <button @click="$router.back()" class="close-btn">
        <X />
      </button>
      <h1 class="title">Detalhes da Ocorrência</h1>
    </div>

    <div class="content">
      <!-- Left Column - Details -->
      <div class="left-column">
        <!-- Status Badge -->
        <div class="badge-container">
          <div class="status-badge">
            {{ ocorrencia?.tipo }}
          </div>
        </div>

        <!-- Date -->
        <div class="info-section">
          <h2 class="section-title">Data:</h2>
          <p class="section-text">{{ ocorrencia?.data }}</p>
        </div>

        <!-- Location -->
        <div class="info-section">
          <h2 class="section-title">Localização</h2>
          <div class="info-with-icon">
            <MapPin class="icon" />
            <p class="section-text">
              {{ ocorrencia?.zona }},
              {{ ocorrencia?.andar }}
            </p>
          </div>
        </div>

        <!-- Reporter -->
        <div class="info-section">
          <h2 class="section-title">Denunciante</h2>
          <div class="info-with-icon">
            <Mail class="icon" />
            <div>
              <p class="section-text">
                {{ ocorrencia?.email }}
              </p>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="info-section">
          <h2 class="section-title">Descrição</h2>
          <p class="description-text">
            {{ ocorrencia?.descricao }}
          </p>
        </div>

        <!-- Status -->
        <div class="status-container">
          <div class="analysis-badge">
            Em Análise
          </div>
        </div>
      </div>

      <!-- Right Column - Map and Images -->
      <div class="right-column">
        <!-- Map -->
        <div class="map-container">
          <img
            :src="mapaExemplo"
            alt="Mapa do Hospital"
            class="map-image"
          />
          <div class="hospital-marker">
            <div class="red-marker">
              <MapPin class="marker-icon" />
            </div>
          </div>
        </div>

        <!-- Images -->
        <div class="images-section">
          <h2 class="section-title">Imagens</h2>
          <div class="images-grid">
            <div class="image-container" v-if="ocorrencia?.imagem">
              <img
                :src="ocorrencia.imagem"
                alt="Imagem da ocorrência"
                class="evidence-image"
              />
            </div>
            <div class="image-container" v-else>
              <img
                :src="imagemExemplo"
                alt="Imagem padrão"
                class="evidence-image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Add useRouter
import { X, MapPin, Mail, FileText } from 'lucide-vue-next';
import mapaExemplo from '@/assets/mapa.png';
import imagemExemplo from '@/assets/exemplo.png';

const route = useRoute();
const router = useRouter(); // Initialize router
const ocorrencia = ref(null);

onMounted(() => {
  try {
    // Get ID from route params
    const id = route.params.id;

    // Get occurrences from localStorage
    const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias') || '[]');
    console.log('Ocorrências encontradas:', ocorrencias); // Debug log

    // Find the specific occurrence
    const found = ocorrencias.find(o => o.id === id);
    console.log('Ocorrência encontrada:', found); // Debug log

    if (found) {
      ocorrencia.value = found;
    } else {
      console.error('Ocorrência não encontrada:', id);
      router.push('/historico');
    }
  } catch (error) {
    console.error('Erro ao carregar ocorrência:', error);
    router.push('/historico');
  }
});
</script>

<style scoped>
.container {
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
  padding: 1.5rem;
  background-color: #fcfcff;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.close-btn {
  color: #111b29;
}

.title {
  font-size: 1.875rem;
  font-weight: 600;
  color: #111b29;
}

.content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

@media (min-width: 768px) {
  .content {
    grid-template-columns: 3fr 2fr;
  }
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.badge-container {
  width: 100%;
}

.status-badge {
  background-color: rgba(3, 181, 170, 0.2);
  color: #03b5aa;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 500;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-title {
  color: #545e75;
  font-size: 1.125rem;
  font-weight: 500;
}

.section-text {
  color: #111b29;
}

.info-with-icon {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
  color: #03b5aa;
}

.email-text {
  color: #7e7e7e;
}

.description-text {
  color: #111b29;
  font-size: 0.875rem;
  line-height: 1.625;
}

.status-container {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
}

.analysis-badge {
  background-color: #fcdebe;
  color: #695c5c;
  padding: 0.5rem 2rem;
  border-radius: 9999px;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 500;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.map-container {
  border-radius: 0.5rem;
  overflow: hidden;
  height: 20rem;
  background-color: #eff2f4;
  position: relative;
}

.map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Remove these style blocks */
.map-center-marker,
.marker-outer,
.marker-inner,
.marker-plus,
.marker-label {
  display: none;
}

.hospital-marker {
  position: absolute;
  top: 25%;
  right: 25%;
}

.red-marker {
  background-color: #ff0004;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: white;
}

.images-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.image-container {
  border-radius: 8px;
  overflow: hidden;
  height: 200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.evidence-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.custom-shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.map-marker {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}
</style>
