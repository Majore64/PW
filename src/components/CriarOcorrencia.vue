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
        <input
          v-model="email"
          type="email"
          placeholder="exemplo@gmail.com"
          disabled
        />

        <div class="row">
          <div class="col">
            <label>Zonaa</label>
            <input v-model="zona" type="text" placeholder="Insira zona" />
          </div>
          <div class="col">
            <label>Andar</label>
            <input v-model="andar" type="text" placeholder="Ex: 2º Andar" />
          </div>
        </div>
                <!-- AQUI ENTRE A ZONA/ANDAR E A DESCRIÇÃO -->
          <label>Material</label>
          <div class="row">
            <select v-model="materialSelecionado">
              <option disabled value="">Selecionar material</option>
              <option v-for="mat in materiais" :key="mat">{{ mat }}</option>
            </select>
            <button type="button" @click="adicionarMaterial">Adicionar</button>
          </div>

          <div class="materiais-lista">
            <span
              v-for="mat in materiaisEscolhidos"
              :key="mat"
              class="material-tag">
              {{ mat }}
              <button @click="removerMaterial(mat)">❌</button>
            </span>
          </div>
                <label>Descrição</label>
        <textarea v-model="descricao" placeholder="Escreva algo..."></textarea>

        <button class="upload-btn" @click="abrirUpload">📤 Inserir Imagem</button>
          <input type="file" ref="inputFile" style="display: none" @change="handleFile" accept="image/*" />

        <div class="form-group">
          <label>Imagem da Ocorrência</label>
          <input
            type="file"
            @change="handleImageUpload"
            accept="image/*"
            class="form-control"
          />
          <img
            v-if="imagemPreview"
            :src="imagemPreview"
            class="preview-image"
            alt="Preview"
          />
        </div>
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
  const materiais = ['Luvas', 'Seringas', 'Máscaras', 'Leito', 'Cateter']
  const materialSelecionado = ref('')
  const materiaisEscolhidos = ref([])

  function adicionarMaterial() {
      if (materialSelecionado.value && !materiaisEscolhidos.value.includes(materialSelecionado.value)) {
        materiaisEscolhidos.value.push(materialSelecionado.value)
      }
        }
        function removerMaterial(material) {
      materiaisEscolhidos.value = materiaisEscolhidos.value.filter(m => m !== material)
    }
  onMounted(() => {
    tipoSelecionado.value = route.query.tipo || ''

    // Carregar o email do localStorage
    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) {
      email.value = userEmail
    }
  })
    const tipoSelecionado = ref('')
      const email = ref('')
      const zona = ref('')
      const andar = ref('')
      const descricao = ref('')
      const imagemSelecionada = ref(null)
      const imagemPreview = ref(null)
      const imagemBase64 = ref(null)

    // FUNÇÃO PARA GUARDAR NA STORE
      function criarOcorrencia() {
        const novaOcorrencia = {
          id: Date.now().toString(),
          tipo: tipoSelecionado.value,
          data: new Date().toLocaleString(),
          zona: zona.value,
          andar: andar.value,
          email: email.value,
          materiais: materiaisEscolhidos.value,
          descricao: descricao.value,
          imagem: imagemBase64.value, // Add the image to the occurrence data
          status: 'Em Análise'
        }

        // Save to store
        store.adicionarOcorrencia(novaOcorrencia)

        // Save to localStorage
        const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias') || '[]')
        ocorrencias.push(novaOcorrencia)
        localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias))

        alert('Ocorrência criada com sucesso!')
        router.push(`/detalhes/${novaOcorrencia.id}`)
      }
      const inputFile = ref(null)
       function abrirUpload() {
          inputFile.value.click()
        }

        function handleFile(event) {
        const file = event.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = () => {
            imagemSelecionada.value = reader.result // guarda imagem como base64
          }
          reader.readAsDataURL(file)
        }
      }

      const handleImageUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            imagemPreview.value = e.target.result
            imagemBase64.value = e.target.result
          }
          reader.readAsDataURL(file)
        }
      }

      const salvarOcorrencia = () => {
        // Create new occurrence object
        const novaOcorrencia = {
          id: Date.now().toString(), // Generate unique ID
          tipo: tipoSelecionado.value,
          data: new Date().toLocaleDateString(),
          zona: zona.value,
          andar: andar.value,
          email: email.value,
          descricao: descricao.value,
          imagem: imagemSelecionada.value
        };

        // Get existing occurrences
        const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias') || '[]');

        // Add new occurrence
        ocorrencias.push(novaOcorrencia);

        // Save back to localStorage
        localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));

        // Navigate to details page
        router.push(`/detalhes/${novaOcorrencia.id}`);
      };
</script>


  <style scoped>
  .materiais-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.material-tag {
  background-color: #caf0f8;
  border: 1px solid #00b4d8;
  color: black; /* <--- AQUI! texto preto */
  border-radius: 20px;
  padding: 0.3rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.material-tag button {
  background: none;
  border: none;
  cursor: pointer;
  color: #d90429;
}
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

  .preview-image {
    max-width: 200px;
    max-height: 200px;
    margin-top: 10px;
    border-radius: 8px;
  }

  .form-group {
    margin-bottom: 1rem;
  }
  </style>
