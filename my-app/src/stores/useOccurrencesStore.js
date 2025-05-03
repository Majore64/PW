import { defineStore } from 'pinia'

export const useOccurrencesStore = defineStore('occurrences', {
    state: () => ({
      occurrences: JSON.parse(localStorage.getItem('occurrences')) || [],
      currentUser: JSON.parse(localStorage.getItem('user')) || null
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
          media: occurrence.media || null
        }
        this.occurrences.push(newOccurrence)
        localStorage.setItem('occurrences', JSON.stringify(this.occurrences))
      },
      resolveOccurrence(id) {
        const occurrence = this.occurrences.find(o => o.id === id)
        if (occurrence) {
          occurrence.status = 'resolved'
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