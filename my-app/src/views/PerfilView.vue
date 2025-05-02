<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref({
  name: '',
  email: '',
  imageUrl: ''
})

onMounted(() => {
  const data = localStorage.getItem('user')
  if (data) {
    const parsed = JSON.parse(data)
    user.value.name = parsed.name || ''
    user.value.email = parsed.email || ''
    user.value.imageUrl = parsed.picture || ''
  }
})
</script>

<template>
  <!-- Cabeçalho -->
  <div class="top-bar" style="background-color: #93E5E0; height: 70px;">
    <img src="@/assets/images/logo.png" alt="Logo"
         style="height: 60px; display: block; margin: 0 auto; padding-top: 10px;">
  </div>

  <!-- Botão voltar -->
  <div class="d-flex justify-content-around mb-5 mt-4" style="width: 50%;">
    <button class="btn p-0 d-flex gap-2" @click="router.push('/dashboard')">
      <i class="bi bi-arrow-left"></i>
      <span>Página Inicial</span>
    </button>
  </div>

  <!-- Botão Editar -->
  <div class="d-flex justify-content-end">
    <button class="btn text-white me-5" @click="router.push('/editar')" style="width:110px; background-color: #93E5E0;">
      <i class="bi bi-pencil-square"></i> Editar
    </button>
  </div>

  <!-- Perfil -->
  <div class="d-flex align-items-center ms-3" style="width: 100%; height: 200px; position: relative;">
    <img 
      v-if="user.imageUrl" 
      :src="user.imageUrl" 
      alt="User Image" 
      style="height: 105px; width: 105px; border-radius: 100%; margin-right: 1rem;" 
    />
    <i 
      v-else 
      class="bi bi-person-fill text-secondary pr-4" 
      style="font-size: 8rem; margin-right: 2rem;"
    ></i>

    <div class="d-flex flex-column">
      <span class="fs-4 fw-bold">{{ user.name }}</span>
      <span class="fs-5">{{ user.email }}</span> <!-- Aqui agora fica o email -->
    </div>
  </div>

  <!-- Ocorrências -->
  <div class="d-flex justify-content-between align-items-center pt-3 w-100">
    <div class="d-flex align-items-center ps-3">
      <span class="fs-5 fw-medium me-2">Ocorrências</span>
      <i class="bi bi-list-task fs-3"></i>
    </div>
    <div>
      <span class="text-primary pe-4">Ver tudo</span>
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

  <!-- Separador -->
  <div class="bg-black mt-5 me-4 ms-4" style="height: 0.1px;"></div>

  <!-- Histórico -->
  <div class="d-flex justify-content-between align-items-center pt-3 w-100">
    <div class="d-flex align-items-center ps-3">
      <span class="fs-5 fw-medium me-2">Histórico</span>
      <i class="bi bi-file-earmark-text-fill fs-5"></i>
    </div>
    <div>
      <span class="text-primary pe-4">Ver</span>
    </div>
  </div>
</template>
