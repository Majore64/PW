<template>
    <div class="perfil-container">
      <div class="perfil-header">
        <button @click="$router.back()" class="back-btn">
          <span class="material-icons">arrow_back</span>
        </button>
        <h2>Perfil</h2>
      </div>
  
      <!-- Abas de navegação -->
      <div class="perfil-tabs">
        <button 
          :class="{ active: abaAtiva === 'perfil' }"
          @click="abaAtiva = 'perfil'"
        >
          Perfil
        </button>
        <button 
          :class="{ active: abaAtiva === 'ocorrencias' }"
          @click="abaAtiva = 'ocorrencias'"
        >
          Ocorrências Associadas
        </button>
      </div>
  
      <!-- Conteúdo do Perfil -->
      <div class="perfil-content" v-if="abaAtiva === 'perfil'">
        <div class="info-section">
          <div class="info-grid">
            <div class="info-item">
              <label>Nome</label>
              <p>{{ funcionario.nome }}</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p>{{ funcionario.email || 'N/A' }}</p>
            </div>
            <div class="info-item">
              <label>Localização Alocada</label>
              <p>{{ funcionario.area }}</p>
            </div>
            <div class="info-item">
              <label>Número Funcionário</label>
              <p>{{ funcionario.numero }}</p>
            </div>
            <div class="info-item">
              <label>Função</label>
              <p>{{ funcionario.funcao }}</p>
            </div>
            <div class="info-item">
              <label>Contacto</label>
              <p>{{ funcionario.contacto || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Conteúdo das Ocorrências -->
      <div class="ocorrencias-content" v-if="abaAtiva === 'ocorrencias'">
        <div class="ocorrencias-stats">
          <div class="stat-card">
            <h4>Pendentes</h4>
            <p>{{ contagemOcorrencias.pendentes }}</p>
          </div>
          <div class="stat-card">
            <h4>Resolvidas</h4>
            <p>{{ contagemOcorrencias.resolvidas }}</p>
          </div>
        </div>
  
        <div class="ocorrencias-table">
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Localização</th>
                <th>Alerta dado por</th>
                <th>Data</th>
                <th>Tipo de ocorrência</th>
                <th>Validação</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ocorrencia, index) in ocorrencias" :key="index">
                <td>{{ ocorrencia.numero }}.</td>
                <td>{{ ocorrencia.localizacao }}</td>
                <td>{{ ocorrencia.alertaPor }}</td>
                <td>{{ ocorrencia.data }}</td>
                <td>{{ ocorrencia.tipo }}</td>
                <td :class="ocorrencia.validacao.toLowerCase()">({{ ocorrencia.validacao }})</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div class="pagination">
          <button>&lt; Previous</button>
          <button v-for="n in 4" :key="n" :class="{ active: n === 1 }">{{ n }}</button>
          <button>Next &gt;</button>
        </div>
      </div>
  
      <!-- Rodapé condicional -->
      <div class="perfil-footer" v-if="abaAtiva === 'perfil'">
        <button class="edit-btn" @click="editarPerfil">
          <span class="material-icons">edit</span>
          Editar
        </button>
        <button class="delete-btn" @click="eliminarPerfil">
          <span class="material-icons">delete</span>
          Eliminar
        </button>
      </div>
  
      <div class="perfil-footer" v-if="abaAtiva === 'ocorrencias'">
        <button class="desassociar-btn">Desassociar</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FuncionarioPerfil',
    data() {
      return {
        abaAtiva: 'perfil', // 'perfil' ou 'ocorrencias'
        funcionario: {
          id: 4,
          numero: '139284321',
          nome: 'Charlene Reed',
          funcao: 'Enfermeira',
          area: 'Piso 1, sala 3',
          email: 'charlenereed@gmail.com',
          contacto: '923547825'
        },
        ocorrencias: [
          {
            numero: '01',
            localizacao: 'Piso 1, sala 3',
            alertaPor: 'João Ribeiro',
            data: '17/03/2025',
            tipo: 'Material danificado',
            validacao: 'Resolvido'
          },
          {
            numero: '076',
            localizacao: 'Piso 1, sala 3',
            alertaPor: 'Francisca Ribeiro',
            data: '36 Months',
            tipo: 'Falta de material',
            validacao: 'Resolvido'
          },
          {
            numero: '089',
            localizacao: 'Piso 1, sala 3',
            alertaPor: 'João Silva',
            data: '25 Months',
            tipo: 'Material mal alocado',
            validacao: 'Resolvido'
          },
          {
            numero: '0143',
            localizacao: 'Piso 1, sala 3',
            alertaPor: 'Joana Coelho',
            data: '12 Months',
            tipo: 'Falta de material',
            validacao: 'Resolvido'
          },
          {
            numero: '0243',
            localizacao: 'Piso 1, sala 3',
            alertaPor: 'João Ribeiro',
            data: '5 Months',
            tipo: 'Falta de material',
            validacao: 'Pendente'
          },
          {
            numero: '0457',
            localizacao: 'Piso 1, sala 3',
            alertaPor: 'José Monteiro',
            data: '1 Month',
            tipo: 'Limpeza',
            validacao: 'Pendente'
          }
        ]
      };
    },
    computed: {
      contagemOcorrencias() {
        return {
          pendentes: this.ocorrencias.filter(o => o.validacao.toLowerCase() === 'pendente').length,
          resolvidas: this.ocorrencias.filter(o => o.validacao.toLowerCase() === 'resolvido').length
        };
      }
    },
    methods: {
      editarPerfil() {
        this.$router.push({ name: 'EditarFuncionario', params: { id: this.funcionario.id } });
      },
      eliminarPerfil() {
        if (confirm(`Tem certeza que deseja eliminar ${this.funcionario.nome}?`)) {
          console.log('Eliminando funcionário', this.funcionario.id);
          this.$router.push({ name: 'Funcionarios' });
        }
      }
    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  
  .perfil-container {
    width: 100%;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .perfil-header {
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
  }
  
  .perfil-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
    margin-left: 15px;
  }
  
  .back-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .back-btn:hover {
    color: #03B5AA;
  }
  
  /* Estilos das abas */
  .perfil-tabs {
    display: flex;
    border-bottom: 1px solid #eee;
  }
  
  .perfil-tabs button {
    padding: 12px 20px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    color: #666;
    position: relative;
  }
  
  .perfil-tabs button.active {
    color: #03B5AA;
    font-weight: bold;
  }
  
  .perfil-tabs button.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #03B5AA;
  }
  
  /* Conteúdo */
  .perfil-content, .ocorrencias-content {
    padding: 60px;
  }
  
  .info-section {
    margin-bottom: 30px;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .info-item label {
    display: block;
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 5px;
  }
  
  .info-item p {
    margin: 0;
    padding: 8px 0;
    font-size: 1rem;
    color: #333;
    border-bottom: 1px solid #eee;
  }
  
  .ocorrencias-stats {
    display: flex;
    gap: 20px;
    margin: 20px 0;
  }
  
  .stat-card {
    flex: 1;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
  }
  
  .stat-card h4 {
    margin: 0 0 10px 0;
    font-size: 0.9rem;
    color: #666;
  }
  
  .stat-card p {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
    color: #03B5AA;
  }
  
  .ocorrencias-table {
    overflow-x: auto;
    margin-bottom: 20px;
  }
  
  .ocorrencias-table table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .ocorrencias-table th,
  .ocorrencias-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  .ocorrencias-table th {
    background-color: #f5f5f5;
    font-weight: bold;
    color: #333;
  }
  
  .ocorrencias-table td.resolvido {
    color: #4CAF50;
  }
  
  .ocorrencias-table td.pendente {
    color: #FF9800;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    gap: 5px;
    margin: 20px 0;
  }
  
  .pagination button {
    padding: 8px 12px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .pagination button.active {
    background: #03B5AA;
    color: white;
    border-color: #03B5AA;
  }
  
  .perfil-footer {
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
    border-top: 1px solid #eee;
  }
  
  .edit-btn, .delete-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .edit-btn {
    background: #304D6D;
    color: white;
  }
  
  .delete-btn {
    background: #f44336;
    color: white;
  }
  
  .desassociar-btn {
    background: none;
    color: #03B5AA;
    border: 1px solid #03B5AA;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .material-icons {
    font-size: 18px;
  }
  </style>