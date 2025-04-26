import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/components/HomeView.vue'
import TipoOcorrenciaView from '@/components/TipoOcorrenciaView.vue'
import CriarOcorrencia from '@/components/CriarOcorrencia.vue'
import HistoricoOcorrenciasView from '@/components/HistoricoOcorrenciasView.vue'
import DetalhesOcorrenciaView from '@/components/DetalhesOcorrenciaView.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  
  {
    path: '/tipo-ocorrencia',
    name: 'TipoOcorrencia',
    component: TipoOcorrenciaView
  },
  {
    path: '/criar-ocorrencia',
    name: 'CriarOcorrencia',
    component: CriarOcorrencia
  },
  {
    path: '/historico',
    name: 'Historico',
    component: HistoricoOcorrenciasView
  },
  {
    path: '/detalhes/:id', // <-- NOVA ROTA
    name: 'DetalhesOcorrencia',
    component: DetalhesOcorrenciaView
  }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
