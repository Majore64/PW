<template>
  <div class="login">
    <img src="../assets/logo.png" alt="Logo da Empresa" style="width: 200px;">
    <h1>Bem-vindo!</h1>
    <p>Faça login para acessar ao EyesEveryWhere.</p>

    <!-- Botão Google será renderizado aqui -->
    <div id="login"></div> <!-- Removido o # do ID -->
    <button @click="testLogin">Testar Login</button>
  </div>
</template>

<script>
/* global google */

export default {
  methods: {
    testLogin() {
      console.log("Botão de teste clicado");
      this.handleCredentialResponse({ credential: "token_de_teste" });
    }
  },
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
        script.onload = this.renderGoogleButton; // Quando o script carregar, chama render
        document.head.appendChild(script);
      } else {
        this.renderGoogleButton(); // Já carregado? Então renderiza logo
      }
    },
    renderGoogleButton() {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse
      });

      google.accounts.id.renderButton(
        document.getElementById("login"), // Corrigido o ID aqui
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

