<template>
  <div 
    class="occurrence-card rounded-4 bg-secondary m-2 mt-3  "
    @click="handleClick"
  >
    <div class="card-body p-2 d-flex align-items-center">
      <!-- Ícone à esquerda -->
      <i :class="typeIcon" class="fs-1 text-white ps-2 pe-3"></i>
      
      <!-- Textos -->
      <div>
        <h5 class="text-white fs-4 fw-normal m-0">{{ formattedType }}</h5>
        <h5 class="text-white fs-6 fw-light m-0">{{ occurrence.location }}</h5> <!-- fw-light para fonte mais fina -->
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
        'falta_material': 'bi bi-capsule-pill',
        'local_sujo': 'bi bi-trash',
        'equipamento_danificado': 'bi bi-tools',
        'material_fora_lugar': 'bi bi-briefcase-fill'
      }
      return icons[this.occurrence.type] || 'bi bi-exclamation-circle'
    },
    formattedType() {
      const types = {
        'falta_material': 'Falta de Material Médico',
        'local_sujo': 'Local Sujo',
        'equipamento_danificado': 'Equipamento Danificado',
        'material_fora_lugar': 'Material Fora do Lugar'
      }
      return types[this.occurrence.type] || this.occurrence.type
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
}

.occurrence-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Ajuste fino no alinhamento vertical */
.card-body {
  padding: 0.6rem 0.5rem !important;
}
</style>  