import { defineStore } from 'pinia'

export const useOccurrencesStore = defineStore('occurrences', {
  state: () => ({
    occurrences: JSON.parse(localStorage.getItem('occurrences')) || [],
    currentUser: JSON.parse(localStorage.getItem('user')) || null,
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
      const occurrence = this.occurrences.find(o => o.id === id)
      if (occurrence) {
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
        localStorage.setItem('occurrences', JSON.stringify(this.occurrences))
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