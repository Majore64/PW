<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
     <div class="modal-content">
       <div class="modal-header bg-primary text-white">
         <h5 class="modal-title">
           <i class="bi bi-box-seam me-2"></i>
           Selecionar Materiais
         </h5>
         <button type="button" class="btn-close btn-close-white" @click="$emit('cancel')"></button>
       </div>
 
       <div class="modal-body">
         <div v-if="loading" class="text-center py-4">
           <div class="spinner-border text-primary" role="status">
             <span class="visually-hidden">Carregando...</span>
           </div>
         </div>
         
         <div v-else class="materials-list">
           <div v-if="materials.length === 0" class="alert alert-info">
             Nenhum material disponível no sistema.
           </div>
           
           <div v-for="(material, index) in materials" :key="material.id" class="material-item">
             <div class="d-flex align-items-center mb-3">
               <input
                 v-model="selectedItems[index]"
                 type="checkbox"
                 class="form-check-input me-3"
                 :disabled="material.estado !== 'Disponivel'"
               >
               <div class="flex-grow-1">
                 <span>{{ material.nomeMaterial }}</span>
                 <small class="d-block text-muted">
                   Disponível: {{ material.quantRest }} / {{ material.quantidade }}
                 </small>
               </div>
               <div class="quantity-control">
                 <input
                   v-model.number="quantities[index]"
                   type="number"
                   :min="selectedItems[index] ? 1 : 0"
                   :max="material.quantRest"
                   class="form-control quantity-input"
                   :disabled="!selectedItems[index] || material.estado !== 'Disponivel'"
                   @change="validateQuantity(index, material.quantRest)"
                   placeholder="0"
                 >
                 <span class="quantity-label">un.</span>
                 <small v-if="quantityError[index]" class="text-danger ms-2">
                   Máx: {{ material.quantRest }}
               </small>
             </div>
             </div>
           </div>
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
           :disabled="!isFormValid"
         >
           <i class="bi bi-check-circle me-2"></i>
           Confirmar ({{ selectedCount }})
         </button>
       </div>
     </div>
   </div>
 </template>
 
 <script setup>
 import { ref, computed, onMounted, watch } from 'vue'
 
 const props = defineProps({
   occurrenceType: { type: String, required: true }
 })
 
 const emit = defineEmits(['confirm', 'cancel'])
 
 // Dados reativos
 const materials = ref([])
 const loading = ref(true)
 const selectedItems = ref([])
 const quantities = ref([])
 const quantityError = ref([])
 
 // Carrega materiais do localStorage
 const loadMaterials = () => {
   try {
     const storedMaterials = localStorage.getItem('materiais')
     if (storedMaterials) {
       materials.value = JSON.parse(storedMaterials)
       selectedItems.value = new Array(materials.value.length).fill(false)
       quantities.value = new Array(materials.value.length).fill(null) // Começa com null
       quantityError.value = new Array(materials.value.length).fill(false)
     }
   } catch (error) {
     console.error('Erro ao carregar materiais:', error)
     materials.value = []
   } finally {
     loading.value = false
   }
 }
 
 // Conta itens selecionados
 const selectedCount = computed(() => {
   return selectedItems.value.filter(item => item).length
 })
 
 // Confirma seleção
 const confirmSelection = () => {
   const selectedMaterials = []
   
   materials.value.forEach((material, index) => {
     if (selectedItems.value[index]) {
       // Garante que a quantidade é válida
       const quantity = quantities.value[index] ? 
         Math.min(quantities.value[index], material.quantRest) : 
         1
       
       selectedMaterials.push({
         id: material.id,
         name: material.nomeMaterial,
         quantity: quantity,
         available: material.quantRest
       })
     }
   })
 
   emit('confirm', {
     materiais: selectedMaterials, // Mudança: equipment -> materiais
     notes: ''
   })
 }
 
 const validateQuantity = (index, maxQuantity) => {
   if (quantities.value[index] === null || quantities.value[index] === '') {
     quantityError.value[index] = false
     return
   }
   
   const numValue = Number(quantities.value[index])
   
   if (isNaN(numValue) || numValue < 1) {
     quantities.value[index] = null
     quantityError.value[index] = true
     setTimeout(() => quantityError.value[index] = false, 2000)
   } else if (numValue > maxQuantity) {
     quantities.value[index] = maxQuantity
     quantityError.value[index] = true
     setTimeout(() => quantityError.value[index] = false, 2000)
   }
 }
 
 // Nova computed property para validar o formulário
 const isFormValid = computed(() => {
   if (selectedCount.value === 0) return false
   
   for (let i = 0; i < materials.value.length; i++) {
     if (selectedItems.value[i]) {
       const quantity = quantities.value[i]
       
       // Verifica se a quantidade é válida (não nula, não vazia, entre 1 e máximo)
       if (!quantity && quantity !== 0 || 
           isNaN(quantity) || 
           quantity < 1 || 
           quantity > materials.value[i].quantRest) {
         return false
       }
     }
   }
   
   return true
 })
 
 // Watch para validar automaticamente quando as quantidades mudam
 watch([selectedItems, quantities], () => {
   validateAllQuantities()
 }, { deep: true })
 
 // Função para validar todas as quantidades
 const validateAllQuantities = () => {
   materials.value.forEach((material, index) => {
     if (selectedItems.value[index]) {
       validateQuantity(index, material.quantRest)
     }
   })
 }
 // Carrega materiais quando o componente é montado
 onMounted(loadMaterials)
 </script>
 
 <style scoped>
 /* Mantenha os mesmos estilos do seu componente original */
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
 
 .material-item {
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
 
 .text-muted {
   color: #6c757d;
   font-size: 0.8rem;
 }
 
 .text-danger {
   color: #dc3545;
   font-size: 0.75rem;
 }
 
 .btn:disabled {
   opacity: 0.65;
   cursor: not-allowed;
 }
 </style>
 