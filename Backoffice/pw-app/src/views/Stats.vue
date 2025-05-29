<template>
    <div class="login-container">
      <h2>Faça Login</h2>
      <button @click="loginWithGoogle" class="login-btn">Login com Google</button>
      <p v-if="user">Bem-vindo, {{ user.displayName }}</p>
      <button v-if="user" @click="logout" class="logout-btn">Logout</button>
    </div>
  </template>
  
  <script>
  import { auth, provider, signInWithPopup, signOut } from '../firebase';
  
  export default {
    data() {
      return {
        user: null
      };
    },
    methods: {
      async loginWithGoogle() {
        try {
          const result = await signInWithPopup(auth, provider);
          this.user = result.user;
          localStorage.setItem("user", JSON.stringify(this.user));
          this.$router.push('/'); // Redireciona após login
        } catch (error) {
          console.error("Erro no login:", error);
        }
      },
      logout() {
        signOut(auth);
        this.user = null;
        localStorage.removeItem("user");
      }
    },
    mounted() {
      const storedUser = localStorage.getItem("user");
      if (storedUser) this.user = JSON.parse(storedUser);
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    text-align: center;
    margin-top: 50px;
  }
  .login-btn {
    background-color: #4285F4;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  .logout-btn {
    margin-top: 10px;
    background-color: #d9534f;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  </style>
  