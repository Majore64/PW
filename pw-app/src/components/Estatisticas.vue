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
      topEmployees: [
        { name: 'Lívia Bator', position: 'Enfermeira', image: '/img/employee1.jpg' },
        { name: 'Randy Press', position: 'Funcionário de Limpeza', image: '/img/employee2.jpg' },
        { name: 'Workman', position: 'Enfermeiro', image: '/img/employee3.jpg' }
      ],
      occurrenceData: {
        labels: ['Sala 1', 'Sala 2', 'Sala 3', 'Sala 4', 'Sala 5'],
        values: [15, 12, 8, 10, 7]
      },
      frequencyData: {
        labels: ['Material em falta', 'Material mal alocado', 'Limpeza necessária'],
        values: [25, 65, 35],
        colors: ['#79B4A9', '#304D6D', '#03B5AA']
      },
      historyData: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
        values: [20, 25, 30, 28, 35, 40, 45]
      }
    };
  },
  mounted() {
    this.$emit('update-title', 'Estatísticas');
    this.$nextTick(() => {
      this.renderCharts();
    });
  },
  methods: {
    renderCharts() {
      // Gráfico de Feedback (Barras verticais)
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

      // Gráfico de Ocorrências (Barras horizontais)
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

      // Gráfico de Frequência (Doughnut)
      new Chart(this.$refs.frequencyChart, {
        type: 'doughnut',
        data: {
          labels: this.frequencyData.labels,
          datasets: [{
            data: this.frequencyData.values,
            backgroundColor: this.frequencyData.colors
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%'
        }
      });

      // Gráfico Histórico (Line)
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