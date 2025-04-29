<template>
  <div class="popup">
    <div class="popup-inner">
      <h2 class="popup-title">Novo Funcionário</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-container">
          <div class="form-section">
            <h3>Nome</h3>
            <input 
              type="text" 
              v-model="novoFuncionario.nome" 
              placeholder="Digite o nome do funcionário" 
              required
              class="form-input"
            />
          </div>

          <div class="form-section">
            <h3>Número de Funcionário</h3>
            <input 
              type="text" 
              v-model="novoFuncionario.numero" 
              placeholder="Digite o número do funcionário" 
              required
              class="form-input"
            />
          </div>

          <div class="form-section">
            <h3>Função</h3>
            <input 
              type="text" 
              v-model="novoFuncionario.funcao" 
              placeholder="Digite a função do funcionário" 
              required
              class="form-input"
            />
          </div>

          <div class="form-section">
            <h3>Área Alocada</h3>
            <input 
              type="text" 
              v-model="novoFuncionario.area" 
              placeholder="Digite a área alocada" 
              required
              class="form-input"
            />
          </div>

          <div class="form-buttons">
            <button type="submit" class="submit-btn">Salvar</button>
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
    funcionario: Object
  },
  data() {
    return {
      novoFuncionario: this.funcionario || {
        nome: '',
        numero: '',
        funcao: '',
        area: ''
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$emit('guardar', this.novoFuncionario);
      this.fecharPopup();
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
}

.popup-inner {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
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
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.submit-btn, .cancel-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
}

.submit-btn {
  background-color: #03B5AA;
  color: white;
}

.submit-btn:hover {
  opacity: 0.9;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  opacity: 0.8;
}
</style>
