<template>
  <div class="full-page-box">
    <div class="section section-1">
      <div class="box box-1">
        <div class="circle blue">
          <span class="material-icons blue-icon">edit</span>
        </div>
        <div class="text">
          <span class="label">Por validar</span>
          <span class="value">7</span>
        </div>
      </div>
      <div class="box box-2">
        <div class="circle orange">
          <span class="material-icons yellow-icon">block</span>
        </div> 
        <div class="text">
          <span class="label">Não Atribuídas</span>
          <span class="value">2</span>
        </div>
      </div>
      <div class="box box-3">
        <div class="circle pink">
          <span class="material-icons pink-icon">hourglass_empty</span>
        </div>
        <div class="text">
          <span class="label">Pendentes</span>
          <span class="value">10</span>
        </div>
      </div>
      <div class="box box-4">
        <div class="circle cyan">
          <span class="material-icons green-icon">check_circle</span>
        </div>
        <div class="text">
          <span class="label">Validadas</span>
          <span class="value">26</span>
        </div>
      </div>
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
                <button @click="() => togglePopup('buttonTrigger')" class="add-btn">
                  <span class="material-icons">add</span>
                </button>

                <PopupModal 
                  v-if="popupTriggers.buttonTrigger" 
                  closePopup 
                  :TogglePopup="() => togglePopup('buttonTrigger')" 
                />

            </div>
          </div>
          
          <!-- Tabela -->
          <div class="table-container">
          <table class="funcionarios-table">
              <thead>
              <tr>
                  <th>Número</th>
                  <th>Alerta dado por</th>
                  <th>Tipo de ocorrencia</th>
                  <th>Localização</th>
                  <th>Data</th>
                  <th>Alocado a</th>
                  <th>Validação</th>
              </tr>
              </thead>
              <tbody>
                <tr v-for="funcionario in funcionariosFiltrados" :key="funcionario.id">
                    <td>{{ funcionario.id}}</td>
                    <td>{{ funcionario.alertaPor }}</td>
                    <td>{{ funcionario.tipo }}</td>
                    <td>{{ funcionario.area }}</td>
                    <td>{{ funcionario.data }}</td>
                    <td>{{ funcionario.alocadoA }}</td>
                    <td>
                    <button @click="verPerfil(funcionario)" class="action-btn">
                        <span class="validate-button"> validar</span>
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
    paginaAtual: 1,
    itensPorPagina: 9,
    funcionarios: [
      { id: 1, alertaPor: 'Joana Silva', tipo: 'Limpeza', area: 'Piso 1, sala 1', data: '12/03/2025', alocadoA: 'João Ribeiro' },
      { id: 2, alertaPor: 'Pedro Costa', tipo: 'Material médico desarrumado', area: 'Piso 2, sala 1', data: '15/03/2025', alocadoA: 'Maria Santos' },
      { id: 3, alertaPor: 'Ana Sousa', tipo: 'Medicamentos sem rótulo', area: 'Piso 1, sala 2', data: '18/03/2025', alocadoA: 'Ana Lima' },
      { id: 4, alertaPor: 'Carlos Mendes', tipo: 'Limpeza', area: 'Piso 1, sala 3', data: '20/03/2025', alocadoA: 'Carlos Nogueira' },
      { id: 5, alertaPor: 'Rita Pereira', tipo: 'Material médico desarrumado', area: 'Piso 1, sala 3', data: '22/03/2025', alocadoA: 'Carlos Nogueira' },
      { id: 6, alertaPor: 'Miguel Rocha', tipo: 'Medicamentos sem rótulo', area: 'Piso 1, sala 3', data: '25/03/2025', alocadoA: 'Carlos Nogueira' },
      { id: 7, alertaPor: 'Sofia Martins', tipo: 'Limpeza', area: 'Piso 1, sala 3', data: '28/03/2025', alocadoA: 'Carlos Nogueira' },
      { id: 8, alertaPor: 'Tiago Almeida', tipo: 'Material médico desarrumado', area: 'Piso 1, sala 3', data: '30/03/2025', alocadoA: 'Carlos Nogueira' },
      { id: 9, alertaPor: 'Beatriz Lopes', tipo: 'Medicamentos sem rótulo', area: 'Piso 1, sala 3', data: '02/04/2025', alocadoA: 'Carlos Nogueira' },
      { id: 10, alertaPor: 'Ricardo Fernandes', tipo: 'Limpeza', area: 'Piso 1, sala 3', data: '05/04/2025', alocadoA: 'Carlos Nogueira' },
      { id: 11, alertaPor: 'Mariana Carvalho', tipo: 'Material médico desarrumado', area: 'Piso 1, sala 3', data: '08/04/2025', alocadoA: 'Carlos Nogueira' },
      { id: 12, alertaPor: 'André Sousa', tipo: 'Medicamentos sem rótulo', area: 'Piso 1, sala 3', data: '10/04/2025', alocadoA: 'Carlos Nogueira' },
      { id: 13, alertaPor: 'Inês Ribeiro', tipo: 'Limpeza', area: 'Piso 1, sala 3', data: '12/04/2025', alocadoA: 'Carlos Nogueira' },
      { id: 14, alertaPor: 'João Martins', tipo: 'Material médico desarrumado', area: 'Piso 1, sala 3', data: '15/04/2025', alocadoA: 'Carlos Nogueira' }
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
    filtrados = filtrados.filter(f => f.tipo.toLowerCase().includes('material médico desarrumado'));
  } else if (this.filtroAtivo === 'medicos') {
    filtrados = filtrados.filter(f => f.tipo.toLowerCase().includes('medicamentos sem rótulo'));
  } else if (this.filtroAtivo === 'limpeza') {
    filtrados = filtrados.filter(f => f.tipo.toLowerCase().includes('limpeza'));
  }

  if (this.termoPesquisa) {
    const termo = this.termoPesquisa.toLowerCase();
    filtrados = filtrados.filter(f =>
      f.alertaPor.toLowerCase().includes(termo) || 
      f.alocadoA.toLowerCase().includes(termo) ||
      f.area.toLowerCase().includes(termo)
    );
  }

  const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
  return filtrados.slice(inicio, inicio + this.itensPorPagina);
},
  totalPaginas() {
let total = [...this.funcionarios];

if (this.filtroAtivo === 'enfermeiros') {
  total = total.filter(f => f.tipo.toLowerCase().includes('material médico desarrumado'));
} else if (this.filtroAtivo === 'medicos') {
  total = total.filter(f => f.tipo.toLowerCase().includes('medicamentos sem rótulo'));
} else if (this.filtroAtivo === 'limpeza') {
  total = total.filter(f => f.tipo.toLowerCase().includes('limpeza'));
}

if (this.termoPesquisa) {
  const termo = this.termoPesquisa.toLowerCase();
  total = total.filter(f =>
    f.alertaPor.toLowerCase().includes(termo) || 
    f.alocadoA.toLowerCase().includes(termo) ||
    f.area.toLowerCase().includes(termo)
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
  }
},
mounted() {
  this.$emit('update-title', 'Ocorrências');
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
  flex: 1;
  height: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  gap:10px;

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

.funcionarios-table {
table-layout: fixed;
width: 100%;
border-collapse: collapse;
min-width: 800px; /* Largura mínima para evitar compressão */
}

.funcionarios-table th:nth-child(1) { width: 20%; }
.funcionarios-table th:nth-child(2) { width: 20%; }
.funcionarios-table th:nth-child(3) { width: 30%; }
.funcionarios-table th:nth-child(4) { width: 20%; }
.funcionarios-table th:nth-child(5) { width: 20%; }
.funcionarios-table th:nth-child(6) { width: 20%; }
.funcionarios-table th:nth-child(7) { width: 20%; }

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
</style>
