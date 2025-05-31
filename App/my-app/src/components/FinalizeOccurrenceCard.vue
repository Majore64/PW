<template>
  <div class="card">
    <div class="card-body" @click="goToDetails">
      <h5 class="card-title">{{ formattedType }}</h5>
      <p class="card-text">Criado por: {{ occurrence.createdByName }}</p>
      <p class="card-text">Localização: {{ occurrence.location }}</p>
      <button 
        @click.stop="goToFinalize"
        class="btn btn-primary"
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

const formattedType = computed(() => {
  const types = {
    'falta_material': 'Falta de Material',
    'local_sujo': 'Local Sujo',
    'equipamento_danificado': 'Equipamento Danificado',
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
.card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #5cbdb9;
  border-color: #5cbdb9;
}
</style>