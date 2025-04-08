<template>
  <div>
    <!-- Header -->
    

    <!-- Hero image com texto -->
    <section class="hero-section">
      <img src="@/assets/Pagina_inicial.png" class="hero-img" alt="Hospital" />
      <div class="hero-text">
        <h1><span class="text-white">Eyes</span><span class="text-primary">EveryWhere</span></h1>
        <p>Para quem cuida de vidas, cada detalhe importa.</p>
      </div>
    </section>

    <!-- Indicadores -->
    <section class="stats">
      <div class="stat"><strong>+100</strong><br />Profissionais</div>
      <div class="stat"><strong>9.8/10</strong><br />Satisfação</div>
      <div class="stat"><strong>20min</strong><br />Tempo de Resposta</div>
      <div class="stat"><strong>+50</strong><br />Ocorrências Resolvidas</div>
    </section>

    <!-- Sobre Nós -->
    <section class="about-section">
  <div class="about-content">
    <div class="text-content">
      <h2 class="section-title">
        <span class="underline">Quem Somos</span>
      </h2>
      <p class="about-text">
        A EyesEverywhere é uma plataforma dedicada ao registo e monitorização de ocorrências em ambientes clínicos e hospitalares, garantindo que problemas como falta de material médico, equipamento avariado e áreas com higiene inadequada sejam rapidamente reportados e solucionados.
        <br /><br />
        O nosso objetivo é garantir a segurança, organização e qualidade dos espaços de saúde através da participação ativa de profissionais e cidadãos. Com um sistema intuitivo e acessível, qualquer profissional pode registar uma ocorrência, anexar imagens e descrever a situação detalhadamente.
        <br /><br />
        Esta abordagem facilita a comunicação entre equipas e melhora a qualidade dos serviços de saúde.
      </p>
    </div>
    <img src="@/assets/Sobrenos.png" alt="Profissionais de Saúde" class="about-image" />
  </div>
</section>

    <!-- Ocorrências -->
    <section class="ocorrencias">
      <h2>Ocorrências</h2>
      <div class="ocorrencias-grid">
        <div class="card">
          <h3>Criar Ocorrência</h3>
          <p>Permite reportar situações como equipamentos danificados ou locais sujos.</p>
        </div>
        <div class="card">
          <h3>Histórico de Ocorrências</h3>
          <p>Consulta todas as ocorrências já registadas, o estado e resolução.</p>
        </div>
        <div class="card">
          <h3>Finalizar Ocorrência</h3>
          <p>Finaliza ocorrências que já foram resolvidas.</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2025 <strong>EyesEverywhere</strong></p>
    </footer>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
</script>

<style scoped>
.about-section {
  padding: 40px 20px;
  background-color: #ffffff;
  color: #121212;
}

.about-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 30px;
  max-width: 1100px;
  margin: 0 auto;
}

.text-content {
  flex: 1 1 55%;
}

.section-title {
  font-size: 32px;
  font-weight: bold;
  color: #2c2c2c;
  margin-bottom: 20px;
}

.underline {
  border-bottom: 5px solid #00b8b8;
  padding-bottom: 4px;
}

.about-text {
  font-size: 14px;
  line-height: 1.6;
}

.about-image {
  flex: 1 1 40%;
  max-width: 100%;
  border-radius: 12px;
  object-fit: cover;
}
.hero-section {
  position: relative;
  text-align: center;
  color: white;
  margin: 0;
  padding: 0;
}

.hero-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block; /* Garante que não há espaço extra abaixo da imagem */
  margin: 0;
  padding: 0;
  border: none;
}

.stats {
  margin-top: 0; /* Elimina espaço entre a imagem e a secção */
}

.hero-text {
  position: absolute;
  top: 25%;
  left: 8%;
  text-align: left;
}

.text-primary {
  color: #00b8b8;
}

.text-white {
  color: white;
}

.stats {
  display: flex;
  justify-content: space-around;
  background-color: #9bd0c4;
  padding: 20px;
  text-align: center;
  flex-wrap: wrap;
}
.stat {
  font-size: 14px;
  min-width: 120px;
  margin: 10px 0;
}
.about {
  padding: 20px;
}
.ocorrencias {
  padding: 20px;
}
.ocorrencias-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.card {
  flex: 1 1 250px;
  background-color: #ffe2c4;
  padding: 16px;
  border-radius: 8px;
}
.footer {
  background-color: #3a5f7f;
  color: white;
  padding: 12px;
  text-align: center;
  margin-top: 32px;
}
</style>