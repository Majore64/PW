<template>
  <div>
    <!-- Header -->
    <Header />
    <!-- Hero image com texto -->
    <section class="hero-section">
      <img src="@/assets/Pagina_inicial.png" class="hero-img" alt="Hospital" />
      <div class="hero-text">
        <h1><span class="text-white">Eyes</span><span class="text-primary">EveryWhere</span></h1>
        <p>Para quem cuida de vidas, cada detalhe importa.</p>
      </div>
    </section>

    <!-- Sobre Nós -->
    <section id="quem-somos" class="about-section">
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
    
    <!-- Indicadores -->
        <section class="stats">
      <div class="stat">
        <strong>+100</strong>
        <span>Profissionais</span>
      </div>
      <div class="stat">
        <strong>9.8/10</strong>
        <span>Satisfação</span>
      </div>
      <div class="stat">
        <strong>20min</strong>
        <span>Tempo de Resposta</span>
      </div>
      <div class="stat">
        <strong>+50</strong>
        <span>Ocorrências Resolvidas</span>
      </div>
    </section>
          <!-- Ocorrências -->
      <section class="ocorrencias">
        <h2 class="ocorrencias-title">Ocorrências</h2>
        <div class="ocorrencias-grid">
          <!-- Criar Ocorrência -->
          <router-link to="/tipo-ocorrencia" class="ocorrencia-card-link">
            <div class="ocorrencia-card">
              <img src="@/assets/Criar_ocorrencia.png" alt="Criar Ocorrência" class="card-image" />
              <h3 class="card-title">Criar ocorrência</h3>
              <p class="card-description">
                Permite reportar situações como equipamentos danificados, locais sujos ou materiais fora do lugar, promovendo espaços mais seguros e organizados.
              </p>
            </div>
            </router-link>

          <!-- Histórico de Ocorrências -->
          <div class="card">
              <img src="@/assets/Historico_ocorrencias.png" alt="Histórico de Ocorrências" class="card-img" />
              <h3 class="card-title">Histórico de Ocorrências</h3>
              <p class="card-text">
                Consulta todas as ocorrências já registadas, com detalhes sobre o estado, tipo de problema e local, facilitando o acompanhamento e gestão.
              </p>
    </div>
        </div>
      </section>

      <!-- Imagem do Hospital -->
      <section class="hospital-img-section">
          <img src="@/assets/Hospital.png" alt="Hospital" class="hospital-img" />
        </section>

    <!-- Onde Atuamos -->
    <section class="onde-atuamos">
      <div class="atuamos-content">
        <div class="text-content">
          <h2 class="section-title">
            <span class="underline">Onde Atuamos</span>
          </h2>
          <p>
            A EyesEveryWhere está presente de norte a sul, em hospitais e clínicas de todo o país, garantindo monitorização inteligente onde o cuidado acontece.
          </p>
        </div>
        <img src="@/assets/Portugal.png" alt="Mapa de Portugal" class="mapa-portugal" />
      </div>
    </section>
    <!-- Clientes -->
    <section class="clientes-section">
        <div class="clientes-content">
          <h2 class="titulo-clientes">“Os nossos Clientes”</h2>
          <hr class="linha-clientes" />
          <h3 class="subtitulo-clientes">Desde</h3>
          <p class="descricao-clientes">Clínicas, hospitais e<br>profissionais de saúde</p>
          <h1 class="apoio-clientes">apoiamos <span>quem cuida</span></h1>
        </div>

        <!-- Footer -->
      <Footer />
      </section>
    
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style scoped>
footer {
  margin-top: 0;
}
.clientes-section {
  background-image: url('@/assets/Background.png'); /* Caminho correto */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 100px 0;
  color: white;
  text-align: center; /* centraliza texto */
  margin-bottom: 0;
  padding-bottom: 0;
}

.clientes-content {
  max-width: 900px;
  margin: 0 auto;
}

.titulo-clientes {
  font-size: 2.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 2px #00000070;
}

.linha-clientes {
  width: 50%;
  height: 5px;
  background-color: #45717c;
  margin: 0 auto 2rem auto;
  border: none;
}

.subtitulo-clientes {
  font-size: 2rem;
  color: #89def2;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 1px #00000070;
}

.descricao-clientes {
  font-size: 1.3rem;
  line-height: 1.6;
  margin-bottom: 3rem;
  text-shadow: 1px 1px 1px #00000070;
}

