<template>
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
        <!-- Botão de adicionar -->
        <button @click="adicionarMaterial" class="add-btn">
          <span class="material-icons">add</span>
        </button>
      </div>
    </div>
    
    <!-- Tabela -->
    <div class="table-container">
      <table class="materiais-table">
        <thead>
          <tr>
            <th>Nome Material</th>
            <th>Quantidade</th>
            <th>Estado</th>
            <th>Quantidade Restante</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="material in materialFiltrados" :key="material.id">
            <td>{{ material.nome }}</td>
            <td>{{ material.quantidade }}</td>
            <td>
              <span :class="['estado-badge', material.estado.toLowerCase()]">
                {{ material.estado }}
              </span>
            </td>
            <td>{{ material.estado.toLowerCase().includes('disponivel') ? material.quantidade : material.quantRest }}</td>
            <td>
              <button @click="verInfo(material)" class="action-btn">
                <span class="material-icons">more_vert</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginação -->
    <div class="pagination">
      <button @click="paginaAnterior" :disabled="paginaAtual === 1"> 
        <span class="material-icons">chevron_left</span>
      </button>
      <span v-for="n in totalPaginas" :key="n">
        <button 
          @click="irParaPagina(n)" 
          :class="{ active: n === paginaAtual }"
        >
          {{ n }}
        </button>
      </span>
      <button @click="proximaPagina" :disabled="paginaAtual === totalPaginas">
        <span class="material-icons">chevron_right</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MateriaisPage',
  data() {
    return {
      termoPesquisa: '',
      filtroAtivo: 'todos',
      paginaAtual: 1,
      itensPorPagina: 10,
      material: [
        { id: 1, nome: 'Estetoscópio', quantidade: '50', estado: 'Disponivel', quantRest: '-----' },
        { id: 2, nome: 'Medidor de tensão', quantidade: '20', estado: 'Alocado', quantRest: '18' },
        { id: 3, nome: 'Esfregona', quantidade: '10', estado: 'Alocado', quantRest: '9' },
        { id: 4, nome: 'Detergente', quantidade: '15', estado: 'Alocado', quantRest: '14' },
        { id: 5, nome: 'Balança', quantidade: '20', estado: 'Disponivel', quantRest: '-----' },
        { id: 6, nome: 'Impressora', quantidade: '10', estado: 'Disponivel', quantRest: '-----' },
        { id: 7, nome: 'Batas médicas', quantidade: '50', estado: 'Disponivel', quantRest: '-----' },
        { id: 8, nome: 'Seringas', quantidade: '100', estado: 'Disponivel', quantRest: '-----' },
        { id: 9, nome: 'Bolsas de esterilização', quantidade: '150', estado: 'Disponivel', quantRest: '-----' },
        { id: 10, nome: 'Luvas cirurgicas', quantidade: '200', estado: 'Disponivel', quantRest: '-----' },
      ],
      tabs: [
        { id: 'todos', label: 'Todos Materiais' },
        { id: 'disponiveis', label: 'Disponiveis' },
        { id: 'indisponiveis', label: 'Indisponiveis' }
      ]
    };
  },
  computed: {
    materialFiltrados() {
      let filtrados = [...this.material];

      if (this.filtroAtivo === 'disponiveis') {
        filtrados = filtrados.filter(m => m.estado.toLowerCase().includes('disponivel'));
      } else if (this.filtroAtivo === 'indisponiveis') {
        filtrados = filtrados.filter(m => m.estado.toLowerCase().includes('alocado'));
      }

      if (this.termoPesquisa) {
        const termo = this.termoPesquisa.toLowerCase();
        filtrados = filtrados.filter(m =>
          m.nome.toLowerCase().includes(termo) || 
          m.quantidade.toLowerCase().includes(termo)
        );
      }

      const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
      return filtrados.slice(inicio, inicio + this.itensPorPagina);
    },
    totalPaginas() {
      let total = [...this.material];

      if (this.filtroAtivo === 'disponiveis') {
        total = total.filter(m => m.estado.toLowerCase().includes('disponivel'));
      } else if (this.filtroAtivo === 'indisponiveis') {
        total = total.filter(m => m.estado.toLowerCase().includes('alocado'));
      }

      if (this.termoPesquisa) {
        const termo = this.termoPesquisa.toLowerCase();
        total = total.filter(m =>
          m.nome.toLowerCase().includes(termo) || 
          m.quantidade.toLowerCase().includes(termo)
        );
      }

      return Math.ceil(total.length / this.itensPorPagina);
    }
  },
  methods: {
    pesquisar() {
      this.paginaAtual = 1;
    },
    verInfo(material) {
      console.log('Editar Material');
    },
    adicionarMaterial() {
      console.log('Adicionar Material');
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
    }
  },
  mounted() {
    this.$emit('update-title', 'Materiais');
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

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
}

.add-btn:hover {
  opacity: 0.9;
}

.table-container {
  overflow-x: auto;
  width: 100%;
  margin-bottom: 20px;
}

.materiais-table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  min-width: 800px; /* Largura mínima para evitar compressão */
}

.materiais-table th:nth-child(1) { width: 20%; }
.materiais-table th:nth-child(2) { width: 25%; }
.materiais-table th:nth-child(3) { width: 30%; }
.materiais-table th:nth-child(4) { width: 20%; }
.materiais-table th:nth-child(5) { width: 5%; }

.materiais-table th, .materiais-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.materiais-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  position: sticky;
  top: 0;
}

.materiais-table tr:hover {
  background-color: #f9f9f9;
}

.estado-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 500;
  text-align: center;
  min-width: 90px;
}

.estado-badge.disponivel {
  color: #4CAF50;
  border: 1px solid #4CAF50;
}

.estado-badge.alocado {
  color: #FF9800;
  border: 1px solid #FF9800;
}

.action-btn {
  margin-right: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  background-color: #304D6D;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.action-btn:hover {
  opacity: 0.9;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 20px;
}

.pagination button {
  height: 36px;
  width: 36px;
  padding: 8px 12px;
  border: 1px solid #03B5AA;
  background-color: white;
  cursor: pointer;
  border-radius: 4px;
  color: #03B5AA;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
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
</style>