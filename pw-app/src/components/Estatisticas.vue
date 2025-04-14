<template>
    <div class="page-content">
      <h1>Estatísticas</h1>
      <!-- Conteúdo da página aqui -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'EstatisticasPage',
    mounted() {
      this.$emit('update-title', 'Estatísticas');
    }
  }
  </script>
  
  <style scoped>
  .page-content {
    text-align: left;
    max-width: 1200px;
    margin: 0;
    padding: 20px;
  }
  </style>