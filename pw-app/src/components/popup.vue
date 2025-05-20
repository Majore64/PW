<template>
    <div class="popup">
      <div class="popup-inner">
        <h2 class="popup-title">Nova ocorrência</h2>
  
        <form @submit.prevent="handleSubmit">
          <div class="form-container">
            <div class="form-section">
              <h3>Nome funcionário</h3>
              <input v-model="form.nomeFuncionario" type="text" class="form-input" placeholder="Charlene Reed" />
  
              <h3>Tipo de ocorrência</h3>
              <input v-model="form.tipoOcorrencia" type="text" class="form-input" placeholder="Limpeza" />
  
              <h3>Localização Alocada</h3>
              <input v-model="form.localizacao" type="text" class="form-input" placeholder="Piso X, sala Y" />
            </div>
  
            <div class="form-section">
              <h3>Número funcionário</h3>
              <input v-model="form.numeroFuncionario" type="text" class="form-input" placeholder="139284321" />
  
              <h3>Data</h3>
              <input v-model="form.data" type="text" class="form-input" placeholder="24/07/2024" />
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
      }
    }
  },
  methods: {
    handleSubmit() {
      // Buscar ocorrências existentes no localStorage (ou criar lista vazia)
      const ocorrenciasExistentes = JSON.parse(localStorage.getItem('ocorrencias')) || [];

      // Adicionar nova ocorrência
      ocorrenciasExistentes.push({ ...this.form });

      // Guardar novamente no localStorage
      localStorage.setItem('ocorrencias', JSON.stringify(ocorrenciasExistentes));

      // Emitir evento para o componente pai atualizar a tabela
      this.$emit('ocorrencia-criada');

      // Fechar popup
      this.TogglePopup();
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
  </style>