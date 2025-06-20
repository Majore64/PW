<template>
  <div class="full-page-box">
    <div class="section section-1">
      <button @click="toggleFiltroNaoValidadas('validadas')" class="box">
        <div class="circle blue">
          <span class="material-icons blue-icon">edit</span>
        </div>
        <div class="text">
          <span class="label">Por validar</span>
          <span class="value">{{ ocorrenciasNaoValidadas }}</span>
        </div>
      </button>
      <button @click="toggleFiltroNaoAlocacao('validadas')" class="box">
        <div class="circle orange">
          <span class="material-icons yellow-icon">block</span>
        </div> 
        <div class="text">
          <span class="label">Não Atribuídas</span>
          <span class="value">{{ ocorrenciasNaoAtribuidas }}</span>
        </div>
      </button>
      <button @click="toggleFiltroValidacao('validadas')" class="box">
        <div class="circle pink">
          <span class="material-icons pink-icon">check_circle</span>
        </div>
        <div class="text">
          <span class="label">Validadas</span>
          <span class="value">{{ ocorrenciasValidadas }}</span>
        </div>
      </button>
      <button @click="toggleFiltroAlocadas('validadas')" class="box">
        <div class="circle cyan">
          <span class="material-icons green-icon">hourglass_empty</span>
        </div>
        <div class="text">
          <span class="label">Atribuidas</span>
          <span class="value">{{ ocorrenciasAtribuidas }}</span>
        </div>
      </button>
    </div>
    <div class="page-content">
      <!-- Filtros como abas horizontais -->
      <div class="tabs-container">
        <div class="tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="filtroAtivo = tab.id"
            :class="{ active: filtroAtivo === tab.id }"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Barra de pesquisa e botão de criar ocorrencia -->
        <div class="search-wrapper">
          <input 
            type="text" 
            v-model="termoPesquisa" 
            placeholder="Pesquisar por nome ou número..." 
            class="search-input"
          >
          <button @click="pesquisar" class="search-btn">
            <span class="material-icons">search</span>
          </button>
          <button @click="() => togglePopup('buttonTrigger')" class="add-btn">
            <span class="material-icons">add</span>
          </button>

          <PopupModal 
            v-if="popupTriggers.buttonTrigger" 
            closePopup 
            :TogglePopup="() => togglePopup('buttonTrigger')"
            @ocorrencia-criada="carregarOcorrencias"
          />
        </div>
      </div>

      <!-- Tabela -->
      <div class="table-container">
        <table class="ocorrencias-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Alerta dado por</th>
              <th>Tipo de ocorrência</th>
              <th>Localização</th>
              <th>Data</th>
              <th>Alocado a</th>
              <th>Validação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ocorrencia in ocorrenciasFiltradas" :key="ocorrencia.id" >
              <td>{{ ocorrencia.id }}</td>
              <td>{{ ocorrencia.alertaPor }}</td>
              <td>{{ ocorrencia.tipo }}</td>
              <td>{{ ocorrencia.area }}</td>
              <td>{{ ocorrencia.data }}</td>
              <td>{{ ocorrencia.alocadoA }}</td>
              <td>
                <button 
                  @click="verPerfil(ocorrencia)" 
                  class="action-btn" 
                  :class="{ 'validado': ocorrencia.validado }"
    
                  >
                  <span class="validate-button">{{ ocorrencia.validado ? 'validado' : 'validar' }}</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div class="pagination">
        <button @click="paginaAnterior" :disabled="paginaAtual === 1">Anterior</button>
        <span v-for="n in totalPaginas" :key="n">
          <button @click="irParaPagina(n)" :class="{ active: n === paginaAtual }">
            {{ n }}
          </button>
        </span>
        <button @click="proximaPagina" :disabled="paginaAtual === totalPaginas">Próxima</button>
      </div>
    </div>
  </div>
</template>

<script>
import PopupModal from './popup.vue';

