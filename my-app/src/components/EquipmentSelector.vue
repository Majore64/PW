<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          Equipamentos para {{ formattedType }}
        </h5>
        <button type="button" class="btn-close" @click="$emit('cancel')"></button>
      </div>

      <div class="modal-body">
        <div class="equipment-list">
          <div v-for="(item, index) in equipmentOptions" :key="index" class="form-check">
            <input
              v-model="selectedEquipment"
              :value="item"
              type="checkbox"
              :id="'equip-' + index"
              class="form-check-input"
            >
            <label :for="'equip-' + index" class="form-check-label">
              {{ item }}
            </label>
          </div>
        </div>

        <div class="mt-4">
          <label class="form-label fw-bold">Observações:</label>
          <textarea
            v-model="additionalNotes"
            class="form-control"
            rows="3"
            placeholder="Ex: Carrinho..."
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" @click="$emit('cancel')">
          Cancelar
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="confirmSelection"
          :disabled="selectedEquipment.length === 0"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOccurrencesStore } from '@/stores/useOccurrencesStore'

const props = defineProps({
  occurrenceType: { type: String, required: true }
})

const emit = defineEmits(['confirm', 'cancel'])

const store = useOccurrencesStore()
const selectedEquipment = ref([])
const additionalNotes = ref('')

const equipmentOptions = computed(() => {
  return store.equipmentSuggestions[props.occurrenceType] || []
})

const formattedType = computed(() => {
  const types = {
    local_sujo: 'Limpeza',
    equipamento_danificado: 'Reparo',
    falta_material: 'Reposição',
    material_fora_lugar: 'Organização'
  };
  return types[props.occurrenceType] || props.occurrenceType;
});

const confirmSelection = () => {
  emit('confirm', {
    equipment: selectedEquipment.value,
    notes: additionalNotes.value
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.equipment-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 1.25rem;
}

.form-check {
  padding: 0.5rem;
  margin-bottom: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.form-check:hover {
  background-color: #f8f9fa;
}
</style>