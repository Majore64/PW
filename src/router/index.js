import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/components/HomeView.vue'
import TipoOcorrenciaView from '@/components/TipoOcorrenciaView.vue'
import CriarOcorrencia from '@/components/CriarOcorrencia.vue'
import HistoricoOcorrenciasView from '@/components/HistoricoOcorrenciasView.vue'
import LoginPage from '@/components/Login.vue'

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
    path: '/login',
    name: 'Login',
    component: LoginPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
