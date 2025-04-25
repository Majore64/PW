<template>
  <header class="header">
    <!-- Esquerda: Logo + navegação -->
    <div class="left-group">
      <img src="@/assets/Logo.png" alt="Logo" class="logo" />
      <div class="nav-buttons left">
        <a href="#quem-somos" class="nav-btn">Quem Somos</a>
        <a href="#contactos" class="nav-btn">Contacte-nos</a>
      </div>
    </div>

    <!-- Direita: Login e Sign Up -->
    <div class="nav-buttons right">
      <a href="#login" class="nav-btn">Login</a>
      <button class="nav-btn filled">Sign Up</button>
    </div>
  </header>
</template>


<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 20px 40px;
  height: 100px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
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
