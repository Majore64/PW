<template>
  <div class="login">
    <img src="../assets/logo.png" alt="Logo da Empresa" style="width: 200px;">
    <h1>Bem-vindo!</h1>
    <p>Faça login para acessar ao EyesEveryWhere.</p>

    <!-- Botão Google será renderizado aqui -->
    <div id="#login"></div>
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
        script.onload = this.renderGoogleButton; // quando o script carregar, chama render
        document.head.appendChild(script);
      } else {
        this.renderGoogleButton(); // já carregado? então renderiza logo
      }
    },
    renderGoogleButton() {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse
      });

      google.accounts.id.renderButton(
        document.getElementById("#login"),
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
      this.$router.push("/dashboard");
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
.login {
  text-align: center;
  margin-top: 50px;
}
#googleButton {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
