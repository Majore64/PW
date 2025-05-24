<template>
    <div class="popup">
      <div class="popup-inner">
        <h2 class="popup-title">Nova ocorrência</h2>
  
        <form @submit.prevent="handleSubmit">
          <div class="form-container">
            <div class="form-section">
              <h3>Nome funcionário</h3>
              <select v-model="form.nomeFuncionario" class="form-select">
                <option disabled value="">Selecione um nome</option>
                <option>Charlene Reed</option>
                <option>Diogo Alves</option>
                <option>Mariana Lopes</option>
                <option>João Ferreira</option>
              </select>
  
              <h3>Tipo de ocorrência</h3>
              <select v-model="form.tipoOcorrencia" class="form-select">
                <option disabled value="">Selecione o tipo</option>
                <option>Material em falta</option>
                <option>Material mal alocado</option>
                <option>Necessário limpeza</option>
              </select>
  
              <h3>Localização Alocada</h3>
              <select v-model="form.localizacao" class="form-select">
                <option disabled value="">Selecione o local</option>
                <option>Piso 1 - Sala 101</option>
                <option>Piso 2 - Sala 205</option>
                <option>Piso 3 - Sala 309</option>
              </select>
            </div>
  
            <div class="form-section">
              <h3>Número funcionário</h3>
              <input v-model="form.numeroFuncionario" type="text" class="form-input" placeholder="139284321" />
  
              <h3>Data</h3>
              <input v-model="form.data" type="text" class="form-input" placeholder="24/07/2024" />
            </div>
          </div>

          <div class="materiais-container">
            <h3>Materiais necessários</h3>
            <div
              v-for="(material, index) in form.materiais"
              :key="index"
              class="materiais-row"
            >
              <select
                v-model="material.nome"
                class="form-select"
                @change="handleMaterialChange(index)"
              >
                <option disabled value="">Selecione o material</option>
                <option>Esfregona</option>
                <option>Lixívia</option>
                <option>Vassoura</option>
                <option>Luvas</option>
              </select>

              <input
                v-model="material.quantidade"
                type="number"
                min="1"
                class="form-input quantidade-input"
                placeholder="Qtd."
              />

              <button
                type="button"
                class="remove-button"
                @click="removerMaterial(index)"
                :style="{ visibility: material.nome ? 'visible' : 'hidden' }"
                title="Remover material"
              >
                &times;
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-button">Criar</button>
            <button type="button" class="cancel-button" @click="TogglePopup()">Cancelar</button>
          </div>
        </form>
  
        <button class="popup-close" @click="TogglePopup()">
          &times;
        </button>
      </div>
    </div>
  </template>
  
  
  <script>
export default {
  name: "PopupModal",
  props: ['TogglePopup'],
  data() {
    return {
      form: {
        nomeFuncionario: '',
        tipoOcorrencia: '',
        localizacao: '',
        numeroFuncionario: '',
        data: '',
        materiais: [
          { nome: '', quantidade: '' }
        ]
      }
    }
  },
  methods: {
    handleSubmit() {
      // Buscar ocorrências existentes no localStorage (ou criar lista vazia)
      const ocorrenciasExistentes = JSON.parse(localStorage.getItem('ocorrencias')) || [];

      // Gerar um novo ID sequencial
      const novoId = ocorrenciasExistentes.length > 0
        ? ocorrenciasExistentes[ocorrenciasExistentes.length - 1].id + 1
        : 1;

      // Filtra materiais válidos antes de guardar
      const materiaisValidos = this.form.materiais.filter(m => m.nome && m.quantidade);

      // Criar nova ocorrência com campos adicionais
      const novaOcorrencia = {
        id: novoId,
        ...this.form,
        materiais: materiaisValidos,
        alocadoA: "-",
        validado: false,
        resolvido: false
      };

      // Adicionar nova ocorrência
      ocorrenciasExistentes.push(novaOcorrencia);

      // Guardar novamente no localStorage
      localStorage.setItem('ocorrencias', JSON.stringify(ocorrenciasExistentes));

      // Emitir evento para o componente pai atualizar a tabela
      this.$emit('ocorrencia-criada');

      // Fechar popup
      this.TogglePopup();
    },

    handleMaterialChange(index) {
      const isLast = index === this.form.materiais.length - 1;
      const current = this.form.materiais[index];

      if (isLast && current.nome) {
        this.form.materiais.push({ nome: '', quantidade: '' });
      }
    },

    removerMaterial(index) {
      this.form.materiais.splice(index, 1);
    }
  }
}
</script>

  
  <style lang="scss" scoped>
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-color: rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .popup-inner {
  background-color: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  min-width: 1000px;
  height: auto; /* Ajuste para a altura automática */
  max-height: 90vh; /* Limita a altura máxima */
  display: flex;
  flex-direction: column; /* Faz a disposição do conteúdo em coluna */
  justify-content: space-between; /* Distribui espaço entre o conteúdo e os botões */
  }
  
  .popup-title {
    color: #48c9b0; /* Verde água */
    text-decoration: underline;
    text-decoration-color: #48c9b0; /* Verde água */
    margin: 0;
    padding-bottom: 16px;
    text-align: left;
    font-size: 24px;
  }
  
  .form-container {
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
  padding-bottom: 20px; 
  border-bottom: 1px solid black;
}
  
  .form-section {
    flex: 1;
  }
  
  h3 {
    color: #555;
    font-size: 16px;
    margin-bottom: 8px;
    margin-top: 20px;
  }
  
  .form-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
    background: white;
    box-sizing: border-box;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #48c9b0;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 30px;
  }
  
  button {
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s;
    border: none;
    min-width: 120px; /* largura igual para ambos os botões */
    text-align: center;
  }
  
  .cancel-button {
    background: #304D6D; /* Azul */
    color: white;
  }
  
  .cancel-button:hover {
    background: #22374e; /* Azul mais escuro */
  }
  
  .submit-button {
    background: #48c9b0; /* Verde água */
    color: white;
  }
  
  .submit-button:hover {
    background: #3aa692; /* Verde água mais escuro */
  }
  
  .popup-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 24px;
    color: #777;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .popup-close:hover {
    color: #333;
  }

  .materiais-container {
  margin-top: 30px;
  padding-bottom: 20px;
}

.materiais-row {
  display: flex;
  gap: 12px;
  margin-top: 10px;
   align-items: center;
}

.quantidade-input {
  max-width: 100px;
}

.remove-button {
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #304D6D;
  padding: 0;
  flex: 0 0 16px;  
  height: 20px;
  line-height: 20px;
  text-align: center;
  user-select: none;
  transition: color 0.2s;
  align-self: center;
  min-width: 16px; 
}


.remove-button:hover {
  color: #22374e;
}

  
</style>