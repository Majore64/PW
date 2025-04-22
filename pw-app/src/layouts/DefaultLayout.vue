<template>
  <div class="default-layout">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <img src="../assets/logo.png" alt="Logo da Empresa" style="width: 50px;">
        <h3>EyesEveryWhere</h3>
      </div>
      <ul class="sidebar-nav">
        <li class="nav-item">
          <router-link to="/ocorrencias" class="nav-link">Ocorrências</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/funcionarios" class="nav-link">Funcionários</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/estatisticas" class="nav-link">Estatísticas</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/historico" class="nav-link">Histórico</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/definicoes" class="nav-link">Definições</router-link>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="content">
      <!-- Header -->
      <nav class="navbar">
        <div class="navbar-container">
          <span class="navbar-brand">{{ currentPageTitle }}</span>
          <div v-if="user" class="user-menu">
            <div class="user-info">
              <img :src="user.picture" alt="User" class="user-avatar">
              <span class="user-name">{{ user.name }}</span>
            </div>
            <button @click="logout" class="logout-btn">Sair</button>
          </div>
        </div>
      </nav>

      <!-- Main Content Area -->
      <div class="main-content">
        <router-view @update-title="updateTitle"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
/* global google */

export default {
  name: 'DefaultLayout',
  data() {
    return {
      currentPageTitle: 'Minha App'
    }
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user'));
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('user');
      if (window.google) {
        google.accounts.id.disableAutoSelect();
      }
      this.$router.push('/login');
    },
    updateTitle(title) {
      this.currentPageTitle = title;
    }
  }
}
</script>

<style scoped>
.default-layout {
  display: flex;
  min-height: 100vh;
  background-color: #F5F7FA;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: white;
  color: #343a40;
  position: fixed;
  height: 100%;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  z-index: 1000;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex; 
  align-items: center; 
  gap: 10px; 
}

.sidebar-header h3 {
  color:#03B5AA;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.sidebar-nav {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav .nav-item {
  border-bottom: 1px solid #eee;
}

.sidebar-nav .nav-link {
  color: #343a40;
  text-decoration: none;
  display: block;
  padding: 12px 20px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.sidebar-nav .nav-link:hover {
  background-color: #79B4A9;
}

.sidebar-nav .nav-link.router-link-exact-active {
  background-color: #e9ecef;
  font-weight: 500;
  border-left: 6px solid #79B4A9;
  color: #79B4A9;
}

/* Main content area */
.content {
  margin-left: 250px;
  width: calc(100% - 250px);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: white;
  padding: 15px 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 999;
}

.navbar-container {
  width: 100%;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0; 
  max-width: none; 
}

.navbar-brand {
  color: #79B4A9;
  font-weight: 600;
  font-size: 1.25rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.user-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #495057;
}

.logout-btn {
  padding: 6px 15px;
  border: 1px solid #dc3545;
  color: #dc3545;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  font-weight: 500;
}

.logout-btn:hover {
  background-color: #dc3545;
  color: white;
}

.main-content {
  width: 100%;
  padding: 15px;
  flex-grow: 1;
  max-width: none; 
  margin: 0; 
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .sidebar {
    width: 220px;
  }
  .content {
    margin-left: 220px;
    width: calc(100% - 220px);
  }
}

@media (max-width: 768px) {
  .navbar-container,
  .main-content {
    padding: 0 20px;
  }
  
  .user-name {
    display: none;
  }
}
</style>