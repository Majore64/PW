<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Campos editáveis
const name = ref('')
const email = ref('')
const birthdate = ref('')
const phone = ref('')
const address = ref('')

// Quando o componente for montado, recupera os dados do user armazenados no localStorage
onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const parsed = JSON.parse(storedUser)
    name.value = parsed.name || ''
    email.value = parsed.email || ''
    birthdate.value = parsed.birthdate || ''
    phone.value = parsed.phone || ''
    address.value = parsed.address || ''
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
  if (!name.value.trim() || !email.value.trim()) {
    alert('Por favor, preencha o nome e o email!')
    return
  }
  if (!email.value.includes('@')) {
    alert('Por favor, insira um email válido!')
    return
  }

  const existing = JSON.parse(localStorage.getItem('user')) || {}
  const updated = {
    ...existing,
    name: name.value,
    email: email.value,
    birthdate: birthdate.value,
    phone: phone.value,
    address: address.value,
    picture: existing.picture || ''
  }
  
  // Salvando os dados no localStorage
  localStorage.setItem('user', JSON.stringify(updated))

  // Redireciona para o perfil
  router.push('/perfil')
}
</script>

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
</template>

<style scoped>
.container {
  max-width: 600px;
}
</style>
