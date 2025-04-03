<template>
  <div>
    <Header />

    <p>Se vires isto, o Header.vue está carregado corretamente.</p>
    <!-- Indicadores -->
    <section class="stats">
      <div class="stat"><strong>+100</strong><br />Profissionais</div>
      <div class="stat"><strong>9.8/10</strong><br />Satisfação</div>
      <div class="stat"><strong>20min</strong><br />Tempo de Resposta</div>
      <div class="stat"><strong>+50</strong><br />Ocorrências Resolvidas</div>
    </section>

    <!-- Sobre Nós -->
    <section class="about">
      <h2>Sobre Nós</h2>
      <p>
        A EyesEverywhere é uma plataforma dedicada ao registo e monitorização de ocorrências
        em ambientes clínicos e hospitalares.
      </p>
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
