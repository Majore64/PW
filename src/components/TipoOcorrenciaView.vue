<template>
  <div class="tipo-ocorrencia">
    <div class="header">
        <div class="left-group">
          <button class="back-button" @click="$router.back()">←</button>
          <h2 class="titulo-ocorrencia">Tipo de Ocorrência</h2>
        </div>
        <img src="@/assets/Logo.png" alt="Logo" class="logo" />
      </div>

    <div class="cards-grid">
      <div class="ocorrencia-card">
        <div class="card-content">
          <div class="card-text">
            <h3>Local Sujo</h3>
            <button class="seguinte">Seguinte →</button>
          </div>
          <img src="@/assets/localsujo.png" alt="Local Sujo" class="card-img" />
        </div>
      </div>

      <div class="ocorrencia-card">
        <div class="card-content">
          <div class="card-text">
            <h3>Equipamento Danificado</h3>
            <button class="seguinte">Seguinte →</button>
          </div>
          <img src="@/assets/Equipamentodanificado.png" alt="Equipamento Danificado" class="card-img" />
        </div>
      </div>

      <div class="ocorrencia-card">
        <div class="card-content">
          <div class="card-text">
            <h3>Falta de<br>Material Médico</h3>
            <button class="seguinte">Seguinte →</button>
          </div>
          <img src="@/assets/Faltadematerial.png" alt="Falta de Material Médico" class="card-img" />
        </div>
      </div>

      <div class="ocorrencia-card">
        <div class="card-content">
          <div class="card-text">
            <h3>Material Fora<br>do Lugar</h3>
            <button class="seguinte">Seguinte →</button>
          </div>
          <img src="@/assets/Materialforadolugar.png" alt="Material Fora do Lugar" class="card-img" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tipo-ocorrencia {
  padding: 2rem;
  background-color: white;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.left-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.titulo-ocorrencia {
  font-size: 1.8rem;
  font-weight: bold;
  color: #12203c;
  margin: 0;
}



.titulo {
  text-align: center;
  flex: 1;
  font-size: 2rem;
  font-weight: bold;
  color: #12203c;
}

.back-button {
  background-color: #1c2d50;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.4);
}

.logo {
  width: 100px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  justify-items: center;
}

.ocorrencia-card {
  background-color: #d8ecfb;
  border: 2px solid black; /* borda preta */
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 700px;
  height: 230px;
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.card-text h3 {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
  color: #12203c;
}

.seguinte {
  background-color: #1cd6d6;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1.1rem;
  border-radius: 10px;
  cursor: pointer;
}

.card-img {
  width: 220px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
