<template>
  <div class="popup">
    <div class="popup-inner">
      <h2 class="popup-title">{{ novoFuncionario.id ? 'Editar Funcionário' : 'Novo Funcionário' }}</h2>

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
            <select 
              v-model="novoFuncionario.funcao" 
              required
              class="form-input"
            >
              <option value="" disabled>Selecione uma função</option>
              <option v-for="(funcao, index) in funcoes" :key="index" :value="funcao">
                {{ funcao }}
              </option>
            </select>
          </div>

          <div class="form-section">
            <h3>Área Alocada</h3>
            <select 
              v-model="novoFuncionario.area" 
              required
              class="form-input"
            >
              <option value="" disabled>Selecione uma área</option>
              <option v-for="(localizacao, index) in localizacoes" :key="index" :value="localizacao">
                {{ localizacao }}
              </option>
            </select>
          </div>

          <div class="form-section">
            <h3>Email</h3>
            <input
              type="email"
              v-model="novoFuncionario.email"
              placeholder="Digite o email do funcionário"
              required
              class="form-input"
            />
          </div>

          <div class="form-section">
            <h3>Contacto</h3>
            <input
              type="tel"
              v-model="novoFuncionario.contacto"
              placeholder="Digite o contacto do funcionário"
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
      novoFuncionario: { ...this.funcionario }, // cópia segura
      localizacoes: [],
      funcoes: []
    };
  },
  created() {
    this.localizacoes = JSON.parse(localStorage.getItem('tipoLocalizacoes')) || [];
    this.funcoes = JSON.parse(localStorage.getItem('tipoFuncoes')) || [];
  },
  methods: {
    handleSubmit() {
      let funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];

      if (this.novoFuncionario.id) {
        // Editar funcionário existente
        const index = funcionarios.findIndex(f => f.id === this.novoFuncionario.id);
        if (index !== -1) {
          funcionarios.splice(index, 1, this.novoFuncionario);
        }
      } else {
        // Criar novo funcionário
        const novoId = funcionarios.length > 0
          ? Math.max(...funcionarios.map(f => f.id)) + 1
          : 1;

        this.novoFuncionario.id = novoId;
        funcionarios.push(this.novoFuncionario);
      }

      localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
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