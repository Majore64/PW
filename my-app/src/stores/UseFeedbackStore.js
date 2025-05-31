import { defineStore } from 'pinia'

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    ratings: JSON.parse(localStorage.getItem('serviceRatings')) || []
  }),
  actions: {
    addRating(rating, comment = '') {
      const newRating = {
        rating,
        comment,
        date: new Date().toISOString(),
        userId: JSON.parse(localStorage.getItem('user'))?.id
      }
      this.ratings.push(newRating)
      localStorage.setItem('serviceRatings', JSON.stringify(this.ratings))
    },
    getAverageRating() {
      if (this.ratings.length === 0) return 0
      const sum = this.ratings.reduce((total, item) => total + item.rating, 0)
      return sum / this.ratings.length
    }
  }
})
