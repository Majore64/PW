<template>
    <div class="page-content">
      <h1>Ocorrências</h1>
      <!-- Conteúdo da página aqui -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'OcorrenciasPage',
    mounted() {
      this.$emit('update-title', 'Ocorrencias');
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