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
        <button @click="abrirPopup" class="add-btn">
          <span class="material-icons">add</span>
        </button>
      </div>
    </div>
    
    <!-- Tabela -->
    <div class="table-container">
      <table class="funcionarios-table">
        <thead>
          <tr>
            <th>Número de Funcionário</th>
            <th>Nome</th>
            <th>Função</th>
            <th>Área Alocado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="funcionario in funcionariosFiltrados" :key="funcionario.id">
            <td>{{ funcionario.numero }}</td>
            <td>{{ funcionario.nome }}</td>
            <td>{{ funcionario.funcao }}</td>
            <td>{{ funcionario.area }}</td>
            <td>
              <button @click="verPerfil(funcionario)" class="action-btn">
                <span class="material-icons">more_vert</span>
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
        <button 
          @click="irParaPagina(n)" 
          :class="{ active: n === paginaAtual }"
        >
          {{ n }}
        </button>
      </span>
      <button @click="proximaPagina" :disabled="paginaAtual === totalPaginas">Próxima</button>
    </div>

    <!-- O Popup -->
    <FuncionarioPopup 
      v-if="mostrarPopup" 
      @fechar="fecharPopup" 
      @guardar="guardarFuncionario"
    />
  </div>
</template>

<script>
import FuncionarioPopup from './FuncionarioPopup.vue';

export default {
  name: 'FuncionariosPage',
  components: {
    FuncionarioPopup, 
  },
  data() {
    return {
      mostrarPopup: false,
      termoPesquisa: '',
      filtroAtivo: 'todos',
      paginaAtual: 1,
      itensPorPagina: 10,
      funcionarios: [
        { id: 1, numero: 'f1234', nome: 'João Ribeiro', funcao: 'Auxiliar de Enfermagem', area: 'Piso 1, sala 1' },
        { id: 2, numero: 'f1235', nome: 'Maria Santos', funcao: 'Médico', area: 'Piso 2, sala 1' },
        { id: 3, numero: 'f1236', nome: 'Ana Lima', funcao: 'Funcionário de Limpeza', area: 'Piso 1, sala 2' },
        { id: 4, numero: 'f1237', nome: 'Carlos Nogueira', funcao: 'Enfermeiro', area: 'Piso 1, sala 3' },
        { id: 5, numero: 'f1238', nome: 'Carlos Nogueira', funcao: 'Enfermeiro', area: 'Piso 1, sala 3' },
        { id: 6, numero: 'f1239', nome: 'Carlos Nogueira', funcao: 'Enfermeiro', area: 'Piso 1, sala 3' },
        { id: 7, numero: 'f1240', nome: 'Carlos Nogueira', funcao: 'Enfermeiro', area: 'Piso 1, sala 3' },
        { id: 8, numero: 'f1241', nome: 'Carlos Nogueira', funcao: 'Enfermeiro', area: 'Piso 1, sala 3' },
        { id: 9, numero: 'f1242', nome: 'Carlos Nogueira', funcao: 'Enfermeiro', area: 'Piso 1, sala 3' },
        { id: 10, numero: 'f1243', nome: 'Carlos Nogueira', funcao: 'Enfermeiro', area: 'Piso 1, sala 3' },
        { id: 11, numero: 'f1244', nome: 'Carlos Nogueira', funcao: 'Enfermeiro', area: 'Piso 1, sala 3' },
        { id: 12, numero: 'f1245', nome: 'Carlos Nogueira', funcao: 'Enfermeiro', area: 'Piso 1, sala 3' },
        { id: 13, numero: 'f1246', nome: 'Carlos Nogueira', funcao: 'Enfermeiro', area: 'Piso 1, sala 3' },
        { id: 14, numero: 'f1247', nome: 'Carlos Nogueira', funcao: 'Enfermeiro', area: 'Piso 1, sala 3' },
      ],
      tabs: [
        { id: 'todos', label: 'Todos Funcionários' },
        { id: 'enfermeiros', label: 'Enfermeiros' },
        { id: 'medicos', label: 'Médicos' },
        { id: 'limpeza', label: 'Funcionários de Limpeza' }
      ]
    };
  },
  computed: {
    funcionariosFiltrados() {
      let filtrados = [...this.funcionarios];

      if (this.filtroAtivo === 'enfermeiros') {
        filtrados = filtrados.filter(f => f.funcao.toLowerCase().includes('enfermeiro'));
      } else if (this.filtroAtivo === 'medicos') {
        filtrados = filtrados.filter(f => f.funcao.toLowerCase().includes('médico'));
      } else if (this.filtroAtivo === 'limpeza') {
        filtrados = filtrados.filter(f => f.funcao.toLowerCase().includes('limpeza'));
      }

      if (this.termoPesquisa) {
        const termo = this.termoPesquisa.toLowerCase();
        filtrados = filtrados.filter(f =>
          f.nome.toLowerCase().includes(termo) || 
          f.numero.toLowerCase().includes(termo)
        );
      }

      const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
      return filtrados.slice(inicio, inicio + this.itensPorPagina);
    },
    totalPaginas() {
      let total = [...this.funcionarios];

      if (this.filtroAtivo === 'enfermeiros') {
        total = total.filter(f => f.funcao.toLowerCase().includes('enfermeiro'));
      } else if (this.filtroAtivo === 'medicos') {
        total = total.filter(f => f.funcao.toLowerCase().includes('médico'));
      } else if (this.filtroAtivo === 'limpeza') {
        total = total.filter(f => f.funcao.toLowerCase().includes('limpeza'));
      }

      if (this.termoPesquisa) {
        const termo = this.termoPesquisa.toLowerCase();
        total = total.filter(f =>
          f.nome.toLowerCase().includes(termo) || 
          f.numero.toLowerCase().includes(termo)
        );
      }

      return Math.ceil(total.length / this.itensPorPagina);
    }
  },
  methods: {
    pesquisar() {
      this.paginaAtual = 1;
    },
    verPerfil(funcionario) {
      this.$router.push({ name: 'Perfil', params: { id: funcionario.id } });
    },
    abrirPopup() {
      this.mostrarPopup = true; 
    },
    fecharPopup() {
      this.mostrarPopup = false; 
    },
    guardarFuncionario(novoFuncionario) {
      this.funcionarios.push({
        id: this.funcionarios.length + 1,
        ...novoFuncionario
      });
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
    this.$emit('update-title', 'Funcionários');
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
  color: white; 
}

.add-btn:hover {
  opacity: 0.9;
}

.table-container {
  overflow-x: auto;
  width: 100%;
  margin-bottom: 20px;
}

.funcionarios-table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  min-width: 800px; /* Largura mínima para evitar compressão */
}

.funcionarios-table th:nth-child(1) { width: 20%; }
.funcionarios-table th:nth-child(2) { width: 25%; }
.funcionarios-table th:nth-child(3) { width: 30%; }
.funcionarios-table th:nth-child(4) { width: 20%; }
.funcionarios-table th:nth-child(5) { width: 5%; }

.funcionarios-table th, .funcionarios-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.funcionarios-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  position: sticky;
  top: 0;
}

.funcionarios-table tr:hover {
  background-color: #f9f9f9;
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
</style>
