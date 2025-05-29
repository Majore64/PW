<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title">
          <i class="bi bi-tools me-2"></i>
          Materiais para {{ formattedType }}
        </h5>
        <button type="button" class="btn-close btn-close-white" @click="$emit('cancel')"></button>
      </div>

      <div class="modal-body">
        <div class="equipment-list">
          <div v-for="(item, index) in equipmentOptions" :key="index" class="equipment-item">
            <div class="d-flex align-items-center mb-3">
              <input
                v-model="selectedItems[index]"
                type="checkbox"
                class="form-check-input me-3"
              >
              <span class="flex-grow-1">{{ item }}</span>
              <div class="quantity-control">
                <input
                  v-model.number="quantities[index]"
                  type="number"
                  min="1"
                  class="form-control quantity-input"
                  :disabled="!selectedItems[index]"
                >
                <span class="quantity-label">un.</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <label class="form-label fw-bold">
            <i class="bi bi-chat-left-text me-2"></i>
            Observações:
          </label>
          <textarea
            v-model="additionalNotes"
            class="form-control"
            rows="3"
            placeholder="Ex: Necessário urgência na entrega..."
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" @click="$emit('cancel')">
          <i class="bi bi-x-circle me-2"></i>
          Cancelar
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="confirmSelection"
          :disabled="selectedCount === 0"
        >
          <i class="bi bi-check-circle me-2"></i>
          Confirmar ({{ selectedCount }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useOccurrencesStore } from '@/stores/useOccurrencesStore'

const props = defineProps({
  occurrenceType: { type: String, required: true }
})

const emit = defineEmits(['confirm', 'cancel'])

const store = useOccurrencesStore()
const additionalNotes = ref('')

// Arrays reativos para controle
const selectedItems = ref([])
const quantities = ref([])

// Inicializa os arrays quando as opções mudam
watch(() => store.equipmentSuggestions[props.occurrenceType], (newVal) => {
  selectedItems.value = new Array(newVal.length).fill(false)
  quantities.value = new Array(newVal.length).fill(1)
}, { immediate: true })

const equipmentOptions = computed(() => {
  return store.equipmentSuggestions[props.occurrenceType] || []
})

const formattedType = computed(() => {
  const types = {
    local_sujo: 'Limpeza',
    equipamento_danificado: 'Reparo',
    falta_material: 'Reposição Médica',
    material_fora_lugar: 'Organização'
  }
  return types[props.occurrenceType] || props.occurrenceType
})

const selectedCount = computed(() => {
  return selectedItems.value.filter(item => item).length
})

const confirmSelection = () => {
  const selectedEquipment = []
  
  equipmentOptions.value.forEach((item, index) => {
    if (selectedItems.value[index]) {
      selectedEquipment.push({
        name: item,
        quantity: quantities.value[index] || 1
      })
    }
  })

  emit('confirm', {
    equipment: selectedEquipment,
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
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 1rem 1.5rem;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex-grow: 1;
}

.modal-footer {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.equipment-item {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-input {
  width: 70px;
  text-align: center;
}

.quantity-label {
  color: #6c757d;
  font-size: 0.875rem;
}

.form-check-input {
  width: 1.2em;
  height: 1.2em;
}

.btn {
  padding: 0.5rem 1.25rem;
  font-weight: 500;
}
</style>