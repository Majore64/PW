<template>
  <!-- Cabeçalho -->
  <div class="top-bar" style="background-color: #93E5E0; height: 70px;">
    <img src="@/assets/images/logo.png" alt="Logo"
         style="height: 60px; display: block; margin: 0 auto; padding-top: 10px;">
  </div>

  <!-- Botão voltar -->
  <div class="d-flex justify-content-around mb-5 mt-4" style="width: 30%;">
    <button class="btn p-0 d-flex gap-2" @click="router.push('/perfil')">
      <i class="bi bi-arrow-left"></i>
      <span>Perfil</span>
    </button>
  </div>

  <!-- Mensagem de erro de autenticação -->
  <div v-if="!isAuthenticated" class="container my-4 text-center">
    <div class="alert alert-warning">
      <i class="bi bi-exclamation-triangle me-2"></i>
      Você precisa estar autenticado para acessar esta página.
      <div class="mt-2">Redirecionando para o login...</div>
    </div>
  </div>

  <div v-else>
    <!-- Ícone de perfil -->
    <div class="d-flex justify-content-center align-items-center" style="width: 100%; height: 100px;">
      <i class="bi bi-person-fill text-secondary" style="font-size: 8rem;"></i>
    </div>

    <!-- Formulário -->
    <div class="card p-4 mx-auto" style="max-width: 600px;">
      <!-- Nome -->
      <div class="mb-3">
        <p class="mb-1 text-muted">Nome</p>
        <input type="text" class="form-control" v-model="name" />
      </div>

      <!-- Email -->
      <div class="mb-3">
        <p class="mb-1 text-muted">Email</p>
        <input type="email" class="form-control" v-model="email" />
      </div>

      <!-- Data de Nascimento -->
      <div class="mb-3">
        <p class="mb-1 text-muted">Data de Nascimento</p>
        <input type="text" class="form-control" v-model="birthdate" placeholder="DD/MM/AAAA" />
      </div>

      <!-- Contacto -->
      <div class="mb-3">
        <p class="mb-1 text-muted">Contacto</p>
        <input 
          type="text" 
          class="form-control" 
          v-model="phone" 
          @focus="prefillPhone"
          placeholder="+351 XXXXXXXXX"
        />
      </div>

      <!-- Morada -->
      <div class="mb-3">
        <p class="mb-1 text-muted">Morada</p>
        <input type="text" class="form-control" v-model="address" />
      </div>

      <!-- Botão guardar -->
      <button class="btn btn-primary w-100 py-2" @click="saveChanges">Aplicar Alterações</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOccurrencesStore } from '@/stores/useOccurrencesStore'

const router = useRouter()
const store = useOccurrencesStore()
const isAuthenticated = ref(true)

// Campos editáveis
const name = ref('')
const email = ref('')
const birthdate = ref('')
const phone = ref('')
const address = ref('')

// Quando o componente for montado, recupera os dados do user armazenados no localStorage
onMounted(() => {
  // Verificar autenticação
  if (!store.currentUser) {
    console.warn('Nenhum usuário logado. Redirecionando para login.')
    isAuthenticated.value = false
    setTimeout(() => {
      router.push('/')
    }, 2000)
    return
  }

  // Carregar dados do usuário
  const currentUser = store.currentUser
  if (currentUser) {
    name.value = currentUser.name || ''
    email.value = currentUser.email || ''
    birthdate.value = currentUser.birthdate || ''
    phone.value = currentUser.phone || ''
    address.value = currentUser.address || ''
  }
})

// Função para garantir que o telefone comece com "+351 "
function prefillPhone() {
  if (!phone.value) {
    phone.value = '+351 '
  }
}

// Função para salvar as alterações feitas
function saveChanges() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const birthdateRegex = /^\d{2}\/\d{2}\/\d{4}$/
  const phoneRegex = /^\+351 \d{9}$/

  if (!name.value.trim()) {
    alert('O nome não pode estar vazio!')
    return
  }

  if (!email.value.trim() || !emailRegex.test(email.value)) {
    alert('Por favor, insira um email válido!')
    return
  }

  if (birthdate.value && !birthdateRegex.test(birthdate.value)) {
    alert('Data de nascimento inválida. Use o formato DD/MM/AAAA.')
    return
  }

  if (phone.value && !phoneRegex.test(phone.value)) {
    alert('Contacto inválido. Use o formato +351 912345678.')
    return
  }

  if (!address.value.trim()) {
    alert('A morada não pode estar vazia!')
    return
  }

  const updatedUser = {
    ...store.currentUser,
    name: name.value,
    email: email.value,
    birthdate: birthdate.value,
    phone: phone.value,
    address: address.value
  }

  // Atualizar o usuário no store
  store.setCurrentUser(updatedUser)
  router.push('/perfil')
}
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>