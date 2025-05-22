<template>
  <div v-if="show" class="feedback-modal-overlay">
    <div class="feedback-modal">
      <div class="feedback-header">
        <h3>Avalie nosso serviço</h3>
        <button @click="close" class="close-btn">&times;</button>
      </div>
      
      <div class="rating-stars">
        <span 
          v-for="star in 5" 
          :key="star"
          @click="setRating(star)"
          :class="{ 'active': star <= currentRating }"
        >★</span>
      </div>
      
      <textarea
        v-model="comment"
        placeholder="Deixe seu comentário (opcional)..."
        class="feedback-comment"
        rows="3"
      ></textarea>
      
      <button 
        @click="submitRating"
        :disabled="currentRating === 0"
        class="submit-btn"
      >
        Enviar Avaliação
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFeedbackStore } from '@/stores/UseFeedbackStore'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])

const currentRating = ref(0)
const comment = ref('')
const feedbackStore = useFeedbackStore()

const setRating = (rating) => {
  currentRating.value = rating
}

const submitRating = () => {
  if (currentRating.value > 0) {
    feedbackStore.addRating(currentRating.value, comment.value)
    close()
  }
}

const close = () => {
  currentRating.value = 0
  comment.value = ''
  emit('close')
}
</script>

<style scoped>
.feedback-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.feedback-modal {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.feedback-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.rating-stars {
  font-size: 2.5rem;
  text-align: center;
  margin: 20px 0;
}

.rating-stars span {
  cursor: pointer;
  color: #ccc;
  margin: 0 5px;
  transition: color 0.2s;
}

.rating-stars span.active {
  color: #FFD700;
}

.feedback-comment {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 20px;
  resize: vertical;
}

.submit-btn {
  background-color: #5cbdb9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.submit-btn:not(:disabled):hover {
  background-color: #4aa8a5;
}
</style>