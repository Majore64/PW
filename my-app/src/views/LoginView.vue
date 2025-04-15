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
      
      <div class="card border-0 bg-transparent" style="width: 220px;">
        <div class="card-body p-0 text-center">
          <button 
            class="btn btn-secondary text-white btn-lg w-100 py-2 mt-4"
            @click="handleLogin"
            style="font-family: 'Switzer', sans-serif; letter-spacing: 2px; font-weight: 600;"
          >
            ENTRAR
          </button>
        </div>
      </div>
    </div>
  </template>

  <script>
  export default {
    methods: {
      handleLogin() {
        this.$router.push('/dashboard')
      }
    }
  }
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
    opacity: 0.9 ;
    transform: translateY(-1px);
  }
  </style>