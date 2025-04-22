<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'
</script>


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
        <button class="btn p-0 d-flex gap-2" @click="$router.push('/dashboard')">
           <i class="bi bi-arrow-left"></i>
           <span>Página Inicial</span>
        </button>
      </div>
    </div>

    <div class="text-center">
        <i class="bi bi-file-earmark-check text-secondary" style="font-size: 5rem;"></i>
    </div>

     <!-- Cards -->
    <div class="card m-4 bg-secondary rounded-4">
        <div class="card-body d-flex align-items-center p-2">
            <i class="bi bi-briefcase-fill text-white fs-1 pe-2"></i>
                <div>
                    <h5 class="text-white m-0" style="font-size: 15px;">Material Fora do Lugar</h5>
                    <h5 class="text-accent m-0" style="font-size: 15px;">Nome</h5>
                </div>
            <button class="btn text-black fw-medium rounded-3 ms-auto" style="background-color: #93E5E0;" @click="$router.push('/vizualizar')">Vizualizar</button>
        </div>
    </div>

    <div class="card m-4 bg-secondary rounded-4">
        <div class="card-body d-flex align-items-center p-2">
            <i class="bi bi-briefcase-fill text-white fs-1 pe-2"></i>
                <div>
                    <h5 class="text-white m-0" style="font-size: 15px;">Local Sujo</h5>
                    <h5 class="text-accent m-0" style="font-size: 15px;">Nome</h5>
                </div>
            <button class="btn text-black fw-medium rounded-3 ms-auto" style="background-color: #93E5E0;">Vizualizar</button>
        </div>
    </div>

    <div class="card m-4 bg-secondary rounded-4">
        <div class="card-body d-flex align-items-center p-2">
            <i class="bi bi-briefcase-fill text-white fs-1 pe-2"></i>
                <div>
                    <h5 class="text-white m-0" style="font-size: 15px;">Falta de Material Médico</h5>
                    <h5 class="text-accent m-0" style="font-size: 15px;">Nome</h5>
                </div>
            <button class="btn text-black fw-medium rounded-3 ms-auto" style="background-color: #93E5E0;">Vizualizar</button>
        </div>
    </div>

    <div class="card m-4 bg-secondary rounded-4">
        <div class="card-body d-flex align-items-center p-2">
            <i class="bi bi-briefcase-fill text-white fs-1 pe-2"></i>
                <div>
                    <h5 class="text-white m-0" style="font-size: 15px;">Equipamento Danificado</h5>
                    <h5 class="text-accent m-0" style="font-size: 15px;">Nome</h5>
                </div>
            <button class="btn text-black fw-medium rounded-3 ms-auto" style="background-color: #93E5E0;">Vizualizar</button>
        </div>
    </div>

            <div class="d-flex justify-content-center mt-5">
                <button class="btn btn-secondary text-white fs-1 rounded-4" style="width:160px">Selecionar</button>
            </div>

  </template>