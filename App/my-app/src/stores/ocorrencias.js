import { defineStore } from 'pinia'

export const useOcorrenciasStore = defineStore('ocorrencias', {
  state: () => ({
    ocorrencias: JSON.parse(localStorage.getItem('ocorrencias') || '[]')
  }),
  actions: {
    adicionarOcorrencia(ocorrencia) {
      ocorrencia.materiais = ocorrencia.materiais || [];
      const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias') || '[]');
      ocorrencias.push(ocorrencia);
      localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));
      this.ocorrencias = ocorrencias; // Atualiza o estado da store!
    }
  }
})