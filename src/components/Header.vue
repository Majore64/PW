<template>
  <header class="header">
    <!-- Esquerda: Logo + navegação -->
    <div class="left-group">
      <img
        src="@/assets/Logo.png"
        alt="Logo"
        class="logo"
        @click="goToHome"
        style="cursor: pointer;"
      />
      <div class="nav-buttons left">
        <a href="#quem-somos" class="nav-btn">Quem Somos</a>
        <a href="#contactos" class="nav-btn">Contacte-nos</a>
      </div>
    </div>

    <!-- Direita: Login e Sign Up -->
    <div class="nav-buttons right">
      <button class="nav-btn filled" @click="$emit('ativarChatBot')">
          <img src="@/assets/Chatbot.png" alt="ChatBot" style="height: 20px; margin-right: 8px;" />
          ChatBot
        </button>
      <button @click="goToLogin" class="nav-btn">Login</button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    goToLogin() {
      this.$router.push('/login')
    },
    irParaChat() {
      this.$router.push('/chatbot')
    },
    goToHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 20px 40px;
  height: 100px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
   border-bottom: 4px solid #00b8b8; /* azul igual aos botões */
}

.left-group {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  height: 60px;
  object-fit: contain;
}

.nav-buttons {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-btn {
  padding: 12px 24px;
  border: 1px solid #00b8b8;
  background-color: white;
  color: #00b8b8;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn.filled {
  background-color: #00b8b8;
  color: white;
}

.nav-btn:hover {
  opacity: 0.85;
}
</style>
