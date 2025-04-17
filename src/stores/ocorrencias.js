import { defineStore } from 'pinia'

export const useOcorrenciasStore = defineStore('ocorrencias', {
  state: () => ({
    lista: JSON.parse(localStorage.getItem('ocorrencias')) || []
  }),
  actions: {
    adicionarOcorrencia(ocorrencia) {
      this.lista.push(ocorrencia)
      localStorage.setItem('ocorrencias', JSON.stringify(this.lista))
    }
  }
})
