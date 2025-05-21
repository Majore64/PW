import { defineStore } from 'pinia'

export const useOccurrencesStore = defineStore('occurrences', {
  state: () => ({
    occurrences: JSON.parse(localStorage.getItem('occurrences')) || [],
    currentUser: JSON.parse(localStorage.getItem('user')) || null,
    completedCount: JSON.parse(localStorage.getItem(`completedCount_${JSON.parse(localStorage.getItem('user'))?.id}`)) || 0,
    equipmentSuggestions: {
      local_sujo: ['Esfregona', 'Vassoura', 'Luvas', 'Aspirador', 'Desinfetante'],
      equipamento_danificado: ['Ferramentas', 'Peças de reposição', 'Multímetro'],
      falta_material: ['Material médico', 'Medicamentos', 'Equipamento cirúrgico', 'Luvas estéreis'],
      material_fora_lugar: ['Carrinho de transporte', 'Etiquetas', 'Sistema de armazenamento']
    }
  }),
  actions: {
    addOccurrence(occurrence) {
      const newOccurrence = {
        ...occurrence,
        id: Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        createdBy: this.currentUser.id,
        createdByName: this.currentUser.name,
        media: occurrence.media || null,
        equipment: occurrence.equipment || [],
        equipmentNotes: occurrence.equipmentNotes || ''
      }
      this.occurrences.push(newOccurrence)
      localStorage.setItem('occurrences', JSON.stringify(this.occurrences))
    },
    resolveOccurrence({ id, comment, proof }) {
      try {
        const occurrence = this.occurrences.find(o => o.id === id)
        if (!occurrence) return false

        occurrence.status = 'resolved'
        occurrence.resolvedAt = new Date().toISOString()
        occurrence.resolutionComment = comment
        occurrence.resolvedBy = this.currentUser.id
        
        if (proof) {
          occurrence.resolutionProof = {
            type: proof.type,
            data: proof.data,
            name: proof.name,
            uploadedAt: new Date().toISOString()
          }
        }
        
        this.completedCount++
        const userId = this.currentUser?.id
        if (userId) {
          localStorage.setItem(`completedCount_${userId}`, JSON.stringify(this.completedCount))
        }
        localStorage.setItem('occurrences', JSON.stringify(this.occurrences))
        
        console.log(`Ocorrência ${id} finalizada. Contador: ${this.completedCount}`)
        return this.completedCount % 3 === 0
      } catch (error) {
        console.error('Erro ao finalizar ocorrência:', error)
        return false
      }
    },
    resetCompletedCount() {
      const userId = this.currentUser?.id
      this.completedCount = 0
      if (userId) {
        localStorage.setItem(`completedCount_${userId}`, JSON.stringify(0))
      }
    }
  },
  getters: {
    getOccurrenceById: (state) => (id) => {
      return state.occurrences.find(o => o.id === Number(id))
    },
    userOccurrences: (state) => (userId) => {
      return state.occurrences.filter(o => o.createdBy === userId)
    },
    userPendingOccurrences: (state) => (userId) => {
      return state.occurrences.filter(o => o.status === 'pending' && o.createdBy === userId)
    },
    oldestUserOccurrences: (state) => (userId, limit = 2) => {
      return state.occurrences
        .filter(o => o.createdBy === userId && o.status === 'pending')
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .slice(0, limit)
    }
  }
})