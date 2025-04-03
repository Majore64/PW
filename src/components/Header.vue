<template>
  <section class="hero-section">
    <img src="@/assets/Pagina_inicial.png" class="hero-img" alt="Hospital" />
    <div class="hero-text">
      <h1><span class="text-white">Eyes</span><span class="text-primary">EveryWhere</span></h1>
      <p>Para quem cuida de vidas, cada detalhe importa.</p>
      <button class="btn-contact">Contacte-nos</button>
    </div>
  </section>
</template>

<script setup>
// Nenhum script necessário por agora
</script>

<style scoped>
.hero-section {
  position: relative;
  text-align: center;
  color: white;
}

.hero-img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.hero-text {
  position: absolute;
  top: 20%;
  left: 10%;
  text-align: left;
}

.text-primary {
  color: #00b8b8;
}

.btn-contact {
  background-color: white;
  color: #00b8b8;
  border: none;
  padding: 8px 16px;
  margin-top: 12px;
  cursor: pointer;
  font-weight: bold;
}
</style>
