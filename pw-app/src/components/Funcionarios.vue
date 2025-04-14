<template>
  <div class="page-content">
    <h1>Funcionários</h1>
    <!-- Conteúdo da página aqui -->
  </div>
</template>

<script>
export default {
  name: 'FuncionariosPage',
  mounted() {
    this.$emit('update-title', 'Funcionários');
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