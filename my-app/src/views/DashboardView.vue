<template>
  <div class="dashboard-view">
    <header class="bg-primary text-white p-3 text-center">
      <h1 class="h5 mb-0">Nº {{ occurrences.length }} OCORRÊNCIAS PENDENTES</h1>
    </header>

    <main class="p-3">
      <OccurrenceCard 
        v-for="(occ, index) in occurrences"
        :key="index"
        :title="occ.title"
        :location="occ.location"
      />
    </main>

    <nav class="bottom-nav bg-white border-top p-2 d-flex justify-content-around">
      <NavButton icon="plus-circle" text="Criar" />
      <NavButton icon="check-circle" text="Finalizar" />
      <NavButton icon="pencil" text="Editar" />
      <NavButton icon="clock-history" text="Histórico" />
      <NavButton icon="person" text="Perfil" />
    </nav>
  </div>
</template>

<script>
import OccurrenceCard from '@/components/OccurrenceCard.vue'
import NavButton from '@/components/NavButton.vue'

export default {
  components: { OccurrenceCard, NavButton },
  data() {
    return {
      occurrences: [
        { title: "Material Fora do Lugar", location: "Piso 4, Sala - 2" },
        { title: "Material Fora do Lugar", location: "Piso 2, Sala - 4" }
      ]
    }
  }
}
</script>