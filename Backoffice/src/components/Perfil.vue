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
      <div class="perfil-content" v-if="abaAtiva === 'perfil' && funcionario">
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

        <div v-if="ocorrenciasFuncionario.length === 0" class="no-ocorrencias">
          <p>Nenhuma ocorrência encontrada para este funcionário.</p>
        </div>
  
        <div class="ocorrencias-table" v-else>
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Localização</th>
                <th>Data</th>
                <th>Tipo de ocorrência</th>
                <th>Status</th>
                <th>Materiais</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ocorrencia in ocorrenciasPaginadas" :key="ocorrencia.id">
                <td>{{ ocorrencia.id }}</td>
                <td>{{ ocorrencia.localizacao }}</td>
                <td>{{ ocorrencia.data }}</td>
                <td>{{ ocorrencia.tipoOcorrencia }}</td>
                <td :class="getStatusClass(ocorrencia)">
                  {{ getStatusText(ocorrencia) }}
                </td>
                <td>
                  <span v-if="ocorrencia.materiais && ocorrencia.materiais.length > 0">
                    {{ ocorrencia.materiais.map(m => `${m.nome} (${m.quantidade})`).join(', ') }}
                  </span>
                  <span v-else>-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div class="pagination" v-if="totalPaginas > 1">
          <button @click="paginaAtual > 1 && (paginaAtual--)" :disabled="paginaAtual === 1">
            &lt; Previous
          </button>
          <button 
            v-for="n in totalPaginas" 
            :key="n" 
            :class="{ active: n === paginaAtual }"
            @click="paginaAtual = n"
          >
            {{ n }}
          </button>
          <button @click="paginaAtual < totalPaginas && (paginaAtual++)" :disabled="paginaAtual === totalPaginas">
            Next &gt;
          </button>
        </div>
      </div>
  
      <!-- Rodapé condicional -->
      <div class="perfil-footer" v-if="abaAtiva === 'perfil' && funcionario">
        <button class="edit-btn" @click="editarPerfil">
          <span class="material-icons">edit</span>
          Editar
        </button>
        <button class="delete-btn" @click="eliminarPerfil">
          <span class="material-icons">delete</span>
          Eliminar
        </button>
      </div>
  


      <PerfilPopup 
        v-if="mostrarPopupEdicao"
        :funcionario="funcionario"
        @fechar="mostrarPopupEdicao = false"
        @atualizado="atualizarFuncionario"
      />

    </div>
</template>
  
<script>
  import PerfilPopup from './PerfilPopup.vue';
  export default {
    name: 'FuncionarioPerfil',
    components: {
      PerfilPopup
    },
    data() {
      return {
        abaAtiva: 'perfil',
        funcionario: null, 
        mostrarPopupEdicao: false,
        ocorrenciasFuncionario: [],
        paginaAtual: 1,
        itensPorPagina: 5
      };
    },
    computed: {
      contagemOcorrencias() {
        return {
          pendentes: this.ocorrenciasFuncionario.filter(o => !o.resolvido).length,
          resolvidas: this.ocorrenciasFuncionario.filter(o => o.resolvido).length
        };
      },
      totalPaginas() {
        return Math.ceil(this.ocorrenciasFuncionario.length / this.itensPorPagina);
      },
      ocorrenciasPaginadas() {
        const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
        const fim = inicio + this.itensPorPagina;
        return this.ocorrenciasFuncionario.slice(inicio, fim);
      }
    },
    created() {
      this.carregarDados();
    },
    methods: {
      carregarDados() {
        this.carregarFuncionario();
        this.carregarOcorrencias();
      },
      carregarFuncionario() {
        // Obter o ID do parâmetro da rota
        const funcionarioId = parseInt(this.$route.params.id);
        
        // Obter a lista de funcionários do localStorage
        const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
        
        // Encontrar o funcionário com o ID correspondente
        this.funcionario = funcionarios.find(f => f.id === funcionarioId);
        
        if (!this.funcionario) {
          console.error('Funcionário não encontrado');
          // Redirecionar para a lista de funcionários
          this.$router.push({ name: 'Funcionarios' });
        }
      },
      carregarOcorrencias() {
        if (!this.funcionario) return;
        
        // Obter as ocorrências do localStorage
        const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];
        
        // Filtrar ocorrências onde o funcionário é mencionado
        // Pode ser por nome ou por ID do funcionário
        this.ocorrenciasFuncionario = ocorrencias.filter(ocorrencia => {
          return ocorrencia.nomeFuncionario === this.funcionario.nome || 
                 ocorrencia.numeroFuncionario === this.funcionario.id;
        });
        
        // Ordenar por data (mais recente primeiro)
        this.ocorrenciasFuncionario.sort((a, b) => {
          const dataA = this.parseData(a.data);
          const dataB = this.parseData(b.data);
          return dataB - dataA;
        });
      },
      parseData(dataString) {
        // Assumindo formato DD/MM/YYYY
        const [dia, mes, ano] = dataString.split('/');
        return new Date(ano, mes - 1, dia);
      },
      getStatusClass(ocorrencia) {
        if (ocorrencia.resolvido) {
          return 'resolvido';
        } else if (ocorrencia.validado) {
          return 'validado';
        } else {
          return 'pendente';
        }
      },
      getStatusText(ocorrencia) {
        if (ocorrencia.resolvido) {
          return 'Resolvido';
        } else if (ocorrencia.validado) {
          return 'Validado';
        } else {
          return 'Pendente';
        }
      },
      atualizarFuncionario(funcionarioAtualizado) {
        this.funcionario = {...funcionarioAtualizado};
        this.mostrarPopupEdicao = false;
        // Recarregar ocorrências caso o nome tenha mudado
        this.carregarOcorrencias();
      },
      editarPerfil() {
        this.mostrarPopupEdicao = true;
      },
      eliminarPerfil() {
        if (confirm(`Tem certeza que deseja eliminar ${this.funcionario.nome}?`)) {
          // Obter a lista atual de funcionários
          const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
          
          // Filtrar para remover o funcionário atual
          const novaLista = funcionarios.filter(f => f.id !== this.funcionario.id);
          
          // Atualizar o localStorage
          localStorage.setItem('funcionarios', JSON.stringify(novaLista));
          
          // Redirecionar para a lista de funcionários
          this.$router.push({ name: 'Funcionarios' });
        }
      },

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

  .no-ocorrencias {
    text-align: center;
    padding: 40px;
    color: #666;
    font-style: italic;
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
    font-weight: bold;
  }
  
  .ocorrencias-table td.validado {
    color: #2196F3;
    font-weight: bold;
  }
  
  .ocorrencias-table td.pendente {
    color: #FF9800;
    font-weight: bold;
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

  .pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  

  
  .material-icons {
    font-size: 18px;
  }
</style>