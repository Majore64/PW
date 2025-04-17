<template>
  <div class="criar-ocorrencia">
    <div class="header">
      <button class="back-button" @click="$router.back()">←</button>
      <h2>Criar Ocorrência</h2>
      <img src="@/assets/Logo.png" alt="Logo" class="logo" />
    </div>

    <div class="content">
      <div class="form-left">
        <label>Tipo de Ocorrência</label>
        <select v-model="tipoSelecionado">
          <option disabled value="">Selecione...</option>
          <option>Local Sujo</option>
          <option>Equipamento Danificado</option>
          <option>Falta de Material Médico</option>
          <option>Material Fora do Lugar</option>
        </select>

        <label>Email</label>
        <input v-model="email" type="email" placeholder="exemplo@gmail.com" />

        <div class="row">
          <div class="col">
            <label>Zona</label>
            <input v-model="zona" type="text" placeholder="Insira zona" />
          </div>
          <div class="col">
            <label>Andar</label>
            <input v-model="andar" type="text" placeholder="Ex: 2º Andar" />
          </div>
        </div>

        <label>Descrição</label>
        <textarea v-model="descricao" placeholder="Escreva algo..."></textarea>

        <button class="upload-btn">📤 Inserir Imagens</button>
      </div>

      <div class="map-right">
        <img src="@/assets/mapa.png" alt="Mapa" class="mapa" />
      </div>
    </div>

    <button class="submit-btn" @click="criarOcorrencia">
      Criar Ocorrência
    </button>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useOcorrenciasStore } from '@/stores/ocorrencias' // <-- IMPORTA A STORE
  import { useRouter } from 'vue-router'
  const route = useRoute()
  const router = useRouter()
  const store = useOcorrenciasStore()
  
  onMounted(() => {
    tipoSelecionado.value = route.query.tipo || ''
  })
    const tipoSelecionado = ref('')
      const email = ref('')
      const zona = ref('')
      const andar = ref('')
      const descricao = ref('')


    // FUNÇÃO PARA GUARDAR NA STORE
      function criarOcorrencia() {
        const nova = {
          tipo: tipoSelecionado.value,
          email: email.value,
          zona: zona.value,
          andar: andar.value,
          descricao: descricao.value,
          data: new Date().toLocaleString()
        }

        store.adicionarOcorrencia(nova)
        console.log(store.ocorrencias) // <-- ADICIONA À STORE
        alert('Ocorrência criada com sucesso!')
        router.push('/') // <-- VOLTA PARA HOME OU AJUSTA
      }


  </script>

  
  <style scoped>
  label {
  color: black;
  font-weight: 500;
  }
  .criar-ocorrencia {
    background-color: #f3f6f9;
    padding: 2rem;
    min-height: 100vh;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .back-button {
    background-color: #1c2d50;
    color: white;
    border: none;
    border-radius: 12px;
    padding: 0.5rem 1rem;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.4);
  }
  
  .logo {
    width: 70px;
  }
  
  .content {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }
  
  .form-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .row {
    display: flex;
    gap: 1rem;
  }
  
  .col {
    flex: 1;
  }
  
  textarea,
  input,
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #caf0f8;
  }
  
  textarea {
    height: 120px;
    resize: none;
  }
  
  .upload-btn {
    background-color: white;
    border: 1px solid #ccc;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    align-self: start;
  }
  
  .map-right {
    flex: 1;
  }
  
  .mapa {
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
  }
  
  .submit-btn-container {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
  }
  
  .submit-btn {
    background-color: #1cd6d6;
    color: rgb(18, 14, 14);
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 10px;
    cursor: pointer;
  }
  </style>
  