import { defineStore } from "pinia"

export const useOccurrencesStore = defineStore("ocorrencias", {
  state: () => {
    // Recupera o usuário atual do localStorage
    const currentUser = JSON.parse(localStorage.getItem("user")) || null
    const userId = currentUser?.sub || currentUser?.id

    return {
      ocorrencias: JSON.parse(localStorage.getItem("ocorrencias")) || [],
      currentUser: currentUser,
      currentUserId: userId, 
      completedCount: JSON.parse(localStorage.getItem(`completedCount_${userId}`)) || 0,
      equipmentSuggestions: {
        local_sujo: ["Esfregona", "Vassoura", "Luvas", "Aspirador", "Desinfetante"],
        equipamento_danificado: ["Ferramentas", "Peças de reposição", "Multímetro"],
        falta_material: ["Material médico", "Medicamentos", "Equipamento cirúrgico", "Luvas estéreis"],
        material_fora_lugar: ["Carrinho de transporte", "Etiquetas", "Sistema de armazenamento"],
      },
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
        alocadoA: "-",
        validado: false,
        data: new Date().toISOString(),
        numeroFuncionario: this.currentUserId,
        nomeFuncionario: this.currentUser.name,
        media: occurrence.media || null,
        equipment: occurrence.equipment || [],
        equipmentNotes: occurrence.equipmentNotes || "",
      }

      // Garantir imutabilidade
      this.ocorrencias = [...this.ocorrencias, newOccurrence]
      localStorage.setItem("ocorrencias", JSON.stringify(this.ocorrencias))
    },

    resolveOccurrence({ id, comment, proof }) {
      try {
        // Encontrar o índice da ocorrência ao invés do objeto diretamente
        const index = this.ocorrencias.findIndex((o) => o.id === id && o.numeroFuncionario === this.currentUserId)
        if (index === -1) return false

        // Criar uma cópia do array para garantir reatividade
        const updatedOccurrences = [...this.ocorrencias]

        // Atualizar a ocorrência específica
        updatedOccurrences[index] = {
          ...updatedOccurrences[index],
          resolvido: true,
          resolvedAt: new Date().toISOString(),
          resolutionComment: comment,
          resolvedBy: this.currentUserId,
          resolutionProof: proof
            ? {
                type: proof.type,
                data: proof.data,
                name: proof.name,
                uploadedAt: new Date().toISOString(),
              }
            : null,
        }

        // Atualizar o estado
        this.ocorrencias = updatedOccurrences

        // Atualizar o contador e persistir no localStorage
        this.completedCount++
        localStorage.setItem(`completedCount_${this.currentUserId}`, JSON.stringify(this.completedCount))
        localStorage.setItem("ocorrencias", JSON.stringify(this.ocorrencias))

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
      return state.ocorrencias.find((o) => o.id === Number(id) && o.numeroFuncionario === state.currentUserId)
    },

    userOccurrences: (state) => (userId) => {
      // Verifica se o userId fornecido é o mesmo do usuário atual
      if (userId !== state.currentUserId) {
        console.warn("Tentativa de acessar ocorrências de outro usuário")
        return []
      }
      return state.ocorrencias.filter((o) => o.numeroFuncionario === userId)
    },

    userPendingOccurrences: (state) => (userId) => {
      // Verifica se o userId fornecido é o mesmo do usuário atual
      if (userId !== state.currentUserId) {
        console.warn("Tentativa de acessar ocorrências pendentes de outro usuário")
        return []
      }
      return state.ocorrencias.filter((o) => !o.resolvido && o.numeroFuncionario === userId) // Mudança: !o.resolvido em vez de status === "pending"
    },

    oldestUserOccurrences:
      (state) =>
      (userId, limit = 2) => {
        // Verifica se o userId fornecido é o mesmo do usuário atual
        if (userId !== state.currentUserId) {
          console.warn("Tentativa de acessar ocorrências antigas de outro usuário")
          return []
        }
        return state.ocorrencias
          .filter((o) => o.numeroFuncionario === userId && !o.resolvido) // Mudança: !o.resolvido em vez de status === "pending"
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .slice(0, limit)
      },
  },
})
