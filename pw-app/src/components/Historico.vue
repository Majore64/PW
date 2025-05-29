<template>
  <div class="full-page-box">
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

        <!-- Barra de pesquisa -->
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
              <th>Detalhes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ocorrencia in ocorrenciasFiltradas" :key="ocorrencia.id">
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
                  :class="{ 'resolvido': ocorrencia.resolvido }"
                  :disabled="ocorrencia.resolvido"
                  >
                  <span class="validate-button">{{ ocorrencia.resolvido ? 'resolvido' : 'por resolver' }}</span>
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
export default {
  name: 'HistoricoPage',

  data() {
    return {
      termoPesquisa: '',
      filtroAtivo: 'todos',
      paginaAtual: 1,
      itensPorPagina: 9,
      ocorrencias: [],
      tabs: [
        { id: 'todos', label: 'Todas Ocorrências' }
      ]
    };
  },

  computed: {
    ocorrenciasFiltradas() {
      let filtradas = [...this.ocorrencias];

      // Filtro por tipo de ocorrência
      if (this.filtroAtivo !== 'todos') {
        const tabSelecionada = this.tabs.find(tab => tab.id === this.filtroAtivo);
        if (tabSelecionada) {
          filtradas = filtradas.filter(o => o.tipo === tabSelecionada.label);
        }
      }

      // Filtro por pesquisa
      if (this.termoPesquisa) {
        const termo = this.termoPesquisa.toLowerCase();
        filtradas = filtradas.filter(o =>
          o.alertaPor.toLowerCase().includes(termo) || 
          o.alocadoA.toLowerCase().includes(termo) ||
          o.area.toLowerCase().includes(termo) ||
          o.id.toString().includes(termo)
        );
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
          o.area.toLowerCase().includes(termo) ||
          o.id.toString().includes(termo)
        );
      }

      return Math.ceil(total.length / this.itensPorPagina);
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

    carregarOcorrencias() {
      const ocorrenciasRaw = JSON.parse(localStorage.getItem('ocorrencias')) || [];

      this.ocorrencias = ocorrenciasRaw
        .filter(oc => oc.resolvido === true)
        .map((oc) => ({
          id: oc.id,
          alertaPor: oc.nomeFuncionario,
          tipo: oc.tipoOcorrencia,
          area: oc.localizacao,
          data: oc.data,
          alocadoA: oc.alocadoA,
          validado: oc.validado,
          resolvido: oc.resolvido
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
    }
  },

  mounted() {
    this.$emit('update-title', 'Histórico');
    this.carregarTabsOcorrencia();
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

.ocorrencias-table th:nth-child(1) { width: 14.28%; }
.ocorrencias-table th:nth-child(2) { width: 14.28%; }
.ocorrencias-table th:nth-child(3) { width: 14.28%; }
.ocorrencias-table th:nth-child(4) { width: 14.28%; }
.ocorrencias-table th:nth-child(5) { width: 14.28%; }
.ocorrencias-table th:nth-child(6) { width: 14.28%; }
.ocorrencias-table th:nth-child(7) { width: 14.28%; text-align: center !important;}

.ocorrencias-table th, .ocorrencias-table td {
padding: 12px 15px;
border-bottom: 1px solid #ddd;
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
color: #B53232;
}

.action-btn {
margin-right: 5px;
border: #B53232 solid 1px;
border-radius: 10px;
cursor: pointer;
font-size: 0.9em;
background-color: white;
color: white;
display: flex;
align-items: center;
justify-content: center;
padding: 8px;
width: 60%;
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

.action-btn.resolvido {
  border-color: #03B5AA;
}

.action-btn.resolvido .validate-button {
  color: #03B5AA;
}
</style>
