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
      funcionarios: [],
      tabs: [
        { id: 'todos', label: 'Todos Funcionários' }
      ] 
    };
  },
  computed: {
    funcionariosFiltrados() {
      let filtrados = [...this.funcionarios];

      // Se não for "todos", filtra pela função correspondente
      if (this.filtroAtivo !== 'todos') {
        const filtroSelecionado = this.tabs.find(tab => tab.id === this.filtroAtivo);
        if (filtroSelecionado) {
          filtrados = filtrados.filter(f => 
            f.funcao === filtroSelecionado.label
          );
        }
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
      const novo = {
        id: Date.now(),  // Usa timestamp para gerar um id único
        ...novoFuncionario
      };
      this.funcionarios.push(novo);
      localStorage.setItem('funcionarios', JSON.stringify(this.funcionarios));
      this.fecharPopup();
    },
    // Funções de paginação 
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
    carregarFiltros() {
      // Busca as funções do localStorage (array de strings)
      const funcoes = JSON.parse(localStorage.getItem('tipoFuncoes')) || [];
      
      // Transforma as strings em objetos de filtro
      const tabsFuncoes = funcoes.map(funcao => ({
        id: this.criarIdDaFuncao(funcao), // Cria um ID baseado no nome
        label: funcao
      }));
      
      // Atualiza os tabs, mantendo o "todos" como primeiro
      this.tabs = [
        { id: 'todos', label: 'Todos Funcionários' },
        ...tabsFuncoes
      ];
    },
    criarIdDaFuncao(nomeFuncao) {
      // Converte para minúsculas e substitui espaços por underscores
      return nomeFuncao.toLowerCase()
        .replace(/\s+/g, '_')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove acentos
    },
    contarFuncionariosPorFuncao(funcao) {
      return this.funcionarios.filter(f => f.funcao === funcao).length;
    }
  },
  mounted() {
    this.$emit('update-title', 'Funcionários');

    // Carrega os filtros
    this.carregarFiltros();

    const dadosGuardados = localStorage.getItem('funcionarios');
    if (dadosGuardados) {
      this.funcionarios = JSON.parse(dadosGuardados);

      // Se não existir id, cria um
      this.funcionarios = this.funcionarios.map((f, index) => {
        if (!f.id) {
          return { ...f, id: index + 1 };  // usa índice + 1 como id
        }
        return f;
      });

      // Atualiza o localStorage com os ids adicionados
      localStorage.setItem('funcionarios', JSON.stringify(this.funcionarios));
    }
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
