<template>
  <div class="finalize-card bg-white rounded-4 border border-secondary mb-3">
    <!-- Corpo principal (clicável para detalhes) -->
    <div class="card-body" @click="goToDetails">
      <div class="d-flex align-items-center">
        <i :class="typeIcon" class="fs-1 ps-2 pe-3 text-primary"></i>
        <div class="text-truncate">
          <h5 class="m-0 text-dark">{{ formattedType }}</h5>
          <p class="m-0 text-muted small">{{ occurrence.createdByName }}</p>
          <p class="m-0 text-muted small">{{ occurrence.location }}</p>
        </div>
      </div>
    </div>

    <!-- Botão de ação (não herda o click do pai) -->
    <div class="card-footer ps-2 pe-2 pb-2 text-center">
      <button 
        @click.stop="goToFinalize"
        class="btn btn-sm btn-outline-primary w-100"
      >
        Finalizar
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const props = defineProps({
  occurrence: { type: Object, required: true }
});

const router = useRouter();

// Reutiliza lógica de ícones e formatação do OccurrenceCard existente
const typeIcon = computed(() => {
  const icons = {
    'falta_material': 'bi bi-capsule-pill',
    'local_sujo': 'bi bi-trash',
    'equipamento_danificado': 'bi bi-tools',
    'material_fora_lugar': 'bi bi-briefcase-fill'
  };
  return icons[props.occurrence.type] || 'bi bi-exclamation-circle';
});

const formattedType = computed(() => {
  const types = {
    'falta_material': 'Falta de Material',
    'local_sujo': 'Local Sujo',
    'equipamento_danificado': 'Equip. Danificado',
    'material_fora_lugar': 'Material Fora do Lugar'
  };
  return types[props.occurrence.type] || props.occurrence.type;
});

const goToDetails = () => {
  router.push({ name: 'VisualizarOcorrencia', params: { id: props.occurrence.id } });
};

const goToFinalize = () => {
  router.push({
    name: 'FinalizarForm', 
    params: { id: props.occurrence.id }
  });
};
</script>

<style scoped>
.finalize-card {
  cursor: pointer;
  transition: all 0.2s;
}
.finalize-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.card-body {
  padding: 1rem;
}
.card-footer {
  border-top: 1px dashed #dee2e6 !important;
}
</style>