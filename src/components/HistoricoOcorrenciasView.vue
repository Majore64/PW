<template>
  <div class="historico-page">
    <div class="header">
      <button @click="$router.back()" class="back-button">←</button>
      <h2>Histórico de Ocorrências</h2>
    </div>

    <table class="tabela">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Email</th>
          <th>Localização</th>
          <th>Estado</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ocorrencia in ocorrencias" :key="ocorrencia.id">
          <td>{{ ocorrencia.tipo }}</td>
          <td>{{ ocorrencia.email }}</td>
          <td>{{ ocorrencia.zona }} - {{ ocorrencia.andar }}</td>
          <td>{{ ocorrencia.estado || 'Em Análise' }}</td>
          <td>
            <button @click="verDetalhes(ocorrencia.id)" class="btn-detalhes">
              ➔
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOcorrenciasStore } from '@/stores/ocorrencias'

const router = useRouter()
const store = useOcorrenciasStore()
const ocorrencias = ref([])

onMounted(() => {
  // Get occurrences from localStorage
  const savedOcorrencias = JSON.parse(localStorage.getItem('ocorrencias') || '[]')
  ocorrencias.value = savedOcorrencias
  console.log('Ocorrências carregadas:', ocorrencias.value)
})

const verDetalhes = (id) => {
  console.log('Abrindo detalhes da ocorrência:', id)
  router.push(`/detalhes/${id}`)
}
</script>

<style scoped>
.coluna {
  padding: 1rem;
  color: #12203c;
  font-weight: 500;
}

.estado {
  padding: 1rem;
  color: #ff4d4d;
  font-weight: bold;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
}

.header h2 {
  color: #000;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.back-button {
  position: absolute;
  left: 0;
  background-color: #1c2d50;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1.2rem;
}

.historico-page {
  padding: 2rem;
  background-color: #f3f6f9;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-button {
  background-color: #1c2d50;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1.2rem;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.tabela th,
.tabela td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ccc;
}

.tabela th {
  background-color: #d8ecfb;
  color: #12203c;
}

.btn-detalhes {
  background-color: #1c2d50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
}

.btn-detalhes:hover {
  background-color: #2a4171;
}
</style>
