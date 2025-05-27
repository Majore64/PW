<template>
  <div class="page-content">
    
    <!-- Seção Editar Funções -->
    <div class="settings-section">
      <h2>Editar Funções</h2>
      <ul class="settings-list">
        <li v-for="(funcao, index) in funcoes" :key="'funcao-'+index">
          {{ funcao }}
          <button @click="removerItem('funcoes', index)" class="delete-btn">X</button>
        </li>
      </ul>
      <div class="add-section">
        <input v-model="novaFuncao" placeholder="Nova função" class="input-field">
        <button @click="adicionarItem('funcoes', novaFuncao)" class="add-btn">+</button>
      </div>
    </div>
    
    <!-- Seção Editar Tipos de Ocorrências -->
    <div class="settings-section">
      <h2>Editar Tipos de Ocorrências</h2>
      <ul class="settings-list">
        <li v-for="(ocorrencia, index) in ocorrencias" :key="'ocorrencia-'+index">
          {{ ocorrencia }}
          <button @click="removerItem('ocorrencias', index)" class="delete-btn">X</button>
        </li>
      </ul>
      <div class="add-section">
        <input v-model="novaOcorrencia" placeholder="Novo tipo" class="input-field">
        <button @click="adicionarItem('ocorrencias', novaOcorrencia)" class="add-btn">+</button>
      </div>
    </div>
    
    <!-- Seção Editar Localizações -->
    <div class="settings-section">
      <h2>Editar Localizações</h2>
      <ul class="settings-list">
        <li v-for="(localizacao, index) in localizacoes" :key="'localizacao-'+index">
          {{ localizacao }}
          <button @click="removerItem('localizacoes', index)" class="delete-btn">X</button>
        </li>
      </ul>
      <div class="add-section">
        <input v-model="novaLocalizacao" placeholder="Nova localização" class="input-field">
        <button @click="adicionarItem('localizacoes', novaLocalizacao)" class="add-btn">+</button>
      </div>
    </div>
    
    <!-- Botão Save -->
    <div class="save-section">
      <button @click="salvarAlteracoes" class="save-btn">Salvar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DefinicoesPage',
  data() {
    return {
      funcoes: [],
      ocorrencias: [],
      localizacoes: [],
      novaFuncao: '',
      novaOcorrencia: '',
      novaLocalizacao: ''
    }
  },
  methods: {
    removerItem(tipo, index) {
      this[tipo].splice(index, 1);
    },
    adicionarItem(tipo, novoItem) {
      if (novoItem.trim() !== '') {
        this[tipo].push(novoItem.trim());
        this[`nova${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`] = '';
      }
    },
    salvarAlteracoes() {
      localStorage.setItem('tipoFuncoes', JSON.stringify(this.funcoes));
      localStorage.setItem('tipoOcorrencias', JSON.stringify(this.ocorrencias));
      localStorage.setItem('tipoLocalizacoes', JSON.stringify(this.localizacoes));

      alert('Alterações salvas com sucesso!');
    },
    carregarDados() {
      const funcoesArmazenadas = localStorage.getItem('tipoFuncoes');
      const ocorrenciasArmazenadas = localStorage.getItem('tipoOcorrencias');
      const localizacoesArmazenadas = localStorage.getItem('tipoLocalizacoes');

      this.funcoes = funcoesArmazenadas ? JSON.parse(funcoesArmazenadas) : [];
      this.ocorrencias = ocorrenciasArmazenadas ? JSON.parse(ocorrenciasArmazenadas) : [];
      this.localizacoes = localizacoesArmazenadas ? JSON.parse(localizacoesArmazenadas) : [];
    }
  },
  mounted() {
    this.$emit('update-title', 'Definições');
    this.carregarDados();
  }
}
</script>


<style scoped>
.page-content {
  text-align: left;
  max-width: 600px;
  margin: 0;
  padding: 20px;
}

@media (min-width: 1400px) {
  .page-content {
    max-width: 1200px;
  }
}

.settings-section {
  margin-bottom: 30px;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.settings-section h2 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2em;
}

.settings-list {
  list-style-type: none;
  padding: 0;
}

.settings-list li {
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
}

.delete-btn {
  background: none;
  border: none;
  color: #718EBF;
  cursor: pointer;
  font-weight: bold;
  padding: 0 10px;
}

.delete-btn:hover {
  color: #304D6D;
}

.add-section {
  display: flex;
  margin-top: 10px;
  padding-left: 20px;
}

.input-field {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.add-btn {
  background: #FCDEBE;
  color: #304D6D;
  border: none;
  border-radius: 4px;
  padding: 0 15px;
  cursor: pointer;
  font-size: 1.2em;
  font-weight: 900;
}

.add-btn:hover {
  background: #F8C894;
}

.save-section {
  text-align: right;
  margin-top: 20px;
}

.save-btn {
  background-color: #718EBF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
}

.save-btn:hover {
  background-color: #304D6D;
}
</style>