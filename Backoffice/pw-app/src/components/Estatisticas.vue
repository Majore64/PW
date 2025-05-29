<template>
  <div class="page-content">

    <!-- 1ª Linha: Funcionários + Feedback -->
    <div class="stats-row first-row">
      <!-- Funcionários -->
      <div class="stats-section employees-section">
        <h2>Funcionários que mais contribuíram</h2>
        <div class="employees-grid">
          <div v-for="(employee, index) in topEmployees" :key="index" class="employee-card">
            <img :src="employee.image" :alt="employee.name" class="employee-image">
            <h3>{{ employee.name }}</h3>
            <p>{{ employee.position }}</p>
          </div>
        </div>
      </div>

      <!-- Feedback -->
      <div class="stats-section feedback-section">
        <h2>Feedback dos utilizadores</h2>
        <div class="chart-container">
          <canvas ref="feedbackChart"></canvas>
        </div>
      </div>
    </div>

    <!-- 2ª Linha: Ocorrências + Frequência -->
    <div class="stats-row">
      <!-- Ocorrências -->
      <div class="stats-section occurrences-section">
        <h2>Número de ocorrências nos locais</h2>
        <div class="chart-container">
          <canvas ref="locationChart"></canvas>
        </div>
      </div>

      <!-- Frequência -->
      <div class="stats-section frequency-section">
        <h2>Frequência de ocorrências</h2>
        <div class="chart-container">
          <canvas ref="frequencyChart"></canvas>
        </div>
      </div>
    </div>

    <!-- 3ª Linha: Histórico -->
    <div class="stats-row">
      <div class="stats-section history-section">
        <h2>Balanço histórico de Ocorrências</h2>
        <div class="chart-container">
          <canvas ref="historyChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'EstatisticasPage',
  data() {
    return {
      topEmployees: [],
      occurrenceData: {
        labels: [],
        values: []
      },
      frequencyData: {
        labels: [],
        values: [],
        colors: ['#79B4A9', '#304D6D', '#03B5AA']
      },
      historyData: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
        values: []
      }
    };
  },
  mounted() {
    this.$emit('update-title', 'Estatísticas');
    this.loadDataFromLocalStorage();
    this.$nextTick(() => {
      this.renderCharts();
    });
  },
  methods: {
    loadDataFromLocalStorage() {
      try {
        // Carregar funcionários
        const funcionarios = JSON.parse(localStorage.getItem('filtroAtivotodosfuncionarios') || '[]');
        
        // Carregar ocorrências
        const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias') || '[]');
        
        // Processar funcionários que mais contribuíram (baseado em ocorrências reportadas)
        this.processTopEmployees(funcionarios, ocorrencias);
        
        // Processar ocorrências por localização
        this.processLocationOccurrences(ocorrencias);
        
        // Processar frequência por tipo de ocorrência
        this.processOccurrenceFrequency(ocorrencias);
        
        // Processar histórico (simulado baseado nos dados atuais)
        this.processHistoryData(ocorrencias);
        
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
        this.setDefaultData();
      }
    },
    
    processTopEmployees(funcionarios, ocorrencias) {
      // Contar ocorrências por funcionário
      const funcionarioCount = {};
      
      ocorrencias.forEach(ocorrencia => {
        const nome = ocorrencia.nomeFuncionario;
        funcionarioCount[nome] = (funcionarioCount[nome] || 0) + 1;
      });
      
      // Ordenar funcionários por número de ocorrências reportadas
      const topFuncionarios = Object.entries(funcionarioCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);
      
      this.topEmployees = topFuncionarios.map(([nome]) => {
        const funcionario = funcionarios.find(f => f.nome === nome);
        return {
          name: nome,
          position: funcionario ? funcionario.funcao : 'Funcionário',
          image: '/img/default-employee.jpg' // Imagem padrão
        };
      });
      
      // Se não houver ocorrências suficientes, preencher com funcionários padrão
      while (this.topEmployees.length < 3 && funcionarios.length > 0) {
        const funcionario = funcionarios[this.topEmployees.length];
        if (funcionario && !this.topEmployees.find(emp => emp.name === funcionario.nome)) {
          this.topEmployees.push({
            name: funcionario.nome,
            position: funcionario.funcao,
            image: '/img/default-employee.jpg'
          });
        }
      }
    },
    
    processLocationOccurrences(ocorrencias) {
      // Contar ocorrências por localização
      const locationCount = {};
      
      ocorrencias.forEach(ocorrencia => {
        const loc = ocorrencia.localizacao;
        locationCount[loc] = (locationCount[loc] || 0) + 1;
      });
      
      this.occurrenceData.labels = Object.keys(locationCount);
      this.occurrenceData.values = Object.values(locationCount);
      
      // Se não houver dados, usar dados padrão
      if (this.occurrenceData.labels.length === 0) {
        this.occurrenceData.labels = ['Piso 1, sala 1', 'Piso 1, sala 2', 'Piso 2, sala 1'];
        this.occurrenceData.values = [0, 0, 0];
      }
    },
    
    processOccurrenceFrequency(ocorrencias) {
      // Contar por tipo de ocorrência
      const typeCount = {};
      
      ocorrencias.forEach(ocorrencia => {
        const tipo = ocorrencia.tipoOcorrencia;
        typeCount[tipo] = (typeCount[tipo] || 0) + 1;
      });
      
      this.frequencyData.labels = Object.keys(typeCount);
      this.frequencyData.values = Object.values(typeCount);
      
      // Se não houver dados, usar dados padrão
      if (this.frequencyData.labels.length === 0) {
        this.frequencyData.labels = ['Material em falta', 'Material mal alocado', 'Limpeza necessária'];
        this.frequencyData.values = [0, 0, 0];
      }
    },
    
    processHistoryData(ocorrencias) {
      // Simular dados históricos baseados nas ocorrências atuais
      // Em uma implementação real, você teria dados com timestamps
      const totalOcorrencias = ocorrencias.length;
      
      // Simular crescimento ao longo dos meses
      this.historyData.values = [
        Math.max(0, totalOcorrencias - 6),
        Math.max(0, totalOcorrencias - 5),
        Math.max(0, totalOcorrencias - 4),
        Math.max(0, totalOcorrencias - 3),
        Math.max(0, totalOcorrencias - 2),
        Math.max(0, totalOcorrencias - 1),
        totalOcorrencias
      ];
    },
    
    setDefaultData() {
      // Dados padrão caso não existam dados no localStorage
      this.topEmployees = [
        { name: 'Sem dados', position: 'N/A', image: '/img/default-employee.jpg' }
      ];
      this.occurrenceData = {
        labels: ['Sem dados'],
        values: [0]
      };
      this.frequencyData = {
        labels: ['Sem dados'],
        values: [0],
        colors: ['#79B4A9']
      };
      this.historyData.values = [0, 0, 0, 0, 0, 0, 0];
    },
    
    renderCharts() {
      // Gráfico de Feedback (mantido como estava - dados simulados)
      new Chart(this.$refs.feedbackChart, {
        type: 'bar',
        data: {
          labels: this.historyData.labels,
          datasets: [{
            label: 'Avaliação',
            data: [4, 3, 5, 4, 3, 4, 5],
            backgroundColor: '#03B5AA'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 5,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });

      // Gráfico de Ocorrências (Barras horizontais) - usando dados reais
      new Chart(this.$refs.locationChart, {
        type: 'bar',
        data: {
          labels: this.occurrenceData.labels,
          datasets: [{
            label: 'Ocorrências',
            data: this.occurrenceData.values,
            backgroundColor: '#79B4A9'
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false
        }
      });

      // Gráfico de Frequência (Doughnut) - usando dados reais
      new Chart(this.$refs.frequencyChart, {
        type: 'doughnut',
        data: {
          labels: this.frequencyData.labels,
          datasets: [{
            data: this.frequencyData.values,
            backgroundColor: this.frequencyData.colors.slice(0, this.frequencyData.labels.length)
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%'
        }
      });

      // Gráfico Histórico (Line) - usando dados processados
      new Chart(this.$refs.historyChart, {
        type: 'line',
        data: {
          labels: this.historyData.labels,
          datasets: [{
            label: 'Ocorrências',
            data: this.historyData.values,
            borderColor: '#03B5AA',
            backgroundColor: 'rgba(3, 181, 170, 0.2)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }
};
</script>

<style scoped>
.page-content {
  padding: 20px;
  width: 100%;
  margin: 0;
}

.stats-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  width: 100%;
}

.stats-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  flex: 1;
  min-width: 0; /* Permite que os elementos encolham */
}

.employees-section {
  flex: 1;
}

.feedback-section {
  flex: 2;
}

.history-section {
  width: 100%;
}

h2 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.employees-grid {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  width: 100%;
}

.employee-card {
  text-align: center;
  flex: 1;
  min-width: 0; /* Permite que os cards encolham */
}

.employee-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  background-color: #f0f0f0; /* Cor de fundo para imagens que não carregam */
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .stats-row {
    flex-direction: column;
  }
  
  .employees-grid {
    flex-direction: column;
    gap: 15px;
  }
  
  .employee-card {
    display: flex;
    align-items: center;
    gap: 15px;
    text-align: left;
  }
  
  .employee-image {
    width: 60px;
    height: 60px;
    margin-bottom: 0;
  }

  .chart-container {
    height: 250px;
  }
}

@media (min-width: 1200px) {
  .page-content {
    padding: 20px 40px;
  }
  
  .chart-container {
    height: 350px;
  }
}
</style>