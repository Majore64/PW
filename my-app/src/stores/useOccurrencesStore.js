import { defineStore } from "pinia"

export const useOccurrencesStore = defineStore("occurrences", {
  state: () => {
    // Recupera o usuário atual do localStorage
    const currentUser = JSON.parse(localStorage.getItem("user")) || null
    const userId = currentUser?.sub || currentUser?.id

    return {
      occurrences: JSON.parse(localStorage.getItem("occurrences")) || [],
      currentUser: currentUser,
      currentUserId: userId,
      completedCount: JSON.parse(localStorage.getItem(`completedCount_${userId}`)) || 0,
    }
  },
  actions: {
    // Atualiza o usuário atual
    setCurrentUser(user) {
      this.currentUser = user
      this.currentUserId = user?.sub || user?.id
      localStorage.setItem("user", JSON.stringify(user))
    },

    addOccurrence(occurrence) {
      const newOccurrence = {
        ...occurrence,
        id: Date.now(),
        resolvido: false,
        validado: false,
        data: new Date().toISOString(),
        numeroFuncionario: this.currentUserId,
        nomeFuncionario: this.currentUser.name,
        media: occurrence.media || null,
        materiais: occurrence.materiais || [],
        tipoOcorrencia: occurrence.tipoOcorrencia,
        localizacao: occurrence.localizacao,
      }

      // Garantir imutabilidade
      this.occurrences = [...this.occurrences, newOccurrence]
      localStorage.setItem("ocorrencias", JSON.stringify(this.occurrences))
    },

    resolveOccurrence({ id, comment, proof }) {
      try {
        // Encontrar o índice da ocorrência ao invés do objeto diretamente
        const index = this.occurrences.findIndex((o) => o.id === id && o.numeroFuncionario === this.currentUserId)
        if (index === -1) return false

        // Criar uma cópia do array para garantir reatividade
        const updatedOccurrences = [...this.occurrences]

        // Atualizar a ocorrência específica
        updatedOccurrences[index] = {
          ...updatedOccurrences[index],
          resolvido: true,
          resolvedAt: new Date().toISOString(),
          resolutionComment: comment,
          resolvedBy: this.currentUserId,
          resolutionProof: proof
            ? {
                tipoOcorrencia: proof.tipoOcorrencia,
                data: proof.data,
                name: proof.name,
                uploadedAt: new Date().toISOString(),
              }
            : null,
        }

        // Atualizar o estado
        this.occurrences = updatedOccurrences

        // Atualizar o contador e persistir no localStorage
        this.completedCount++
        localStorage.setItem(`completedCount_${this.currentUserId}`, JSON.stringify(this.completedCount))
        localStorage.setItem("occurrences", JSON.stringify(this.occurrences))

        console.log(`Ocorrência ${id} finalizada. Contador: ${this.completedCount}`)
        return this.completedCount % 3 === 0
      } catch (error) {
        console.error("Erro ao finalizar ocorrência:", error)
        return false
      }
    },

    resetCompletedCount() {
      this.completedCount = 0
      localStorage.setItem(`completedCount_${this.currentUserId}`, JSON.stringify(0))
    },

    // Método de logout
    logout() {
      // Limpar o usuário atual
      this.currentUser = null
      this.currentUserId = null

      // Remover dados do localStorage relacionados ao usuário
      localStorage.removeItem("user")

      console.log("Usuário deslogado com sucesso")
    },
  },
  getters: {
    // Garante que só retorne ocorrências do usuário atual
    getOccurrenceById: (state) => (id) => {
      return state.occurrences.find((o) => o.id === Number(id) && o.numeroFuncionario === state.currentUserId)
    },

    userOccurrences: (state) => (userId) => {
      // Verifica se o userId fornecido é o mesmo do usuário atual
      if (userId !== state.currentUserId) {
        console.warn("Tentativa de acessar ocorrências de outro usuário")
        return []
      }
      return state.occurrences.filter((o) => o.numeroFuncionario === userId)
    },

    userPendingOccurrences: (state) => (userId) => {
      // Verifica se o userId fornecido é o mesmo do usuário atual
      if (userId !== state.currentUserId) {
        console.warn("Tentativa de acessar ocorrências pendentes de outro usuário")
        return []
      }
      return state.occurrences.filter((o) => !o.resolvido && o.numeroFuncionario === userId)
    },

    oldestUserOccurrences:
      (state) =>
      (userId, limit = 2) => {
        // Verifica se o userId fornecido é o mesmo do usuário atual
        if (userId !== state.currentUserId) {
          console.warn("Tentativa de acessar ocorrências antigas de outro usuário")
          return []
        }
        return state.occurrences
          .filter((o) => o.numeroFuncionario === userId && !o.resolvido)
          .sort((a, b) => new Date(a.data) - new Date(b.data))
          .slice(0, limit)
      },
  },
})
