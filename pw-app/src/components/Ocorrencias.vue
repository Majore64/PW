<template>
  <div class="full-page-box">
    <div class="section section-1">
      <div class="box box-1">
        <div class="circle blue"><span>✏️</span></div>
        <div class="text">
          <span class="label">Por validar</span>
          <span class="value">7</span>
        </div>
      </div>
      <div class="box box-2">
        <div class="circle orange"><span>🚫</span></div>
        <div class="text">
          <span class="label">Não Atribuídas</span>
          <span class="value">2</span>
        </div>
      </div>
      <div class="box box-3">
        <div class="circle pink"><span>⏳</span></div>
        <div class="text">
          <span class="label">Pendentes</span>
          <span class="value">10</span>
        </div>
      </div>
      <div class="box box-4">
        <div class="circle cyan"><span>✅</span></div>
        <div class="text">
          <span class="label">Validadas</span>
          <span class="value">26</span>
        </div>
      </div>
    </div>
    <div class="section section-2">
      <div class="filter-wrapper">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab-button', { active: selectedTab === tab }]"
          @click="selectedTab = tab"
        >
          {{ tab }}
        </button>
      </div>
      <div class="search-wrapper">
        <div class="search-box">
          <span class="icon">🔍</span>
          <input type="text" placeholder="Search for something" />
        </div>
        <button class="add-button" @click="()=> togglePopup('buttonTrigger')">➕</button>
        <PopupModal v-if="popupTriggers.buttonTrigger" closePopup :TogglePopup="()=> togglePopup('buttonTrigger')">
        </PopupModal>
      </div>
    </div>
    <div class="section section-3">
      <table class="custom-table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Localização</th>
            <th>Data</th>
            <th>Alerta dado por</th>
            <th>Tipo de ocorrência</th>
            <th>Alocado a</th>
            <th>Validação</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ocorrencia, index) in ocorrencias" :key="index">
            <td>{{ ocorrencia.numero }}</td>
            <td>{{ ocorrencia.localizacao }}</td>
            <td>{{ ocorrencia.data }}</td>
            <td>{{ ocorrencia.alerta }}</td>
            <td>{{ ocorrencia.tipo }}</td>
            <td>{{ ocorrencia.alocado }}</td>
            <td>
              <button
                :class="ocorrencia.validada ? 'validada-btn' : 'validar-btn'"
                @click="validarOcorrencia(index)"
              >
                {{ ocorrencia.validada ? 'Validada' : 'Validar' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="section section-4"></div>
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

      tabs: ['Todos Funcionários', 'Enfermeiros', 'Médicos', 'Funcionários de Limpeza',],
      selectedTab: 'Todos Funcionários',
      ocorrencias: [
        {
          numero: '001',localizacao: 'João Silva',data: '2025-04-17',alerta: 'Validada',tipo: 'Incidente',alocado: 'Ana Costa',
          validada: true,
        },
        {
          numero: '002',localizacao: 'Maria Lima',data: '2025-04-16',alerta: 'Pendente',tipo: 'Erro',alocado: 'Carlos Dias',
          validada: false,
        },
        {
          numero: '002',localizacao: 'Maria Lima',data: '2025-04-16',alerta: 'Pendente',tipo: 'Erro',alocado: 'Carlos Dias',
          validada: false,
        },
        {
          numero: '002',localizacao: 'Maria Lima',data: '2025-04-16',alerta: 'Pendente',tipo: 'Erro',alocado: 'Carlos Dias',
          validada: false,
        },
        {
          numero: '002',localizacao: 'Maria Lima',data: '2025-04-16',alerta: 'Pendente',tipo: 'Erro',alocado: 'Carlos Dias',
          validada: false,
        },
        {
          numero: '002',localizacao: 'Maria Lima',data: '2025-04-16',alerta: 'Pendente',tipo: 'Erro',alocado: 'Carlos Dias',
          validada: false,
        },
      ]
    }
  },

  mounted() {
    this.$emit('update-title', 'Ocorrências');
  },

  methods: {
    validarOcorrencia(index) {
      this.ocorrencias[index].validada = true;
    },

    togglePopup(trigger) {
      this.popupTriggers[trigger] = !this.popupTriggers[trigger];
    }

  }
}
</script>

<style scoped>
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
  border: 1px solid black;
}

.circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* evita encolher */
  margin-left: 30px;
}

.circle span {
  font-size: 18px;
}

.blue { background-color: #e0e7ff; color: #3b82f6; }
.orange { background-color: #fef3c7; color: #f59e0b; }
.pink { background-color: #fce7f3; color: #ec4899; }
.cyan { background-color: #ccfbf1; color: #06b6d4; }

.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  margin-left: 10px;
}

.label {
  font-size: 12px;
  color: #545E75; /* cor suave */
}

.value {
  font-size: 15px;
  font-weight: bold;
  color: #111827;
}


.section-2 {
  height: 8.33%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 2px solid #e5e7eb; /* linha cinzenta fina */
  box-sizing: border-box;
}

.filter-wrapper {
  display: flex;
  gap: 32px;
  flex: 2;
}

.tab-button {
  background: none;
  border: none;
  font-size: 14px;
  color: #64748b; /* cinza azulado */
  padding-bottom: 6px;
  position: relative;
  cursor: pointer;
  transition: color 0.3s;
}

.tab-button.active {
  color: #14b8a6; /* verde água */
  font-weight: 600;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #14b8a6;
  border-radius: 2px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  gap: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #f1f5f9;
  border-radius: 9999px;
  padding: 6px 12px;
}

.search-box .icon {
  margin-right: 8px;
  font-size: 14px;
  color: #94a3b8;
}

.search-box input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #334155;
}

.add-button {
  width: 32px;
  height: 32px;
  background-color: #14b8a6;
  color: white;
  font-size: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  font-size: 14px;
  table-layout: fixed; /* garante colunas de mesmo tamanho */
}

.custom-table th,
.custom-table td {
  padding: 10px;
  text-align: center; /* centraliza horizontalmente */
  vertical-align: middle; /* centraliza verticalmente */
  border-bottom: 1px solid #e5e7eb; /* linha tenue */
  width: calc(100% / 7); /* 7 colunas iguais */
}

/* Cabeçalho tabela */
.custom-table th {
  font-weight: 600;
  color: #545E75;
  background-color: #f9fafb;
}

/* Conteúdo tabela*/
.custom-table td {
  color: #4b5563;
}

.validar-btn {
  background-color: white;
  color: #14b8a6;
  border: 2px solid #14b8a6;
  border-radius: 25px;
  padding: 3px 0;
  width: 100px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.validar-btn:hover {
  background-color: #14b8a6;
  color: white;
}

.validada-btn {
  background-color: white;
  color: #1e3a8a; /* azul escuro */
  border: 2px solid #1e3a8a;
  border-radius: 25px;
  padding: 3px 0;
  width: 100px;
  font-weight: 500;
  cursor: default;
}

.table-wrapper {
  padding: 0 24px; /* espaço igual à esquerda e direita */
  height: 100%;
}

/* Limita visualmente a tabela a 8 linhas, com altura igual para cada linha */
.section-3 {
  height: 70.83%;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.custom-table tr {
  height: calc(100% / 8); /* 1 linha de header + 7 linhas de dados */
}


.section-4 {
  height: 8.33%;
  background-color: red;
}

</style>
