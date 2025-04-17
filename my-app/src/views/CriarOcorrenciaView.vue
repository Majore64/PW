<template>
    <div class="criar-ocorrencia-view">
      <!-- Cabeçalho (opcional) -->
      <div class="top-bar" style="background-color: #93E5E0; height: 70px;">
        <img 
          src="@/assets/images/logo.png" 
          alt="Logo"
          style="height: 60px; display: block; margin: 0 auto; padding-top: 10px;"
        >
      </div>
  
      <!-- Botaã back -->
      <div class="d-flex justify-content-around mb-2 mt-4" style="width: 50%;">
        <button class="btn p-0 d-flex gap-2" @click="$router.push('/dashboard')">
           <i class="bi bi-arrow-left"></i>
           <span>Página Inicial</span>
        </button>
      </div>

      <div class="text-center">
        <i class="bi bi-file-earmark-plus text-secondary" style="font-size: 5rem;"></i>
      </div>

    <!-- Botões -->
    <div class="text-center mt-4">
  
        <div class="mb-3">
            <button class="btn btn-secondary text-white mx-2" style="width:140px">
            <i class="bi bi-camera"></i> Inserir foto
            </button>
            <button class="btn btn-secondary text-white mx-2" style="width:140px">
            <i class="bi bi-image"></i> Inserir áudio
         </button>
        </div>

            <button class="btn btn-secondary text-white" style="width:140px">
            <i class="bi bi-camera-video"></i> Inserir vídeo
            </button>

            <textarea class="form-control border-secondary m-4" rows="4" placeholder="Descrição..." style="width:340px "></textarea>
            
    </div>

    <div class="fw-medium text-dark m-4 text-a" style="font-size: 23px" >Tipo de Ocorrência</div>

        <!-- Botões Baixo-->

        <div class="text-center m-1">
                <div class="d-flex justify-content-center mb-3">
                    <button class="btn btn-secondary text-white mx-2 d-flex align-items-center justify-content-center" style="width:175px">
                     <i class="bi bi-capsule-pill" style="font-size: 24px; margin-right: 8px;"></i> Falta de Material Médico
                    </button>
                    <button class="btn btn-secondary text-white mx-2 d-flex align-items-center justify-content-center" style="width:175px">
                    <i class="bi bi-trash" style="font-size: 24px; margin-right: 8px;"></i> Local Sujo 
                    </button>
                </div>

                <div class="d-flex justify-content-center mb-3">
                    <button class="btn btn-secondary text-white mx-2 d-flex align-items-center justify-content-center" style="width:175px">
                     <i class="bi bi-tools" style="font-size: 24px; margin-right: 8px;"></i> Equipamento Danificado
                    </button>
                    <button class="btn btn-secondary text-white mx-2 d-flex align-items-center justify-content-center" style="width:175px">
                    <i class="bi bi-briefcase-fill" style="font-size: 24px; margin-right: 8px;"></i> Material Fora do Lugar
                    </button>
                </div>

                <button class="btn btn-secondary text-white mt-3 fs-1 rounded-5" style="width:135px">Criar</button>
        </div>
</div>

  </template>
  
  <script>
  export default {
    name: 'CriarOcorrenciaView'
  }
  </script>