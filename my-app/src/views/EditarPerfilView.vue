<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'
</script>


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
  <div class="d-flex justify-content-around mb-5 mt-4" style="width: 30%;">
    <button class="btn p-0 d-flex gap-2" @click="$router.push('/perfil')">
       <i class="bi bi-arrow-left"></i>
       <span>Perfil</span>
    </button>
  </div>

  <div class="d-flex justify-content-center align-items-center" style="width: 100%; height: 100px;">
  <i class="bi bi-person-fill text-secondary" style="font-size: 8rem;"></i>
</div>
  
<!-- Dados do cliente -->
<div class="card p-4 mx-auto" style="max-width: 600px;">
    <!-- Linha 1: Número de Cliente e NIF -->
    <div class="d-flex justify-content-between mb-4">
      <div>
        <p class="mb-1 text-muted">Número de Cliente</p>
        <p class="fw-bold">XXXXX</p>
      </div>
      <div>
        <p class="mb-1 text-muted">NIF</p>
        <p class="fw-bold">XXXXXXXXXX</p>
      </div>
    </div>

    <!-- Linha 2: Data de Nascimento e SNS -->
    <div class="d-flex justify-content-between mb-4">
      <div>
        <p class="mb-1 text-muted">Data de Nascimento</p>
        <p class="fw-bold">XX / XX / XXXX</p>
      </div>
      <div>
        <p class="mb-1 text-muted">SNS</p>
        <p class="fw-bold">XXXXXXXXXX</p>
      </div>
    </div>

    <!-- Demais campos (uma coluna) -->
    <div class="mb-1">
      <p class="mb-1 text-muted">Contacto</p>
      <p class="fw-bold">XXXXXXXXX</p>
    </div>

    <div class="mb-2">
      <p class="mb-1 text-muted">Nome</p>
      <p class="fw-bold">Exemplo</p>
    </div>

    <div class="mb-2">
      <p class="mb-1 text-muted">Email</p>
      <p class="fw-bold">exemplo@gmail.com</p>
    </div>

    <div class="mb-2">
      <p class="mb-1 text-muted">Morada</p>
      <p class="fw-bold">Rua exemplo Nº XXX</p>
    </div>

    <button class="btn btn-primary w-100 py-2">Aplicar Alterações</button>
  </div>
</template>