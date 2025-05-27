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
          @keyup.enter="pesquisar"
        >
        <button @click="pesquisar" class="search-btn">
          <span class="material-icons">search</span>
        </button>
        <!-- Botão de adicionar -->
        <button @click="togglePopupAdicionarMaterial" class="add-btn">
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
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="material in materiaisFiltrados" :key="material.id">
            <td>{{ material.nomeMaterial }}</td>
            <td>{{ material.quantidade }}</td>
            <td>
              <span :class="['estado-badge', (material.estado || '').toLowerCase()]">
                {{ material.estado }}
              </span>
            </td>
            <td>{{ material.quantRest }}</td>
            <td class="actions-cell">
              <button @click="verInfo(material)" class="action-btn" title="Editar">
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

    <PopupAdicionarMaterial
      v-if="showPopupAdicionarMaterial" 
      :togglePopup="togglePopupAdicionarMaterial"
      @material-adicionado="adicionarMaterial"
    />

    <PopupInfoMateriais
      v-if="showPopupInfoMateriais" 
      :togglePopup="togglePopupInfoMateriais"
      :material="materialSelecionado"
      @material-editado="editarMaterial"
      @material-removido="removerMaterial"
    />
  </div>
</template>

<script>
import PopupAdicionarMaterial from './PopupAdicionarMaterial.vue';
import PopupInfoMateriais from './PopupInfoMateriais.vue';

