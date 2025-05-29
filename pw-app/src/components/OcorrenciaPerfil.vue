<template>
    <div class="ocorrencia-container">
      <div class="ocorrencia-header">
        <button @click="$router.back()" class="back-btn">
          <span class="material-icons">arrow_back</span>
        </button>
        <h2>Detalhes da Ocorrência</h2>
      </div>
  
      <!-- Abas de navegação -->
      <div class="ocorrencia-tabs">
        <button 
          :class="{ active: abaAtiva === 'detalhes' }"
          @click="abaAtiva = 'detalhes'"
        >
          Detalhes
        </button>
        <button 
          :class="{ active: abaAtiva === 'alocacao' }"
          @click="abaAtiva = 'alocacao'"
        >
          Alocação
        </button>
      </div>
  
      <!-- Conteúdo dos Detalhes -->
      <div class="detalhes-content" v-if="abaAtiva === 'detalhes'">
      <div class="info-section">
        <div class="info-grid">
          <div class="info-item">
            <label>Número</label>
            <p>{{ ocorrencia.numero }}</p>
          </div>
          <div class="info-item">
            <label>Localização</label>
            <p>{{ ocorrencia.localizacao }}</p>
          </div>
          <div class="info-item">
            <label>Descrição</label>
            <p>{{ ocorrencia.descricao }}</p>
          </div>
          <div class="info-item">
            <label>Tipo de Ocorrência</label>
            <p>{{ ocorrencia.tipo }}</p>
          </div>
          <div class="info-item">
            <label>Data</label>
            <p>{{ ocorrencia.data }}</p>
          </div>
          <div class="info-item">
            <label>Funcionário que alertou</label>
            <p>{{ ocorrencia.alertaPor }}</p>
          </div>
          <div class="info-item" v-if="ocorrencia.materiais && ocorrencia.materiais.length > 0">
            <label>Materiais utilizados</label>
            <div class="materiais-grid">
              <div v-for="(material, index) in ocorrencia.materiais" :key="index" class="material-item">
                <div class="material-nome">{{ material.nome }}</div>
                <div class="material-quantidade">Quantidade: {{ material.quantidade }}</div>
              </div>
            </div>
          </div>
          <div class="info-item">
            <label>Funcionário Alocado</label>
            <div v-if="ocorrencia.estado === 'Validado' && ocorrencia.funcionarioAlocado">
              <p>{{ ocorrencia.funcionarioAlocado.nome || ocorrencia.funcionarioAlocado }}</p>
            </div>
            <select 
              v-else
              v-model="ocorrencia.funcionarioAlocado" 
              class="funcionario-select"
            >
              <option value="">Selecione um funcionário</option>
              <option 
                v-for="funcionario in funcionarios" 
                :key="funcionario.numero"
                :value="funcionario"
              >
                {{ funcionario.nome }} - {{ funcionario.funcao }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="status-section">
        <label>Estado</label>
        <select v-model="ocorrencia.estado">
          <option value="Por validar">Por validar</option>
          <option value="Pendente">Pendente</option>
          <option value="Resolvido">Resolvido</option>
        </select>
      </div>
    </div>
  
      <!-- Conteúdo da Alocação -->
      <div class="alocacao-content" v-if="abaAtiva === 'alocacao'">
        <div class="filtros-section">
          <div class="filtro-item">
            <label>Função</label>
            <select v-model="filtroFuncao">
              <option value="">Todas</option>
              <option v-for="funcao in funcoes" :value="funcao" :key="funcao">{{ funcao }}</option>
            </select>
          </div>
          <div class="filtro-item">
            <label>Área</label>
            <select v-model="filtroArea">
              <option value="">Todas</option>
              <option v-for="area in areas" :value="area" :key="area">{{ area }}</option>
            </select>
          </div>
        </div>
  
        <div class="funcionarios-table">
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Nome</th>
                <th>Função</th>
                <th>Área Alocada</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="funcionario in funcionariosFiltrados" :key="funcionario.numero">
                <td>{{ funcionario.numero }}</td>
                <td>{{ funcionario.nome }}</td>
                <td>{{ funcionario.funcao }}</td>
                <td>{{ funcionario.area }}</td>
                <td>
                  <button 
                    @click="alocarFuncionario(funcionario)"
                    :class="{ 'alocado': funcionarioAlocado && funcionarioAlocado.numero === funcionario.numero }"
                  >
                    {{ funcionarioAlocado && funcionarioAlocado.numero === funcionario.numero ? 'Alocado' : 'Alocar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <button>&lt; Previous</button>
          <button v-for="n in 4" :key="n" :class="{ active: n === 1 }">{{ n }}</button>
          <button>Next &gt;</button>
        </div>

        <div class="alocacao-campos">
        <div class="campo-item">
          <label>Localização *</label>
          <input type="text" v-model="localizacaoSelecionada" readonly>
        </div>
        
        <div class="campo-item">
          <label>Funcionário alocado *</label>
          <div class="funcionario-alocado-info" v-if="funcionarioAlocado">
            {{ funcionarioAlocado.nome }}, {{ funcionarioAlocado.numero }}
          </div>
          <select v-else v-model="funcionarioSelecionado" class="funcionario-select">
            <option value="">Selecione um funcionário</option>
            <option 
              v-for="funcionario in funcionariosFiltrados" 
              :key="funcionario.numero"
              :value="funcionario"
            >
              {{ funcionario.nome }} ({{ funcionario.numero }})
            </option>
          </select>
        </div>
        
        <div class="campo-item">
          <label>Tipo de Ocorrência *</label>
          <select v-model="tipoOcorrencia" class="tipo-select">
            <option value="Falta de material">Falta de material</option>
            <option value="Material danificado">Material danificado</option>
            <option value="Limpeza">Limpeza</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
        
        <div class="campo-item">
          <label>Estado</label>
          <select v-model="estadoOcorrencia" class="estado-select">
            <option value="Pendente">Pendente</option>
            <option value="Por validar">Por validar</option>
            <option value="Resolvido">Resolvido</option>
          </select>
        </div>
      </div>

  
        
      </div>
  
      <!-- Rodapé -->
      <div class="ocorrencia-footer">
        <div class="action-buttons">
          <button class="validar-btn" @click="validarOcorrencia" v-if="abaAtiva === 'detalhes'" :disabled="!formularioValido || ocorrencia.estado === 'Validado'">Validar</button>
          <button class="eliminar-btn" @click="eliminarOcorrencia">Eliminar</button>
          <button class="guardar-btn" @click="guardarAlocacao" v-if="abaAtiva === 'alocacao'">Guardar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DetalhesOcorrencia',
    props: ['id'],
    data() {
      return {
        abaAtiva: 'detalhes', // 'detalhes' ou 'alocacao'
        ocorrencia: {
          numero: '',
          localizacao: '',
          descricao: 'Falta material de diagnóstico médico (estetoscópio, medidor de tensão, oxímetro) na sala 3 do piso 1.',
          tipo: '',
          data: '',
          alertaPor: '',
          estado: '',
          localizacaoSelecionada: '',
          funcionarioSelecionado: null,
          tipoOcorrencia: 'Falta de material',
          estadoOcorrencia: 'Pendente',
          funcionarioAlocado: null,
        },
        funcionarios: [],
        filtroFuncao: '',
        filtroArea: ''
      };
    },

    created() {
    this.carregarOcorrencia();
    this.carregarFuncionarios();
    },
    
    computed: {
      funcionariosFiltrados() {
        return this.funcionarios.filter(funcionario => {
          const matchFuncao = !this.filtroFuncao || funcionario.funcao === this.filtroFuncao;
          const matchArea = !this.filtroArea || funcionario.area === this.filtroArea;
          return matchFuncao && matchArea;
        });
      },
      funcoes() {
        return [...new Set(this.funcionarios.map(f => f.funcao))];
      },
      areas() {
        return [...new Set(this.funcionarios.map(f => f.area))];
      },
        funcionarioAlocado() {
        return this.funcionarioSelecionado || this.ocorrencia.funcionarioAlocado;
      },

      formularioValido() {
        return this.ocorrencia.funcionarioAlocado !== null && 
              this.ocorrencia.funcionarioAlocado !== undefined &&
              this.ocorrencia.funcionarioAlocado !== '';
      }
    },
    methods: {

      carregarFuncionarios() {
        const funcionariosLS = JSON.parse(localStorage.getItem('funcionarios')) || [];
        this.funcionarios = funcionariosLS.map(func => ({
          id: func.id,
          nome: func.nome,
          numero: func.numero,
          funcao: func.funcao,
          area: func.area
        }));
      },

      carregarOcorrencia() {
        // Busca todas as ocorrências do localStorage
        const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];
        
        // Encontra a ocorrência com o ID da URL
        const ocorrenciaEncontrada = ocorrencias.find(oc => oc.id === parseInt(this.id));
        
        if (ocorrenciaEncontrada) {

          const temAlocado = ocorrenciaEncontrada.alocadoA && 
                      ocorrenciaEncontrada.alocadoA !== '-' && 
                      ocorrenciaEncontrada.alocadoA !== '';
          const estaValidado = ocorrenciaEncontrada.validado;

          // Mapeia os dados do localStorage para a estrutura do seu componente
          this.ocorrencia = {
            numero: ocorrenciaEncontrada.id,
            localizacao: ocorrenciaEncontrada.localizacao,
            descricao: this.ocorrencia.descricao, // Mantém a descrição padrão
            tipo: ocorrenciaEncontrada.tipoOcorrencia,
            data: ocorrenciaEncontrada.data,
            materiais: ocorrenciaEncontrada.materiais || [],
            alertaPor: ocorrenciaEncontrada.nomeFuncionario,
            estado: ocorrenciaEncontrada.validado ? 'Validado' : 'Por validar',
            funcionarioAlocado: temAlocado ? ocorrenciaEncontrada.alocadoA : null
          };
          
          // Se estiver validado e tiver alocado, tenta encontrar o objeto completo do funcionário
          if (temAlocado && estaValidado) {
            const funcAlocado = this.funcionarios.find(f => 
              f.nome === ocorrenciaEncontrada.alocadoA || 
              f.numero === ocorrenciaEncontrada.alocadoA
            );
            
            if (funcAlocado) {
              this.ocorrencia.funcionarioAlocado = funcAlocado;
            }
          } else if (temAlocado) {
            // Se não estiver validado mas tiver alocado, permite edição
            const funcAlocado = this.funcionarios.find(f => 
              f.nome === ocorrenciaEncontrada.alocadoA || 
              f.numero === ocorrenciaEncontrada.alocadoA
            );
            
            if (funcAlocado) {
              this.ocorrencia.funcionarioAlocado = funcAlocado;
            }
          }

          // Preenche os campos da aba de alocação
          this.localizacaoSelecionada = ocorrenciaEncontrada.localizacao;
          this.tipoOcorrencia = ocorrenciaEncontrada.tipoOcorrencia;
          this.estadoOcorrencia = ocorrenciaEncontrada.resolvido ? 'Resolvido' : 'Pendente';
          
          // Se houver funcionário alocado, tenta encontrá-lo na lista
          if (ocorrenciaEncontrada.alocadoA) {
            const funcAlocado = this.funcionarios.find(
              f => f.nome === ocorrenciaEncontrada.alocadoA
            );
            if (funcAlocado) {
              this.funcionarioSelecionado = funcAlocado;
              this.ocorrencia.funcionarioAlocado = funcAlocado;
            }
          }
        } else {
          console.error('Ocorrência não encontrada');
          // Redireciona ou mostra mensagem de erro
          this.$router.push({ name: 'Ocorrencias' });
        }
      },

      alocarFuncionario(funcionario) {
        this.funcionarioAlocado = funcionario;
      },
      validarOcorrencia() {
        // Lógica para validar a ocorrência
        console.log('Ocorrência validada:', this.ocorrencia);
      },
      eliminarOcorrencia() {
          // Remove a ocorrência do localStorage
          const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];
          const novasOcorrencias = ocorrencias.filter(oc => oc.id !== parseInt(this.id));
          localStorage.setItem('ocorrencias', JSON.stringify(novasOcorrencias));
          // Redireciona para a página de ocorrências
          this.$router.push({ name: 'Ocorrencias' });
      },
      guardarAlocacao() {
        if (!this.funcionarioAlocado) {
            alert('Por favor, selecione um funcionário para alocar');
            return;
        }
        
        // Atualiza a ocorrência com os dados selecionados
        this.ocorrencia.funcionarioAlocado = this.funcionarioAlocado;
        this.ocorrencia.tipo = this.tipoOcorrencia;
        this.ocorrencia.estado = this.estadoOcorrencia;
        
        console.log('Dados guardados:', {
            localizacao: this.localizacaoSelecionada,
            funcionario: this.funcionarioAlocado,
            tipo: this.tipoOcorrencia,
            estado: this.estadoOcorrencia
        });
      },

      async validarOcorrencia() {
        if (!this.ocorrencia.funcionarioAlocado) {
          alert('Por favor, selecione um funcionário para alocar');
          return;
        }

        try {
          // 1. Atualizar a ocorrência no localStorage
          const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];
          const ocorrenciaIndex = ocorrencias.findIndex(oc => oc.id === parseInt(this.id));
          
          if (ocorrenciaIndex !== -1) {
            // Atualiza os dados da ocorrência
            ocorrencias[ocorrenciaIndex] = {
              ...ocorrencias[ocorrenciaIndex],
              alocadoA: this.ocorrencia.funcionarioAlocado.nome,
              validado: true
            };
            
            localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));
            
            // 2. Atualizar os materiais no localStorage
            await this.atualizarStockMateriais(ocorrencias[ocorrenciaIndex].materiais);
            
            // 3. Redirecionar para a página de ocorrências
            this.$router.push({ name: 'Ocorrencias' });
          }
        } catch (error) {
          console.error('Erro ao validar ocorrência:', error);
          alert('Ocorreu um erro ao validar a ocorrência');
        }
      },
      
      async atualizarStockMateriais(materiaisOcorrencia) {
        if (!materiaisOcorrencia || materiaisOcorrencia.length === 0) return;

        // Obter os materiais atuais do localStorage
        let materiais = JSON.parse(localStorage.getItem('materiais')) || [];
        
        // Criar um mapa para acesso rápido por nome
        const materiaisMap = new Map(materiais.map(m => [m.nomeMaterial, m]));

        materiaisOcorrencia.forEach(matOcorrencia => {
          const material = materiaisMap.get(matOcorrencia.nome);
          if (material) {
            // Subtrai a quantidade utilizada da quantidade disponível
            material.quantRest -= matOcorrencia.quantidade;
            if (material.quantRest < 0) {
              material.quantRest = 0;
            }
          }
        });

        // Converter o Map de volta para array
        materiais = Array.from(materiaisMap.values());
        
        // Atualizar o localStorage
        localStorage.setItem('materiais', JSON.stringify(materiais));
      },
    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  
  .ocorrencia-container {
    width: 100%;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .ocorrencia-header {
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
  }
  
  .ocorrencia-header h2 {
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
  .ocorrencia-tabs {
    display: flex;
    border-bottom: 1px solid #eee;
  }
  
  .ocorrencia-tabs button {
    padding: 12px 20px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    color: #666;
    position: relative;
  }
  
  .ocorrencia-tabs button.active {
    color: #03B5AA;
    font-weight: bold;
  }
  
  .ocorrencia-tabs button.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #03B5AA;
  }
  
  /* Conteúdo */
  .detalhes-content, .alocacao-content {
    padding: 20px;
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

  css
.materiais-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;
}

.material-item {
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.material-nome {
  font-weight: bold;
  color:#03B5AA;
  margin-bottom: 5px;
}

.material-quantidade {
  font-size: 0.9rem;
  color: #666;
}
  
  .status-section {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
  }
  
  .status-section label {
    font-size: 0.9rem;
    color: #666;
  }
  
  .status-section select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .funcionario-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
}
  
  /* Filtros */
  .filtros-section {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .filtro-item {
    flex: 1;
  }
  
  .filtro-item label {
    display: block;
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 5px;
  }
  
  .filtro-item select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  /* Tabela */
  .funcionarios-table {
    overflow-x: auto;
    margin: 20px 0;
  }
  
  .funcionarios-table table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .funcionarios-table th,
  .funcionarios-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  .funcionarios-table th {
    background-color: #f5f5f5;
    font-weight: bold;
    color: #333;
  }
  
  .funcionarios-table button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    background-color: #03B5AA;
    color: white;
    cursor: pointer;
  }
  
  .funcionarios-table button.alocado {
    background-color: #4CAF50;
  }
  
  .funcionarios-table button:hover:not(.alocado) {
    background-color: #029e94;
  }

  .alocacao-campos {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.campo-item label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 5px;
}

.campo-item input,
.campo-item select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.funcionario-alocado-info {
  padding: 8px;
  background-color: #e8f5e9;
  border-radius: 4px;
  color: #2e7d32;
  font-weight: bold;
}

.alocacao-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 0;
}

.guardar-btn {
  padding: 8px 20px;
  background-color: #03B5AA;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.guardar-btn:hover {
  background-color: #029e94;
}
  
  /* Paginação */
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
  
  /* Rodapé */
  .ocorrencia-footer {
    display: flex;
    justify-content: flex-end;
    padding: 15px 20px;
    border-top: 1px solid #eee;
  }
  
  .action-buttons {
    display: flex;
    gap: 10px;
  }
  
  .validar-btn, .eliminar-btn, .guardar-btn {
    padding: 8px 15px;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .validar-btn, .guardar-btn {
    background: #03B5AA;
  }
  
  .eliminar-btn {
    background: #f44336;
  }
  
  .material-icons {
    font-size: 18px;
  }
  </style>