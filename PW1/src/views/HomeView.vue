<template>
  <div class="home">
    <header class="header">
      <img alt="Logo" src="/logo.png" class="logo" />
      <nav>
        <RouterLink to="/">Início</RouterLink>
        <RouterLink to="/criar">Criar Ocorrência</RouterLink>
        <RouterLink to="/historico">Histórico</RouterLink>
      </nav>
    </header>

    <section class="hero">
      <h1>EyesEverywhere</h1>
      <p>Para quem cuida de vidas, cada detalhe importa.</p>
      <button>Contacte-nos</button>
    </section>

    <section class="stats">
      <div><strong>+100</strong><br />Profissionais</div>
      <div><strong>9.8/10</strong><br />Satisfação</div>
      <div><strong>20min</strong><br />Tempo de Resposta</div>
      <div><strong>+50</strong><br />Ocorrências Resolvidas</div>
    </section>

    <section class="sobre">
      <h2>Sobre Nós</h2>
      <p>A EyesEverywhere é uma plataforma dedicada ao registo e monitorização de ocorrências em ambientes clínicos e hospitalares. O nosso objetivo é garantir a segurança, organização e qualidade dos espaços de saúde através da participação ativa de profissionais e cidadãos.</p>
    </section>

    <section class="ocorrencias">
      <h2>Ocorrências</h2>
      <div class="cards">
        <div class="card">
          <img src="/img/criar.jpg" alt="Criar" />
          <h3>Criar Ocorrência</h3>
          <p>Permite reportar situações como equipamentos danificados ou locais sujos.</p>
        </div>
        <div class="card">
          <img src="/img/historico.jpg" alt="Histórico" />
          <h3>Histórico de Ocorrências</h3>
          <p>Consulta todas as ocorrências já registadas, o estado e resolução.</p>
        </div>
        <div class="card">
          <img src="/img/finalizar.jpg" alt="Finalizar" />
          <h3>Finalizar Ocorrência</h3>
          <p>Finaliza ocorrências que já foram resolvidas.</p>
        </div>
      </div>
    </section>

    <footer>
      <p>&copy; 2025 EyesEverywhere</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #03b5aa;
  color: white;
}
nav a {
  margin: 0 10px;
  color: white;
  text-decoration: none;
  font-weight: bold;
}
.hero {
  text-align: center;
  padding: 2rem;
  background: #f0f0f0;
}
.stats {
  display: flex;
  justify-content: space-around;
  background: #79b4a9;
  padding: 1rem;
  color: white;
  font-weight: bold;
}
.cards {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}
.card {
  width: 30%;
  background: #fcdebe;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
}
.card img {
  width: 100%;
  border-radius: 5px;
}
footer {
  text-align: center;
  padding: 1rem;
  background: #304d6d;
  color: white;
  margin-top: 2rem;
}
</style>
