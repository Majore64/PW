<template>
  <header class="header">
    <div class="left-section">
      <img src="@/assets/Logo.png" alt="Logo" class="logo" />
    </div>
    <nav class="middle-section">
      <button class="nav-btn">Quem Somos</button>
      <button class="nav-btn">Contacte-nos</button>
    </nav>
    <div class="right-section">
      <button class="nav-btn login-btn">Login</button>
      <button class="nav-btn filled">Sign Up</button>
    </div>
  </header>
</template>

<script setup>
// Nenhum script necessário por agora
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 40px;
  background-color: white;
  color: #00b8b8;
}

.logo {
  height: 40px;
  object-fit: contain;
  margin-right: 16px;
}

.middle-section,
.right-section {
  display: flex;
  align-items: center;
}

.middle-section {
  gap: 20px;
  flex: 1;
  justify-content: center; /* <- CENTRALIZA os botões */
}

.right-section {
  gap: 20px;
}

.login-btn {
  margin-left: 40px; /* Aumenta distância entre "Contacte-nos" e "Login" */
}

.nav-btn {
  padding: 8px 12px;
  border: 1px solid #00b8b8;
  background-color: white;
  color: #00b8b8;
  border-radius: 12px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn.filled {
  background-color: #00b8b8;
  color: white;
}

.nav-btn:hover {
  opacity: 0.9;
}
</style>