export default {
  name: 'MateriaisPage',
  components: {
    PopupAdicionarMaterial,
    PopupInfoMateriais,
  },
  data() {
    return {
      termoPesquisa: '',
      filtroAtivo: 'todos',
      showPopupAdicionarMaterial: false,
      showPopupInfoMateriais: false,
      paginaAtual: 1,
      itensPorPagina: 10,
      materialSelecionado: null,
      materiais: [],
      tabs: [
        { id: 'todos', label: 'Todos Materiais' },
        { id: 'disponiveis', label: 'Disponiveis' },
        { id: 'alocados', label: 'Alocados' },
        { id: 'indisponiveis', label: 'Indisponiveis' }
      ]
    };
  },
  computed: {
    materiaisFiltrados() {
      let filtrados = [...this.materiais];
    
      // COLOCAR DO LADO DAS OCORRENCIAS E APAGAR AQUI
    const ocorrencias = [
      {
        id: 1,
        descricao: "Queda em escadas",
        data: "2025-05-05",
        materiais: [
          { nome: "Esfregona", quantidade: 2, quantidadeInvalida: false},

        ]
      }
    ];
    localStorage.setItem("ocorrencias", JSON.stringify(ocorrencias));


      // 1. Obter as ocorrências da localStorage
      let ocorrenciasJSON = localStorage.getItem('ocorrencias');
      if (!ocorrenciasJSON) ocorrenciasJSON = null;

      if (ocorrenciasJSON) {

      const ocorrencias = JSON.parse(ocorrenciasJSON);

      // 2. Inicializar um mapa para contar os materiais usados
      const contagemMateriais = {};

      // 3. Contar os materiais usados em todas as ocorrências
      ocorrencias.forEach(ocorrencia => {
        if (Array.isArray(ocorrencia.materiais)) {
          ocorrencia.materiais.forEach(material => {
            const nome = material.nome;
            if (!contagemMateriais[nome]) {
              contagemMateriais[nome] = 0;
            }
            contagemMateriais[nome] += Number(material.quantidade) || 0;
          });
        }
      });

        // 4. Atualizar o array local `materiais`
        filtrados =  filtrados.map(material => {
          const usado = contagemMateriais[material.nomeMaterial] || 0;
          const restante = Math.max(material.quantidade - usado, 0);
          return {
            ...material,
            quantRest: restante,
            estado: restante === 0 ? 'Indisponivel' : 'Disponivel'
          };
        });
      }

      // Aplicar filtro por estado
      if (this.filtroAtivo === 'disponiveis') {
        let arr = [];
        filtrados = filtrados.filter(m => { 
          if (m.quantidade == m.quantRest) { 
            m.estado = "Disponivel";
            arr.push(m) 
          }
        })
        filtrados = arr;
      } else if (this.filtroAtivo === 'alocados') {
        filtrados = filtrados.filter(m => m.quantRest > 0 && m.quantidade > m.quantRest);
      }else if (this.filtroAtivo === 'indisponiveis') {
        let arr = [];
        filtrados = filtrados.filter(m => { 
          if (m.quantRest === 0) { 
            m.estado = "Indisponivel";
            arr.push(m) 
          }
        })
        filtrados = arr;
      }

      // Aplicar pesquisa
      if (this.termoPesquisa.trim()) {
        const termo = this.termoPesquisa.toLowerCase();
        filtrados = filtrados.filter(m =>
          m.nomeMaterial.toLowerCase().includes(termo) || 
          m.quantidade.toString().includes(termo) ||
          m.id.toString().includes(termo)
        );
      }

      // Paginação
      const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
      return filtrados.slice(inicio, inicio + this.itensPorPagina);
    },
    totalPaginas() {
      let total = [...this.materiais];

      if (this.filtroAtivo === 'disponiveis') {
        total = total.filter(m => m.estado.toLowerCase().includes('disponivel'));
      } else if (this.filtroAtivo === 'alocados') {
        total = total.filter(m => m.estado.toLowerCase().includes('alocado'));
      } else if (this.filtroAtivo === 'indisponiveis') {
        total = total.filter(m => Number(m.quantRest)===0);
      }

      if (this.termoPesquisa.trim()) {
        const termo = this.termoPesquisa.toLowerCase();
        total = total.filter(m =>
          m.nomeMaterial.toLowerCase().includes(termo) || 
          m.quantidade.toString().includes(termo) ||
          m.id.toString().includes(termo)
        );
      }

      return Math.ceil(total.length / this.itensPorPagina);
    }
  },
  methods: {
    togglePopupAdicionarMaterial() {
      this.showPopupAdicionarMaterial = !this.showPopupAdicionarMaterial;
    },
    pesquisar() {
      this.paginaAtual = 1;
    },
    togglePopupInfoMateriais() {
      this.showPopupInfoMateriais = !this.showPopupInfoMateriais;
    },
    verInfo(material) {
      console.log('Material selecionado:', material);
      this.materialSelecionado = material;
      this.togglePopupInfoMateriais();
    },
    adicionarMaterial(novoMaterial) {
      if (!novoMaterial.estado) novoMaterial.estado = 'Disponivel';
      if (novoMaterial.quantRest === undefined) novoMaterial.quantRest = novoMaterial.quantidade;
      this.materiais.push(novoMaterial);
    },
    editarMaterial(materialEditado) {
      const index = this.materiais.findIndex(m => m.id === materialEditado.id);
      if (index !== -1) {
        if (!materialEditado.estado) materialEditado.estado = 'Disponivel';
        if (materialEditado.quantRest === undefined) {
          materialEditado.quantRest = materialEditado.quantidade;
        }
          this.materiais.splice(index, 1, materialEditado);
        
      }
    },
    removerMaterial(id) {
      this.materiais = this.materiais.filter(m => m.id !== id);
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
  },
  watch: {
      filtroAtivo(novo) {
          localStorage.setItem('filtroAtivo', novo);
      },
      termoPesquisa(novo) {
          localStorage.setItem('termoPesquisa', novo);
      },
      paginaAtual(novo) {
          localStorage.setItem('paginaAtual', novo);
      },
      materiais: {
          handler(novosMateriais) {
              localStorage.setItem('materiais', JSON.stringify(novosMateriais));
          },
      deep: true
      } 
  },
  mounted() {
      this.$emit('update-title', 'Materiais');
      const materiaisGuardados = localStorage.getItem('materiais');
      const filtro = localStorage.getItem('filtroAtivo');
      const pesquisa = localStorage.getItem('termoPesquisa');
      const pagina = localStorage.getItem('paginaAtual');

      if (filtro) this.filtroAtivo = filtro;
      if (pesquisa) this.termoPesquisa = pesquisa;
      if (pagina) this.paginaAtual = parseInt(pagina);
      if (materiaisGuardados) {
          try {
              this.materiais = JSON.parse(materiaisGuardados);
          } catch (e) {
          console.error("Erro ao carregar materiais do localStorage:", e);
          }
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
  transition: all 0.3s ease;
}

.tabs button.active {
  background-color: #03B5AA;
  color: white;
  font-weight: bold;
}

.tabs button:hover:not(.active) {
  background-color: #e0e0e0;
}

.search-wrapper {
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: flex-end;
  gap: 10px;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  width: 250px;
  transition: border 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #03B5AA;
}

.search-btn, .add-btn {
  background-color: #03B5AA;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 4px;
  transition: opacity 0.3s ease;
}

.search-btn:hover, .add-btn:hover {
  opacity: 0.9;
}

.material-icons {
  font-size: 24px;
}

.table-container {
  overflow-x: auto;
  width: 100%;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 8px;
}

.materiais-table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.materiais-table th:nth-child(1) { width: 25%; }
.materiais-table th:nth-child(2) { width: 15%; }
.materiais-table th:nth-child(3) { width: 20%; }
.materiais-table th:nth-child(4) { width: 20%; }
.materiais-table th:nth-child(5) { width: 20%; }

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
  color: #333;
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
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.estado-badge.indisponivel {
  background-color: #fac8c8;
  color: #ee0303;
  border: 1px solid #fac8c8;
}

.estado-badge.alocado {
  background-color: #fff3e0;
  color: #e65100;
  border: 1px solid #ffe0b2;
}

.actions-cell {
  display: flex;
  gap: 5px;
}

.action-btn {
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
  transition: opacity 0.3s ease;
}

.action-btn:hover {
  opacity: 0.9;
}

.action-btn.info-btn {
  background-color: #03B5AA;
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
  min-width: 36px;
  padding: 8px 12px;
  border: 1px solid #03B5AA;
  background-color: white;
  cursor: pointer;
  border-radius: 4px;
  color: #03B5AA;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  background-color: #f0f9f9;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button.active {
  background-color: #03B5AA;
  color: white;
  border-color: #03B5AA;
  font-weight: bold;
}
</style>