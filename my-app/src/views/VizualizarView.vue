<template>
    <div class="criar-ocorrencia-view">
      <!-- Cabeçalho (opcional) -->
      <div class="top-bar" style="background-color: #93E5E0; height: 70px;">
        <img 
          src="@/assets/images/logo.png" 
          alt="Logo"
          style="height: 60px; display: block; margin: 0 auto; padding-top: 10px;"
        >
      </div>
  
      <!-- Botão back -->
      <div class="d-flex justify-content-around mb-2 mt-4" style="width: 50%;">
        <button class="btn p-0 d-flex gap-2" @click="$router.push('/finalizar')">
           <i class="bi bi-arrow-left"></i>
           <span>Página anterior</span>
        </button>
      </div>

      <!-- Dentro -->

      <div class="card m-4 mt-5 border-secondary border-2 rounded-4" style="height: 620px;">
    <div class="card-header rounded-top-4" style="background-color: #93E5E0; height: 40px; display: flex; align-items: center;">
        <i class="bi bi-exclamation-triangle-fill fs-2 me-2"></i> 
        <h5 class="text-black" style="font-size: 15px; margin: 0;">Material Fora do Lugar</h5>
    </div>
    <div class="bg-secondary" style="height: 2px;"></div>

    <div class="p-3">
        <p><strong>Alerta dado por:</strong> XXXXX</p>
        <p><strong>Data da ocorrência:</strong> XXXXX</p>
        <p><strong>Localização:</strong> XXXXXXXX</p>
        <p><strong>Profissional:</strong> Higiene</p>
        
        <div class="card mt-5 rounded-3 d-flex flex-column" style="background-color: #93E5E0; height: 340px;">
  <!-- Conteúdo superior -->
  <div>
    <h5 class="text-black mt-4 p-2" style="font-size: 18px; margin: 0;">
      Descrição mais pormenorizada da ocorrência
    </h5>
    <div class="bg-black m-2" style="height: 1px;"></div>
  </div>

  <!-- Espaço flexível para empurrar o botão para baixo -->
  <div class="flex-grow-1"></div>

  <!-- Botão no rodapé (centralizado) -->
  <div class="d-flex justify-content-center pb-3">
    <button class="btn btn-primary" style="width: 200px;">
      PENDENTE / RESOLVIDO
    </button>
  </div>
</div>
        
    </div>
    </div>
    </div>
 </template>