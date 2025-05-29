<template>
  <div class="popup">
    <div class="popup-inner">
      <h2 class="popup-title">Editar Ocorrência #{{ ocorrenciaEditada.numero || ocorrenciaEditada.id }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-container">
          <div class="form-section">
            <h3>Localização</h3>
            <select 
              v-model="ocorrenciaEditada.localizacao" 
              required
              class="form-input"
            >
              <option value="" disabled>Selecione uma localização</option>
              <option 
                v-for="localizacao in tipoLocalizacoes" 
                :key="localizacao"
                :value="localizacao"
              >
                {{ localizacao }}
              </option>
            </select>
          </div>

          <div class="form-section">
            <h3>Tipo de Ocorrência</h3>
            <select 
              v-model="ocorrenciaEditada.tipo" 
              required
              class="form-input"
            >
              <option value="" disabled>Selecione um tipo</option>
              <option 
                v-for="tipo in tipoOcorrencias" 
                :key="tipo"
                :value="tipo"
              >
                {{ tipo }}
              </option>
            </select>
          </div>

          <div class="form-section">
            <h3>Funcionário Responsável</h3>
            <select 
              v-model="ocorrenciaEditada.alertaPor" 
              required
              class="form-input"
            >
              <option value="" disabled>Selecione um funcionário</option>
              <option 
                v-for="funcionario in funcionarios" 
                :key="funcionario.id"
                :value="funcionario.nome"
              >
                {{ funcionario.nome }} - {{ funcionario.funcao }}
              </option>
            </select>
          </div>

          <div class="form-section">
            <h3>Funcionário Alocado</h3>
            <select 
              v-model="funcionarioAlocadoSelecionado" 
              class="form-input"
            >
              <option value="">Nenhum</option>
              <option 
                v-for="funcionario in funcionarios" 
                :key="funcionario.id"
                :value="funcionario.nome"
              >
                {{ funcionario.nome }} - {{ funcionario.funcao }}
              </option>
            </select>
          </div>

          <div class="form-section">
            <h3>Estado</h3>
            <select 
              v-model="ocorrenciaEditada.estado" 
              required
              class="form-input"
            >
              <option value="Por validar">Por validar</option>
              <option value="Validado">Validado</option>
              <option value="Resolvido">Resolvido</option>
            </select>
          </div>

          <div class="form-section">
            <h3>Descrição</h3>
            <textarea 
              v-model="ocorrenciaEditada.descricao" 
              class="form-input"
              rows="3"
              placeholder="Descrição da ocorrência"
            ></textarea>
          </div>

          <div class="form-section" v-if="ocorrenciaEditada.materiais && ocorrenciaEditada.materiais.length > 0">
            <h3>Materiais Utilizados</h3>
            <div class="materiais-list">
              <div v-for="(material, index) in ocorrenciaEditada.materiais" :key="index" class="material-item">
                <div class="material-info">
                  <span class="material-nome">{{ material.nome }}</span>
                  <input 
                    type="number" 
                    v-model.number="material.quantidade" 
                    min="1"
                    class="material-input"
                    @input="validarQuantidade(material)"
                  />
                  <span class="material-label">unidades</span>
                </div>
                <button 
                  type="button" 
                  @click="removerMaterial(index)" 
                  class="remove-btn"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Adicionar Material</h3>
            <div class="add-material">
              <select v-model="novoMaterial.nome" class="form-input">
                <option value="">Selecione um material</option>
                <option 
                  v-for="material in materiaisDisponiveis" 
                  :key="material.id"
                  :value="material.nomeMaterial"
                >
                  {{ material.nomeMaterial }} ({{ material.quantRest }} disponíveis)
                </option>
              </select>
              <input 
                type="number" 
                v-model.number="novoMaterial.quantidade" 
                placeholder="Quantidade"
                min="1"
                class="form-input quantity-input"
              />
              <button 
                type="button" 
                @click="adicionarMaterial" 
                class="add-btn"
                :disabled="!novoMaterial.nome || !novoMaterial.quantidade"
              >
                Adicionar
              </button>
            </div>
          </div>

          <div class="form-buttons">
            <button type="submit" class="submit-btn">Atualizar</button>
            <button type="button" @click="fecharPopup" class="cancel-btn">Cancelar</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ocorrencia: {
      type: Object,
      required: true
    },
    funcionarios: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      ocorrenciaEditada: {},
      tipoOcorrencias: [],
      tipoLocalizacoes: [],
      materiaisDisponiveis: [],
      funcionarioAlocadoSelecionado: '',
      novoMaterial: {
        nome: '',
        quantidade: 1
      }
    };
  },
  mounted() {
    this.carregarDadosLocalStorage();
    this.inicializarOcorrencia();
  },
  methods: {
    inicializarOcorrencia() {
      // Copia profunda da ocorrência recebida
      this.ocorrenciaEditada = JSON.parse(JSON.stringify(this.ocorrencia));
      
      // Garantir que os materiais existem
      if (!this.ocorrenciaEditada.materiais) {
        this.ocorrenciaEditada.materiais = [];
      }

      // Definir o funcionário alocado para o select
      if (this.ocorrenciaEditada.funcionarioAlocado) {
        if (typeof this.ocorrenciaEditada.funcionarioAlocado === 'object') {
          this.funcionarioAlocadoSelecionado = this.ocorrenciaEditada.funcionarioAlocado.nome;
        } else {
          this.funcionarioAlocadoSelecionado = this.ocorrenciaEditada.funcionarioAlocado;
        }
      }

      console.log('Ocorrência inicializada:', this.ocorrenciaEditada);
    },

    carregarDadosLocalStorage() {
      try {
        // Carregar tipos de ocorrências
        const tipoOcorrenciasData = localStorage.getItem('tipoOcorrencias');
        if (tipoOcorrenciasData) {
          this.tipoOcorrencias = JSON.parse(tipoOcorrenciasData);
        }

        // Carregar tipos de localizações
        const tipoLocalizacoesData = localStorage.getItem('tipoLocalizacoes');
        if (tipoLocalizacoesData) {
          this.tipoLocalizacoes = JSON.parse(tipoLocalizacoesData);
        }

        // Carregar materiais
        const materiaisData = localStorage.getItem('materiais');
        if (materiaisData) {
          this.materiaisDisponiveis = JSON.parse(materiaisData);
        }

        console.log('Dados do localStorage carregados:', {
          tipoOcorrencias: this.tipoOcorrencias,
          tipoLocalizacoes: this.tipoLocalizacoes,
          materiais: this.materiaisDisponiveis
        });
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
      }
    },

    handleSubmit() {
      // Preparar os dados para atualização
      const ocorrenciaAtualizada = {
        ...this.ocorrenciaEditada,
        funcionarioAlocado: this.funcionarioAlocadoSelecionado
      };

      // Atualizar a ocorrência no localStorage
      this.atualizarOcorrenciaLocalStorage(ocorrenciaAtualizada);
      
      // Emitir evento com os dados atualizados
      this.$emit('atualizado', ocorrenciaAtualizada);
      
      // Fechar o popup
      this.fecharPopup();
    },

    atualizarOcorrenciaLocalStorage(ocorrenciaAtualizada) {
      try {
        const ocorrenciasData = localStorage.getItem('ocorrencias');
        if (ocorrenciasData) {
          let ocorrencias = JSON.parse(ocorrenciasData);
          const index = ocorrencias.findIndex(o => o.id === parseInt(ocorrenciaAtualizada.numero || ocorrenciaAtualizada.id));
          
          if (index !== -1) {
            // Mapear os campos de volta para a estrutura do localStorage
            ocorrencias[index] = {
              ...ocorrencias[index],
              localizacao: ocorrenciaAtualizada.localizacao,
              tipoOcorrencia: ocorrenciaAtualizada.tipo,
              nomeFuncionario: ocorrenciaAtualizada.alertaPor,
              alocadoA: this.funcionarioAlocadoSelecionado,
              validado: ocorrenciaAtualizada.estado === 'Validado' || ocorrenciaAtualizada.estado === 'Resolvido',
              resolvido: ocorrenciaAtualizada.estado === 'Resolvido',
              descricao: ocorrenciaAtualizada.descricao,
              materiais: ocorrenciaAtualizada.materiais || []
            };
            
            localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));
            console.log('Ocorrência atualizada no localStorage:', ocorrencias[index]);
          }
        }
      } catch (error) {
        console.error('Erro ao atualizar ocorrência no localStorage:', error);
      }
    },

    adicionarMaterial() {
      if (this.novoMaterial.nome && this.novoMaterial.quantidade) {
        // Verificar se o material já existe na lista
        const materialExistente = this.ocorrenciaEditada.materiais.find(
          m => m.nome === this.novoMaterial.nome
        );

        if (materialExistente) {
          // Se já existe, somar a quantidade
          materialExistente.quantidade += this.novoMaterial.quantidade;
        } else {
          // Se não existe, adicionar novo
          this.ocorrenciaEditada.materiais.push({
            nome: this.novoMaterial.nome,
            quantidade: this.novoMaterial.quantidade,
            quantidadeInvalida: false
          });
        }

        // Limpar o formulário de novo material
        this.novoMaterial = {
          nome: '',
          quantidade: 1
        };
      }
    },

    removerMaterial(index) {
      this.ocorrenciaEditada.materiais.splice(index, 1);
    },

    validarQuantidade(material) {
      const materialDisponivel = this.materiaisDisponiveis.find(
        m => m.nomeMaterial === material.nome
      );
      
      if (materialDisponivel) {
        material.quantidadeInvalida = material.quantidade > materialDisponivel.quantRest;
      }
    },

    fecharPopup() {
      this.$emit('fechar');
    }
  }
};
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-inner {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.popup-title {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-section {
  display: flex;
  flex-direction: column;
}

.form-section h3 {
  font-size: 1.1em;
  color: #333;
  margin-bottom: 8px;
}

.form-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  width: 100%;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

.quantity-input {
  max-width: 120px;
}

select.form-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px;
}

.submit-btn, .cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  flex: 1;
}

.submit-btn {
  background-color: #03B5AA;
  color: white;
}

.submit-btn:hover {
  background-color: #029e94;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.materiais-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 5px;
}

.material-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 4px solid #03B5AA;
}

.material-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.material-nome {
  font-weight: bold;
  color: #03B5AA;
  min-width: 100px;
}

.material-input {
  width: 80px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

.material-label {
  color: #666;
  font-size: 0.9em;
}

.remove-btn {
  background-color: #ff4757;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background-color: #ff3742;
}

.add-material {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.add-btn {
  background-color: #03B5AA;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 0.9em;
  white-space: nowrap;
}

.add-btn:hover:not(:disabled) {
  background-color: #029e94;
}

.add-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .add-material {
    flex-direction: column;
    align-items: stretch;
  }
  
  .material-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>