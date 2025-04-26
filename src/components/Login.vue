<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-white p-4">
    <div class="w-full max-w-md flex flex-col items-center space-y-8">
      <!-- Logo -->
      <div class="w-80 h-auto relative">
        <img src="@/assets/Logo.png" alt="EyesEveryWhere Logo" class="w-full h-auto" />
      </div>

      <!-- Brand Name -->
      <h1 class="text-5xl font-bold tracking-tight" style="color: #fcdebe;">EyesEveryWhere</h1>

      <!-- Google Sign In Button -->
      <button
        class="w-full max-w-sm h-12 mt-8 bg-white border border-[#b1b1b1] rounded-md hover:bg-gray-50 flex items-center justify-center"
        @click="signInWithGoogle"
      >
        <div class="flex items-center justify-center w-full">
          <img src="@/assets/singingoogle.png" alt="Google Logo" class="w-6 h-6 mr-3" />
          <span class="text-base text-black font-normal">Sign in with Google</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
const signInWithGoogle = () => {
  // Implementar a lógica de autenticação com Google aqui
  console.log('Iniciando login com Google');
}
</script>

<style scoped>
/* Estilos adicionais podem ser adicionados aqui se necessário */
</style>
