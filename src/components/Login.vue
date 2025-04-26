<template>
  <div class="container">
    <div class="content">
      <!-- Logo -->
      <div class="logo">
        <img
          src="@/assets/Logo.png"
          alt="EyesEveryWhere Logo"
        />
      </div>

      <!-- Marca -->
      <h1 class="title">
        EyesEveryWhere
      </h1>

      <!-- Google Sign In Button -->
      <div id="googleButton" @click="signInWithGoogle">
        <img src="@/assets/google.png" alt="Google Logo" class="googleicon" />
      </div>
    </div>
  </div>
</template>

<script>
/* global google */

export default {
  name: "LoginPage",
  data() {
    return {
      clientId: "317441973775-0qv2rf6g2ovskb53sg1c24rdt6dc4lo3.apps.googleusercontent.com"
    };
  },
  mounted() {
    this.loadGoogleSDK();
    window.handleCredentialResponse = this.handleCredentialResponse;
  },
  methods: {
    loadGoogleSDK() {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = this.renderGoogleButton;
        document.head.appendChild(script);
      } else {
        this.renderGoogleButton();
      }
    },
    renderGoogleButton() {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse
      });

      google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular"
        }
      );
    },
    handleCredentialResponse(response) {
      const user = this.decodeJWT(response.credential);
      localStorage.setItem("user", JSON.stringify(user));
      this.$router.push("/");
    },
    decodeJWT(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    }
  }
};
</script>

<style scoped>
.container {
  height: 100vh; /* 100% da altura da janela */
  display: flex;
  justify-content: center; /* Alinha ao centro horizontal */
  align-items: center; /* Alinha ao centro vertical */
  background-color: white;
  padding: 20px;
}

/* Área de conteúdo */
.content {
  text-align: center;
  width: 100%;
  max-width: 400px;
}

/* Logo */
.logo img {
  width: 250px;
  height: auto;
  margin: 0 auto;
  display: block;
}

/* Título */
.title {
  font-size: 32px;
  font-weight: bold;
  color: #fcdebe;
  margin-top: 20px;
  margin-bottom: 40px;
}

/* Ícone Google */
.googleicon {
  width: 100%;
  cursor: pointer;
}

#googleButton {
  cursor: pointer;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}
</style>