.apoio-clientes {
  font-size: 2.8rem;
  color: #89def2;
  text-shadow: 2px 2px 3px #00000070;
  font-weight: 800;
}

.apoio-clientes span {
  color: #89def2;
}


.onde-atuamos {
  padding: 40px 20px 20px;
  background-color: white;
  color: #121212;
}

.atuamos-content {
  display: flex;
  align-items: flex-start; /* sobe o conteúdo */
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 1100px;
  margin: 0 auto;
  gap: 30px;
}

.text-content {
  flex: 1 1 50%;
  font-size: 24px; /* aumenta o texto */
  line-height: 1.6;
}


.section-title {
  font-size: 36px; /* maior título */
  font-weight: bold;
  color: #2c2c2c;
  margin-bottom: 20px;
}

.underline {
  border-bottom: 5px solid #00b8b8;
  padding-bottom: 4px;
}


.atuamos-text p {
  font-size: 16px;
  line-height: 1.6;
}

.mapa-portugal {
  flex: 1 1 40%;
  max-width: 300px;
  height: auto;
  border-radius: 12px;
  object-fit: contain;
}

.hospital-img-section {
  width: 100%;
}

.hospital-img {
  width: 100%;
  height: auto;
  display: block;
}
.about-section {
  padding: 60px 40px;
  background-color: white;
}

.about-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.text-content {
  flex: 1 1 500px;
}

.about-image {
  width: 400px;
  max-width: 100%;
  border-radius: 8px;
}

.section-title {
  font-size: 2.5rem;
  color: #121212;
  margin-bottom: 20px;
}

.underline {
  border-bottom: 4px solid #00b3b3;
  padding-bottom: 4px;
}

.about-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #121212;
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
.hero-text h1 {
  font-size: 56px; 
  font-weight: bold;
  margin: 0;
}

.hero-text p {
  font-size: 18px;
  margin-top: 8px;
}

.text-primary {
  color: #00b8b8;
}

.text-white {
  color: white;
}

.stats {
  display: flex;
  justify-content: space-evenly;
  background-color: #9bd0c4;
  padding: 40px 80px;
  text-align: center;
  flex-wrap: wrap;
  width: 100%;
  color: #000;
}

.stat {
  flex: 1 1 200px;
  margin: 20px;
}

.stat strong {
  font-size: 36px; /* Aumenta o número */
  display: block;
  color: #000;
}

.stat span {
  font-size: 30px; /* Aumenta o texto */
  color: #000;
  display: block;
  margin-top: 8px;
}

.about {
  padding: 20px;
}
.ocorrencias {
  padding: 40px 20px;
  background-color: #fbf7f7;
  color: rgb(21, 17, 17);
}

.ocorrencias-title {
  font-size: 24px;
  margin-bottom: 24px;
  text-align: center;
}

.ocorrencias-grid {
  display: flex;
  justify-content: center;
  gap: 400px; /* aumenta o espaçamento entre caixas */
  flex-wrap: wrap;
  padding: 30px 20px;
}
.ocorrencia-card {
  background-color: #fbf9f6;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 20px;
  width: 320px;
  text-align: center;
  box-shadow: 2px 2px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}
.card-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 16px;
}
.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 12px;
}

.card-description {
  font-size: 0.95rem;
  color: #444;
}
.ocorrencia-card-link {
  text-decoration: none;
  color: inherit;
}

.card-title-link {
  text-decoration: none;
  color: inherit;
}

.card-title-link:hover {
  text-decoration: underline;
  cursor: pointer;
}

.card {
  background-color: #fbf9f6;
  border-radius: 12px; /* menos arredondado que antes */
  padding: 24px;       /* mais espaço dentro */
  border: 1px solid #000; /* mantém a borda preta */
  width: 300px;        /* ajusta o tamanho para ser mais largo */
  height: auto;        /* altura automática com base no conteúdo */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* opcional, para suavizar */
}

.card img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 16px;
}

.card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.card p {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}


.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #1f2a44;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 13px;
  color: #444;
  line-height: 1.4;
}


.footer {
  background-color: #3a5f7f;
  color: white;
  padding: 12px;
  text-align: center;
  margin-top: 32px;
}
@media (max-width: 768px) {
  .about-content {
    flex-direction: column;
    align-items: center;
  }

  .about-image {
    max-width: 100%;
  }

  .text-content {
    text-align: center;
  }
}
</style>