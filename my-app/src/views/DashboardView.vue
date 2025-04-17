<template>
  <div class="dashboard-view">
    <!-- Faixa Superior -->
    <div class="top-bar" style="background-color: #93E5E0; height: 70px;">
      <img 
        src="@/assets/images/logo.png" 
        alt="Logo"
        style="height: 60px; display: block; margin: 0 auto; padding-top: 10px;"
      >
    </div>

    <!--Texto -->
      
    <div class="content">
      <h1 class="text-center my-5 fs-2 text-secondary" style="font-family: 'Catamaran' , sans-serif; font-weight: 900;">OCORRÊNCIAS PENDENTES</h1>
    </div>
     
    <!--  Card cima -->
<div class="card rounded-4 bg-secondary m-4 mt-2">
  <div class="card-body p-2 d-flex justify-content-center align-items-center">
    <i class="bi bi-briefcase-fill fs-1 text-white pe-4"></i> 
    <div>
      <h5 class="text-white fs-4 fw-normal m-0">Material Fora do Lugar</h5>
      <h5 class="text-white fs-6 fw-normal m-0">Piso 4, Sala -4</h5>
    </div>
  </div>
</div>

    <!--  Card baixo -->
<div class="card rounded-4 bg-secondary m-4 mt-2">
  <div class="card-body p-2 d-flex justify-content-center align-items-center">
    <i class="bi bi-briefcase-fill fs-1 text-white pe-4"></i> 
    <div>
      <h5 class="text-white fs-4 fw-normal m-0">Material Fora do Lugar</h5>
      <h5 class="text-white fs-6 fw-normal m-0">Piso 2, Sala -4</h5>
    </div>
  </div>
</div>

<!-- Menu Inferior Simplificado -->
<div class="bottom-nav border-top p-4 " style="height: 110px; margin-top: -15px;">
    <!-- Linha 1: Criar | Finalizar | Editar -->
    <div class="d-flex justify-content-around mb-5 mt-4">
      <button class="btn p-0 text-center" style="width: 30%;" @click="$router.push('/criar')">
        <i class="bi bi-plus-lg d-block text-secondary" style="font-size: 40px;"></i>
        <span class="d-block large ">Criar</span>
        <span class="d-block large ">ocorrências</span>
      </button>
      <button class="btn p-0 text-center" style="width: 30%;" @click="$router.push('/finalizar')">
        <i class="bi bi-check-lg d-block text-secondary" style="font-size: 40px;"></i>
        <span class="d-block large ">Finalizar</span>
        <span class="d-block large ">ocorrências</span>
      </button>
      <button class="btn p-0 text-center" style="width: 30%;">
        <i class="bi bi-pencil d-block text-secondary" style="font-size: 40px;"></i>
        <span class="d-block large ">Editar</span>
        <span class="d-block large ">ocorrências</span>
      </button>
    </div>

    <!-- Linha 2: Histórico | (vazio) | Perfil -->
    <div class="d-flex justify-content-around">
      <button class="btn p-0 text-center" style="width: 80%;">
        <i class="bi bi-clock d-block text-secondary" style="font-size: 40px;"></i>
        <span class="d-block large ">Histórico</span>
      </button>
      
      <button class="btn p-0 text-center" style="width: 80%;" @click="$router.push('/perfil')">
        <i class="bi bi-person d-block text-secondary" style="font-size: 40px;"></i>
        <span class="d-block large ">Perfil</span>
      </button>
    </div>
  </div>
  
  </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Catamaran:wght@400;700&display=swap');

.top-bar {
  width: 100%;
  position: relative;
  z-index: 2000;
}

.bottom-nav {
  z-index: 1000; /* Garante que fique acima de outros elementos */
}
</style>