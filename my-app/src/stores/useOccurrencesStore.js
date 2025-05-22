import { defineStore } from 'pinia'

export const useOccurrencesStore = defineStore('occurrences', {
  state: () => {
    // Recupera o usuário atual do localStorage
    const currentUser = JSON.parse(localStorage.getItem('user')) || null;
    const userId = currentUser?.sub || currentUser?.id;
    
    return {
      occurrences: JSON.parse(localStorage.getItem('occurrences')) || [],
      currentUser: currentUser,
      currentUserId: userId, // Armazena o ID do usuário explicitamente
      completedCount: JSON.parse(localStorage.getItem(`completedCount_${userId}`)) || 0,
      equipmentSuggestions: {
        local_sujo: ['Esfregona', 'Vassoura', 'Luvas', 'Aspirador', 'Desinfetante'],
        equipamento_danificado: ['Ferramentas', 'Peças de reposição', 'Multímetro'],
        falta_material: ['Material médico', 'Medicamentos', 'Equipamento cirúrgico', 'Luvas estéreis'],
        material_fora_lugar: ['Carrinho de transporte', 'Etiquetas', 'Sistema de armazenamento']
      }
    }
  },
  actions: {
    // Atualiza o usuário atual
    setCurrentUser(user) {
      this.currentUser = user;
      this.currentUserId = user?.sub || user?.id;
      localStorage.setItem('user', JSON.stringify(user));
    },
    
    addOccurrence(occurrence) {
  const newOccurrence = {
    ...occurrence,
    id: Date.now(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    createdBy: this.currentUserId,
    createdByName: this.currentUser.name,
    media: occurrence.media || null,
    equipment: occurrence.equipment || [],
    equipmentNotes: occurrence.equipmentNotes || ''
  };
  
  // Garantir imutabilidade
  this.occurrences = [...this.occurrences, newOccurrence];
  localStorage.setItem('occurrences', JSON.stringify(this.occurrences));
},
    
    resolveOccurrence({ id, comment, proof }) {
  try {
    // Encontrar o índice da ocorrência ao invés do objeto diretamente
    const index = this.occurrences.findIndex(o => o.id === id && o.createdBy === this.currentUserId);
    if (index === -1) return false;

    // Criar uma cópia do array para garantir reatividade
    const updatedOccurrences = [...this.occurrences];
    
    // Atualizar a ocorrência específica
    updatedOccurrences[index] = {
      ...updatedOccurrences[index],
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
      resolutionComment: comment,
      resolvedBy: this.currentUserId,
      resolutionProof: proof ? {
        type: proof.type,
        data: proof.data,
        name: proof.name,
        uploadedAt: new Date().toISOString()
      } : null
    };

    // Atualizar o estado
    this.occurrences = updatedOccurrences;
    
    // Atualizar o contador e persistir no localStorage
    this.completedCount++;
    localStorage.setItem(`completedCount_${this.currentUserId}`, JSON.stringify(this.completedCount));
    localStorage.setItem('occurrences', JSON.stringify(this.occurrences));
    
    console.log(`Ocorrência ${id} finalizada. Contador: ${this.completedCount}`);
    return this.completedCount % 3 === 0;
  } catch (error) {
    console.error('Erro ao finalizar ocorrência:', error);
    return false;
  }
},
    
    resetCompletedCount() {
      this.completedCount = 0
      localStorage.setItem(`completedCount_${this.currentUserId}`, JSON.stringify(0))
    }
  },
  getters: {
    // Garante que só retorne ocorrências do usuário atual
    getOccurrenceById: (state) => (id) => {
      return state.occurrences.find(o => o.id === Number(id) && o.createdBy === state.currentUserId)
    },
    
    userOccurrences: (state) => (userId) => {
      // Verifica se o userId fornecido é o mesmo do usuário atual
      if (userId !== state.currentUserId) {
        console.warn('Tentativa de acessar ocorrências de outro usuário');
        return [];
      }
      return state.occurrences.filter(o => o.createdBy === userId)
    },
    
    userPendingOccurrences: (state) => (userId) => {
      // Verifica se o userId fornecido é o mesmo do usuário atual
      if (userId !== state.currentUserId) {
        console.warn('Tentativa de acessar ocorrências pendentes de outro usuário');
        return [];
      }
      return state.occurrences.filter(o => o.status === 'pending' && o.createdBy === userId)
    },
    
    oldestUserOccurrences: (state) => (userId, limit = 2) => {
      // Verifica se o userId fornecido é o mesmo do usuário atual
      if (userId !== state.currentUserId) {
        console.warn('Tentativa de acessar ocorrências antigas de outro usuário');
        return [];
      }
      return state.occurrences
        .filter(o => o.createdBy === userId && o.status === 'pending')
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .slice(0, limit)
    }
  }
})