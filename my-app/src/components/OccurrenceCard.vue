<template>
  <div 
    class="occurrence-card rounded-4 bg-secondary m-2 mt-3"
    @click="handleClick"
  >
    <div class="card-body p-2 d-flex align-items-center">
      <!-- Ícone à esquerda -->
      <i :class="typeIcon" class="fs-1 text-white ps-2 pe-3"></i>
      
      <!-- Textos -->
      <div class="text-nowrap overflow-hidden">
        <h5 class="text-white fs-5 fw-normal m-0 text-truncate">{{ formattedType }}</h5>
        <h5 class="text-white fs-6 fw-light m-0">{{ occurrence.localizacao }}</h5>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OccurrenceCard',
  props: {
    occurrence: {
      type: Object,
      required: true
    }
  },
  computed: {
    typeIcon() {
      const icons = {
        'Material mal alocado': 'bi bi-briefcase-fill',
        'Material em falta': 'bi bi-capsule-pill',
        'Limpeza necessária': 'bi bi-trash',
      }
      // Usar tipoOcorrencia em vez de type
      return icons[this.occurrence.tipoOcorrencia] || 'bi bi-exclamation-circle'
    },
    formattedType() {
      const types = {
        'Material mal alocado': 'Material Mal Alocado',
        'Material em falta': 'Material em Falta',
        'Limpeza necessária': 'Limpeza Necessária',
      }
      // Usar tipoOcorrencia em vez de type
      return types[this.occurrence.tipoOcorrencia] || this.occurrence.tipoOcorrencia
    }
  },
  methods: {
    handleClick() {
      this.$router.push({
        name: 'VisualizarOcorrencia',
        params: { id: this.occurrence.id }
      })
    }
  }
}
</script>

<style scoped>
.occurrence-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 280px;
}

.occurrence-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 0.6rem 0.5rem !important;
  width: 100%;
}

.text-nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