export default {
  name: 'OcorrenciasPage',

  components: {
    PopupModal
  },

  data() {
    return {
      popupTriggers: {
        buttonTrigger: false,
      },
      termoPesquisa: '',
      filtroAtivo: 'todos',
      filtroValidacao: null,  
      filtroAlocacao: null,
      paginaAtual: 1,
      itensPorPagina: 7,
      ocorrencias: [],
      tiposOcorrencia: [], // Novo: armazena tipos de ocorrência
      tabs: [
        { id: 'todos', label: 'Todas Ocorrências' }
      ]
    };
  },

  computed: {
    ocorrenciasFiltradas() {
      let filtradas = [...this.ocorrencias];

      // Novo: filtro dinâmico por tipo de ocorrência
      if (this.filtroAtivo !== 'todos') {
        const tabSelecionada = this.tabs.find(tab => tab.id === this.filtroAtivo);
        if (tabSelecionada) {
          filtradas = filtradas.filter(o => o.tipo === tabSelecionada.label);
        }
      }

      if (this.termoPesquisa) {
        const termo = this.termoPesquisa.toLowerCase();
        filtradas = filtradas.filter(o =>
          o.alertaPor.toLowerCase().includes(termo) || 
          o.alocadoA.toLowerCase().includes(termo) ||
          o.area.toLowerCase().includes(termo)
        );
      }

      // Aplica filtro de validação
      if (this.filtroValidacao === 'validadas') {
        filtradas = filtradas.filter(o => o.validado);
      } else if (this.filtroValidacao === 'naoValidadas') {
        filtradas = filtradas.filter(o => !o.validado);
      }

      // Aplica filtro de alocação
      if (this.filtroAlocacao === 'naoAlocadas') {
        filtradas = filtradas.filter(o => o.alocadoA === "-" && o.alocadoA == "");
      } else if (this.filtroAlocacao === 'alocadas') {
        filtradas = filtradas.filter(o => o.alocadoA !== "-" && o.alocadoA !== "");
      }

      const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
      return filtradas.slice(inicio, inicio + this.itensPorPagina);
    },

    totalPaginas() {
      let total = [...this.ocorrencias];
      if (this.filtroAtivo !== 'todos') {
        const tabSelecionada = this.tabs.find(tab => tab.id === this.filtroAtivo);
        if (tabSelecionada) {
          total = total.filter(o => o.tipo === tabSelecionada.label);
        }
      }

      if (this.termoPesquisa) {
        const termo = this.termoPesquisa.toLowerCase();
        total = total.filter(o =>
          o.alertaPor.toLowerCase().includes(termo) || 
          o.alocadoA.toLowerCase().includes(termo) ||
          o.area.toLowerCase().includes(termo)
        );
      }

      return Math.ceil(total.length / this.itensPorPagina);
    },

    ocorrenciasNaoValidadas(){
      return this.ocorrencias.filter(o => !o.validado && !o.resolvido).length;
    },

    ocorrenciasValidadas(){
      return this.ocorrencias.filter(o => o.validado && !o.resolvido).length;
    },
    ocorrenciasNaoAtribuidas() {
      return this.ocorrencias.filter(o => o.alocadoA === "-" && !o.resolvido).length;
    },
    ocorrenciasAtribuidas() {
      return this.ocorrencias.filter(o => o.alocadoA !== "-" && !o.resolvido).length;
    }
  },

  methods: {
  pesquisar() {
    this.paginaAtual = 1;
  },

  verPerfil(ocorrencia) {
    this.$router.push({ name: 'OcorrenciaPerfil', params: { id: ocorrencia.id } });
  },

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
    }
  },

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  },

  irParaPagina(n) {
    this.paginaAtual = n;
  },

  togglePopup(trigger) {
    this.popupTriggers[trigger] = !this.popupTriggers[trigger];
  },

  carregarOcorrencias() {
  const ocorrenciasRaw = JSON.parse(localStorage.getItem('ocorrencias')) || [];
  
  this.ocorrencias = ocorrenciasRaw
    .filter(oc => !oc.resolvido) 
    .map((oc) => ({
      id: oc.id,
      alertaPor: oc.nomeFuncionario,
      tipo: oc.tipoOcorrencia,
      area: oc.localizacao,
      data: oc.data,
      alocadoA: oc.alocadoA,
      validado: oc.validado 
    }));
},

  carregarTabsOcorrencia() {
    // Busca os tipos de ocorrência do localStorage
    const tipos = JSON.parse(localStorage.getItem('tipoOcorrencias')) || [];
    const tabsTipos = tipos.map(tipo => ({
      id: this.criarIdDoTipo(tipo),
      label: tipo
    }));
    this.tabs = [
      { id: 'todos', label: 'Todas Ocorrências' },
      ...tabsTipos
    ];
  },

  criarIdDoTipo(tipo) {
    return tipo.toLowerCase().replace(/\s+/g, '_').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  },

  toggleFiltroValidacao(tipo) {
    this.filtroValidacao = this.filtroValidacao === tipo ? null : tipo;
    this.filtroAlocacao = null;

  },
  toggleFiltroNaoValidadas() {
  this.filtroValidacao = this.filtroValidacao === 'naoValidadas' ? null : 'naoValidadas';
  this.filtroAlocacao = null;
  },
  toggleFiltroNaoAlocacao() {
    this.filtroAlocacao = this.filtroAlocacao === 'naoAlocadas' ? null : 'naoAlocadas';
    this.filtroValidacao = null;
  },
  toggleFiltroAlocadas() {
    this.filtroAlocacao = this.filtroAlocacao === 'alocadas' ? null : 'alocadas';
    this.filtroValidacao = null;
  }
},

  mounted() {
    this.$emit('update-title', 'Ocorrências');
    this.carregarTabsOcorrencia(); // Novo: carrega tabs dinâmicas
    this.carregarOcorrencias();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

/* Mantemos apenas o estilo relevante para a section-1 */
.full-page-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.section-1 {
  height: 12.49%;
  display: flex;
  box-sizing: border-box;
  gap: 14px;
}

.box {
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0; 
  flex: 1;
  height: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer; 
  transition: box-shadow 0.2s; 
}

button.box {
  width: 100%; 
  text-align: left; 
  justify-content: flex-start; 
  outline: none; 
  border-radius: 12px;
}

button.box:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); 
}

