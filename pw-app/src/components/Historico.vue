<template>
    <div class="page-content">
      <h1>Histórico</h1>
      <!-- Conteúdo da página aqui -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'HistoricoPage',
    mounted() {
      this.$emit('update-title', 'Histórico');
    }
  }
  </script>
  
  <style >
  .page-content {
    text-align: left;
    width: 100%;
    margin: 0;
    padding: 20px;
  }
  </style>