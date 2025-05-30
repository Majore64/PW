<template>
  <div class="page-content">

    <!-- 1ª Linha: Funcionários + Feedback -->
    <div class="stats-row first-row">
      <!-- Funcionários -->
      <div class="stats-section employees-section">
        <h2>Funcionários que mais contribuíram</h2>
        <div class="employees-ranking">
          <div v-for="(employee, index) in topEmployees" :key="index" class="employee-rank">
            <div class="rank-number">{{ index + 1 }}º</div>
            <div class="employee-info">
              <h3>{{ employee.name }}</h3>
              <p>{{ employee.position }}</p>
              <span class="contribution-count">{{ employee.count }} alocações</span>
            </div>
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
        labels: [],
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
        const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');
        
        // Carregar ocorrências
        const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias') || '[]');
        
        // Processar funcionários que mais contribuíram (baseado em ocorrências reportadas)
        this.processTopEmployees(funcionarios, ocorrencias);
        
        // Processar ocorrências por localização
        this.processLocationOccurrences(ocorrencias);
        
        // Processar frequência por tipo de ocorrência
        this.processOccurrenceFrequency(ocorrencias);
        
        // Processar histórico baseado nas datas reais das ocorrências
        this.processHistoryData(ocorrencias);
        
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
        this.setDefaultData();
      }
    },
    
    processTopEmployees(funcionarios, ocorrencias) {
      // Contar alocações por funcionário (quem foi mais alocado)
      const funcionarioCount = {};
      
      console.log('Funcionários disponíveis:', funcionarios);
      console.log('Ocorrências:', ocorrencias);
      
      ocorrencias.forEach(ocorrencia => {
        const nomeAlocado = ocorrencia.alocadoA;
        if (nomeAlocado) {
          funcionarioCount[nomeAlocado] = (funcionarioCount[nomeAlocado] || 0) + 1;
        }
      });
      
      console.log('Contagem de alocações:', funcionarioCount);
      
      // Ordenar funcionários por número de vezes que foram alocados
      const topFuncionarios = Object.entries(funcionarioCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);
      
      this.topEmployees = topFuncionarios.map(([nome, count]) => {
        const funcionario = funcionarios.find(f => f.nome === nome);
        console.log(`Procurando funcionário: ${nome}`, funcionario);
        return {
          name: nome,
          position: funcionario ? funcionario.funcao : 'Função não encontrada',
          count: count
        };
      });
      
      console.log('Top employees processados:', this.topEmployees);
      
      // Se não houver alocações suficientes, preencher com funcionários padrão
      while (this.topEmployees.length < 3 && funcionarios.length > this.topEmployees.length) {
        const funcionario = funcionarios[this.topEmployees.length];
        if (funcionario && !this.topEmployees.find(emp => emp.name === funcionario.nome)) {
          this.topEmployees.push({
            name: funcionario.nome,
            position: funcionario.funcao,
            count: 0
          });
        }
      }
      
      console.log('Top employees final:', this.topEmployees);
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
      // Processar dados históricos baseados nas datas reais das ocorrências
      const monthCount = {};
      const currentYear = new Date().getFullYear();
      
      console.log('Processando ocorrências para histórico:', ocorrencias);
      
      // Processar cada ocorrência para extrair mês/ano da data
      ocorrencias.forEach(ocorrencia => {
        if (ocorrencia.data) {
          try {
            // Assumindo que a data está no formato DD/MM/YYYY
            const dateParts = ocorrencia.data.split('/');
            let month, year;
            
            if (dateParts.length === 3) {
              // Formato DD/MM/YYYY
              month = parseInt(dateParts[1]);
              year = parseInt(dateParts[2]);
              
              console.log(`Data processada: ${ocorrencia.data} -> Mês: ${month}, Ano: ${year}`);
              
              // Só considerar ocorrências do ano atual
              if (year === currentYear && month >= 1 && month <= 12) {
                const monthKey = month;
                monthCount[monthKey] = (monthCount[monthKey] || 0) + 1;
                console.log(`Contando para mês ${month}: ${monthCount[monthKey]}`);
              }
            }
          } catch (error) {
            console.error('Erro ao processar data:', ocorrencia.data, error);
          }
        }
      });
      
      console.log('Contagem final por mês:', monthCount);
      
      // Criar labels e valores para os meses
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const currentMonth = new Date().getMonth() + 1;
      
      // Mostrar desde janeiro até o mês atual
      this.historyData.labels = monthNames.slice(0, currentMonth);
      this.historyData.values = [];
      
      for (let i = 1; i <= currentMonth; i++) {
        this.historyData.values.push(monthCount[i] || 0);
      }
      
      console.log('Labels finais:', this.historyData.labels);
      console.log('Valores finais:', this.historyData.values);
      
      // Se não houver dados válidos, mostrar pelo menos os meses até agora
      if (this.historyData.values.length === 0) {
        this.historyData.labels = monthNames.slice(0, Math.max(currentMonth, 5));
        this.historyData.values = new Array(this.historyData.labels.length).fill(0);
      }
    },
    
    setDefaultData() {
      // Dados padrão caso não existam dados no localStorage
      this.topEmployees = [
        { name: 'Sem dados', position: 'N/A', count: 0 }
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
      this.historyData = {
        labels: ['Sem dados'],
        values: [0]
      };
    },
    
    renderCharts() {
      // Gráfico de Feedback (mantido como estava - dados simulados)
      new Chart(this.$refs.feedbackChart, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
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

      // Gráfico Histórico (Line) - usando dados processados das datas reais
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
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
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

.employees-ranking {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.employee-rank {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #f9f9f9;
}

.rank-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #03B5AA;
  min-width: 35px;
  text-align: center;
}

.employee-info {
  flex: 1;
}

.employee-info h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.employee-info p {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.contribution-count {
  font-size: 0.8rem;
  color: #03B5AA;
  font-weight: 500;
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
  
  .employee-rank {
    padding: 8px;
    gap: 10px;
  }
  
  .rank-number {
    font-size: 1.2rem;
    min-width: 30px;
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