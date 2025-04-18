<template>
    <!-- Cabeçalho (opcional) -->
    <div class="top-bar" style="background-color: #93E5E0; height: 70px;">
        <img 
          src="@/assets/images/logo.png" 
          alt="Logo"
          style="height: 60px; display: block; margin: 0 auto; padding-top: 10px;"
        >
      </div>
    
      <!-- Botão back -->
      <div class="d-flex justify-content-around mb-5 mt-4" style="width: 45%;">
        <button class="btn p-0 d-flex gap-2" @click="$router.push('/dashboard')">
           <i class="bi bi-arrow-left"></i>
           <span>Página Inicial</span>
        </button>
      </div>
    
      <div class="card-header rounded-5 d-flex align-items-center mb-5" style="max-width: 300px; margin: 0 auto; background-color: #93E5E0;">
        <i class="bi bi-arrows-vertical fs-4 me-2 ms-3"></i>
        <h5 class="mb-0 fs-5 fw-medium">Mais Recentes</h5>
      </div>

      <div class="card rounded-3" style="max-width: 315px; margin: 0 auto;">
  <!-- Barra azul ajustada -->
  <div class="card-header rounded-top-3 d-flex align-items-center bg-secondary py-0">
    <i class="bi bi-caret-left-fill fs-5 me-2 ms-1" style="color: white;"></i>
    <h5 class="mb-0 text-white" style="font-size: 15px;">Material Fora do Lugar</h5>
  </div>
  
  <div class="p-0 ps-2 pe-2 bg-white border-5 rounded-bottom-5">
    <div class="d-flex justify-content-between align-items-start m-2">
      <div>
        <div class="fw-bold">Data</div>
        <div>14 março 2025</div>
        <div>11h50</div>
      </div>
      <button class="badge border border-secondary bg-white rounded-5 text-secondary align-self-center mt-4" style="font-size: 17px;">Concluída</button>
    </div>
  </div>
</div>

<div class="card rounded-3" style="max-width: 315px; margin: 40px auto;">
  
  <div class="card-header rounded-top-3 d-flex align-items-center bg-secondary py-0">
    <i class="bi bi-caret-left-fill fs-5 me-2 ms-1" style="color: white;"></i>
    <h5 class="mb-0 text-white" style="font-size: 15px;">Material Fora do Lugar</h5>
  </div>
  
  <div class="p-0 ps-2 pe-2 bg-white border-5 rounded-bottom-5">
    <div class="d-flex justify-content-between align-items-start m-2">
      <div>
        <div class="fw-bold">Data</div>
        <div>14 março 2025</div>
        <div>11h50</div>
      </div>
      <button class="badge border border-secondary bg-white rounded-5 text-secondary align-self-center mt-4" style="font-size: 17px;">Concluída</button>
    </div>
  </div>
</div>

<div class="card rounded-3" style="max-width: 315px;  margin: 40px auto;">
  
  <div class="card-header rounded-top-3 d-flex align-items-center bg-secondary py-0">
    <i class="bi bi-caret-left-fill fs-5 me-2 ms-1" style="color: white;"></i>
    <h5 class="mb-0 text-white" style="font-size: 15px;">Material Fora do Lugar</h5>
  </div>
  
  <div class="p-0 ps-2 pe-2 bg-white border-5 rounded-bottom-5">
    <div class="d-flex justify-content-between align-items-start m-2">
      <div>
        <div class="fw-bold">Data</div>
        <div>14 março 2025</div>
        <div>11h50</div>
      </div>
      <button class="badge border border-danger bg-white rounded-5 text-danger align-self-center mt-4" style="font-size: 14.5px;">Por Resolver</button>
    </div>
  </div>
</div>

<div class="d-flex justify-content-center mt-4 mb-4">
  <i class="bi bi-plus-circle fs-1"></i>
</div>

 </template>