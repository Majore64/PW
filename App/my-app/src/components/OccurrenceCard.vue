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
        <h5 class="text-white fs-6 fw-light m-0">{{ occurrence.location }}</h5>
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
        'falta_material': 'Falta Material',
        'local_sujo': 'Local Sujo',
        'equipamento_danificado': 'Equip. Danificado', // Texto reduzido
        'material_fora_lugar': 'Material Fora Lugar'
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