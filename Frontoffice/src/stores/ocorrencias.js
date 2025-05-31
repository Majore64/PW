import { defineStore } from 'pinia'

export const useOcorrenciasStore = defineStore('ocorrencias', {
  state: () => ({
    ocorrencias: []
  }),
  actions: {
    adicionarOcorrencia(ocorrencia) {
      // Ensure materials is an array
      ocorrencia.materiais = ocorrencia.materiais || [];

      // Get existing occurrences
      const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias') || '[]');

      // Add new occurrence
      ocorrencias.push(ocorrencia);

      // Save to localStorage
      localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));

      // Update store state
      this.ocorrencias = ocorrencias;

      console.log('Ocorrência salva com materiais:', ocorrencia.materiais);
    }
  }
})
