<template>
  <div class="login-view vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
    <img 
      src="@/assets/images/logo.png" 
      alt="EyesEveryWhere" 
      class="mb-3"
      style="height: 150px; width: auto;"
    >
    
    <h1 class="mb-5 text-uppercase" style="font-family: 'Switzer', sans-serif; letter-spacing: 3px; font-weight: 800;">
      <span style="color: #FCDEBE;">Eyes</span><span style="color: var(--bs-secondary);">EveryWhere</span>
    </h1>
    

    <!-- Google Sign-In Button -->
    <div class="card border-0 bg-transparent" style="width: 220px;">
      <div class="card-body p-0 text-center">
        <div id="googleButton"></div>
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
@import url('https://fonts.googleapis.com/css2?family=Switzer:wght@400;600;800&display=swap');

.login-view {
  background-color: #f8f9fa;
  font-family: 'Switzer', sans-serif;
}

.btn-secondary {
  border: none;
  background-color: var(--bs-secondary);
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

#googleButton {
  display: flex;
  justify-content: center;
  margin: 0 auto;
}
</style>