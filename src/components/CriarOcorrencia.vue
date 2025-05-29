<template>
  <div class="criar-ocorrencia">
    <div class="header">
      <button class="back-button" @click="$router.back()">←</button>
      <h2>Criar Ocorrência</h2>
      <img src="@/assets/Logo.png" alt="Logo" class="logo" />
    </div>

    <div class="content">
      <div class="form-left">
        <form @submit.prevent="criarOcorrencia">
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
              <label>Localização</label>
               <select v-model="localizacao">
                <option disabled value="">Selecionar localização</option>
                <option v-for="loc in localizacoes" :key="loc">{{ loc }}</option>
              </select>
            </div>
          </div>
          
          <label>Material</label>
          <div class="row">
            <select v-model="materialSelecionado">
              <option disabled value="">Selecionar material</option>
              <option v-for="mat in materiais" :key="mat">{{ mat }}</option>
            </select>
         <input
              type="number"
              min="1"
              :max="getMaxQtd(materialSelecionado)"
              v-model.number="quantidadeSelecionada"
              placeholder="Qtd."
              style="width: 70px"
            />
            <button type="button" @click="adicionarMaterial">Adicionar</button>
          </div>

          <div class="materiais-lista">
           <span
            v-for="mat in materiaisEscolhidos"
            :key="mat.nomeMaterial"
            class="material-tag">
            {{ mat.nomeMaterial }} ({{ mat.quantidade }})
            <button @click="removerMaterial(mat.nomeMaterial)">❌</button>
          </span>
          </div>

          <label>Descrição</label>
          <textarea v-model="descricao" placeholder="Escreva algo..."></textarea>

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
          <button type="submit">Criar Ocorrência</button>
        </form>

      </div>

      <div class="map-right">
        <img src="@/assets/mapa.png" alt="Mapa" class="mapa" />
      </div>
    </div>
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
  const materiais = ref([])
  const materialSelecionado = ref('')
  const quantidadeSelecionada = ref(1)
  const materiaisEscolhidos = ref([])
  const localizacoes = ref([])

    function adicionarMaterial() {
        const stockMateriais = JSON.parse(localStorage.getItem('materiais') || '[]')
        const matObj = stockMateriais.find(m => m.nomeMaterial === materialSelecionado.value)
        const maxQtd = matObj ? matObj.quantidade : 0

        if (quantidadeSelecionada.value > maxQtd) {
          alert('Não pode pedir mais do que o stock disponível!')
          return
        }

        if (
          materialSelecionado.value &&
          quantidadeSelecionada.value > 0 &&
          !materiaisEscolhidos.value.some(m => m.nomeMaterial === materialSelecionado.value)
        ) {
          materiaisEscolhidos.value.push({
            nomeMaterial: materialSelecionado.value, // <-- ALTERADO
            quantidade: quantidadeSelecionada.value,
            quantidadeInvalida: false
          })
          materialSelecionado.value = ''
          quantidadeSelecionada.value = 1
        }
      }

    function removerMaterial(nomeMaterial) {
      materiaisEscolhidos.value = materiaisEscolhidos.value.filter(m => m.nomeMaterial !== nomeMaterial)
    }
      function getMaxQtd(nome) {
            const stockMateriais = JSON.parse(localStorage.getItem('materiais') || '[]')
            const matObj = stockMateriais.find(m => m.nomeMaterial === nome)
            return matObj ? matObj.quantidade : 1
          }
        onMounted(() => {
        tipoSelecionado.value = route.query.tipo || ''

        // Carregar o email do localStorage
        const userEmail = localStorage.getItem('userEmail')
        if (userEmail) {
          email.value = userEmail
        }

        // Carregar o nome do utilizador Google do localStorage
        const userData = localStorage.getItem('user')
        if (userData) {
          try {
            const userObj = JSON.parse(userData)
            if (userObj.name) {
              nomeFuncionario.value = userObj.name
            }
          } catch (e) {
            // Se der erro a fazer parse, ignora
          }
        }
         const locs = JSON.parse(localStorage.getItem('tipoLocalizacoes') || '[]')
          localizacoes.value = locs
          const mats = JSON.parse(localStorage.getItem('materiais') || '[]')
           materiais.value = mats.map(m => m.nomeMaterial)
      })
    const tipoSelecionado = ref('')
      const email = ref('')
      const nomeFuncionario = ref('')
      const numeroFuncionario = ref('')
      const alocadoA = ref('-')
      const resolvido = ref(false)
      const validado = ref(false)
      const localizacao = ref('') 
      const descricao = ref('')
      const imagemSelecionada = ref(null)
      const imagemPreview = ref(null)
      const imagemBase64 = ref(null)

    function criarOcorrencia() {
      const stockMateriais = JSON.parse(localStorage.getItem('materiais') || '[]')
          for (const mat of materiaisEscolhidos.value) {
            const matObj = stockMateriais.find(m => m.nomeMaterial === mat.nomeMaterial)
            const maxQtd = matObj ? matObj.quantidade : 0
            if (mat.quantidade > maxQtd) {
              alert(`Não pode pedir mais ${mat.nomeMaterial} do que o stock disponível!`)
              return
            }
          }
        const novaOcorrencia = {
          id: Date.now().toString(),
          nomeFuncionario: nomeFuncionario.value,
          numeroFuncionario: Number(numeroFuncionario.value), // <-- número
          tipoOcorrencia: tipoSelecionado.value,
          localizacao: localizacao.value,
          data: new Date().toLocaleString(),
          materiais: materiaisEscolhidos.value,
          resolvido: resolvido.value,
          validado: validado.value,
          descricao: descricao.value,
          imagem: imagemBase64.value || null,
        }
        store.adicionarOcorrencia(novaOcorrencia)
        router.push(`/detalhes/${novaOcorrencia.id}`)
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
