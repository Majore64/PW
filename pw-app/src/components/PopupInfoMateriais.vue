<template>
  <div class="popup">
    <div class="popup-inner">
      <h2 class="popup-title">Informação Material</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-container">
          <div class="form-section">
            <h3>Nome material</h3>
            <input v-model="form.nomeMaterial" type="text" class="form-input" placeholder="Esfregona" />

            <h3>Quantidade</h3>
            <input v-model="form.quantidade" type="number" class="form-input" placeholder="10" />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-button">Guardar</button>
          <button type="button" class="cancel-button" @click="handleDelete">Eliminar</button>
        </div>
      </form>

      <button class="popup-close" @click="closePopup">
        &times;
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PopupInfoMateriais",
  props: {
    togglePopup: {
      type: Function,
      required: true
    },
    material: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        nomeMaterial: '',
        quantidade: ''
      }
    };
  },
  watch: {
    material: {
      immediate: true,
      handler(novoMaterial) {
        if (novoMaterial) {
          this.form.nomeMaterial = novoMaterial.nomeMaterial;
          this.form.quantidade = novoMaterial.quantidade;
        }
      }
    }
  },
  methods: {
    handleSubmit() {
      const materialEditado = {
          ...this.material,
          nomeMaterial: this.form.nomeMaterial,
          quantidade: parseInt(this.form.quantidade),
          quantRest: parseInt(this.form.quantidade) 
      };

      this.$emit('material-editado', materialEditado);
      this.closePopup();
    },
    handleDelete() {
      this.$emit('material-removido', this.material.id);
      this.closePopup();
    },
    closePopup() {
      if (typeof this.togglePopup === 'function') {
        this.togglePopup();
      } else {
        console.warn("togglePopup não é uma função.");
      }
    }
  }
};
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
    min-width: 700px; 
    min-height: 100px;
    max-height: 90vh;
    position: relative;
  }
  
  .popup-title {
    color: #48c9b0; /* Verde água */
    text-decoration: underline;
    text-decoration-color: #48c9b0; /* Verde água */
    margin: 0;
    padding-bottom: 16px;
    text-align: left;
    font-size: 20px;
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
    right: -16px;
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