.circle {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 30px;
}

.circle span {
  font-size: 18px;
}

.blue { background-color: #e0e7ff }
.orange { background-color: #fef3c7}
.pink { background-color: #fce7f3 }
.cyan { background-color: #ccfbf1}

.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  margin-left: 10px;
}

.label {
  font-size: 20px;
  color: #545E75;
}

.value {
  font-size: 20px;
  font-weight: bold;
  color: #111827;
}

.page-content {
text-align: left;
width: 100%;
padding: 20px;
box-sizing: border-box; 
}

@media (min-width: 1400px) {
.page-content {
  width: 100%;
}
}

.tabs-container {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 20px;
flex-wrap: wrap;
gap: 15px;
}

.tabs {
display: flex;
gap: 5px;
flex-wrap: wrap;
}

.tabs button {
padding: 8px 16px;
border: none;
background: #f5f5f5;
border-radius: 4px 4px 0 0;
cursor: pointer;
font-size: 0.9em;
}

.tabs button.active {
background-color: #03B5AA;
color: white;
font-weight: bold;
}

.search-wrapper {
display: flex;
align-items: center;
flex-grow: 1;
justify-content: flex-end;
}

.search-input {
padding: 8px;
border: 1px solid #ddd;
border-radius: 4px;
font-size: 1em;
width: 250px; 
}

.search-btn {
background-color: #03B5AA;
color: white;
border: none;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
padding: 8px;
}

.search-btn:hover {
opacity: 0.9;
}

.add-btn {
background-color: #03B5AA;
color: white;
border: none;
border-radius: 4px;
margin-left: 10px;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
padding: 8px;
}

.material-icons {
font-size: 24px; 
color: white; 
}

.blue-icon {
font-size: 30px !important; 
color: #3b82f6; 
}

.yellow-icon {
font-size: 36px !important; 
color: #f59e0b; 
}

.pink-icon {
font-size: 36px !important; 
color: #ec4899; 
}

.green-icon {
font-size: 36px !important; 
color: #06b6d4; 
}

.add-btn:hover {
opacity: 0.9;
}

.table-container {
overflow-x: auto;
width: 100%;
margin-bottom: 20px;
}

.ocorrencias-table {
table-layout: fixed;
width: 100%;
border-collapse: collapse;
min-width: 800px; /* Largura mínima para evitar compressão */
}

.ocorrencias-table th:nth-child(1) { width: 20%; }
.ocorrencias-table th:nth-child(2) { width: 20%; }
.ocorrencias-table th:nth-child(3) { width: 20%; }
.ocorrencias-table th:nth-child(4) { width: 20%; }
.ocorrencias-table th:nth-child(5) { width: 20%; }
.ocorrencias-table th:nth-child(6) { width: 20%; }
.ocorrencias-table th:nth-child(7) { width: 20%; }

.ocorrencias-table th, .ocorrencias-table td {
padding: 12px 15px;
border-bottom: 1px solid #ddd;
text-align: left;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.ocorrencias-table th {
background-color: #f5f5f5;
font-weight: bold;
position: sticky;
top: 0;
}

.ocorrencias-table tr:hover {
background-color: #f9f9f9;
}

.validate-button {
font-size: 18px;
color: #03B5AA;
}

.action-btn {
margin-right: 5px;
border: #03B5AA solid 1px;
border-radius: 10px;
cursor: pointer;
font-size: 0.9em;
background-color: white;
color: white;
display: flex;
align-items: center;
justify-content: center;
padding: 8px;
width: 50%;
}

.action-btn:hover {
opacity: 0.9;
}

.pagination {
position: fixed;
bottom: 20px; 
left: 50%;
display: flex;
justify-content: center;
align-items: center;
gap: 5px;
padding: 10px;
}

.pagination button {
padding: 8px 12px;
border: 1px solid #03B5AA;
background-color: white;
cursor: pointer;
border-radius: 4px;
color: #03B5AA;
}

.pagination button:hover:not(:disabled) {
background-color: #f5f5f5;
color: #03B5AA;
}

.pagination button:disabled {
opacity: 0.5;
cursor: not-allowed;
}

.pagination button.active {
background-color: #03B5AA;
color: white;
border-color: #03B5AA;
}

.action-btn.validado {
  border-color: #304D6D;
}

.action-btn.validado .validate-button {
  color: #304D6D;
}
</style>
