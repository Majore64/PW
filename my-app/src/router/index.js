import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import CriarOcorrenciaView from '../views/CriarOcorrenciaView.vue'
import FinalizarOcorrenciaView from '@/views/FinalizarOcorrenciaView.vue'
import VisualizarView from '@/views/VisualizarView.vue'
import PerfilView from '@/views/PerfilView.vue'
import EditarPerfilView from '@/views/EditarPerfilView.vue'
import HistoricoView from '@/views/HistoricoView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/criar',
    name: 'criar-ocorrencia',
    component: CriarOcorrenciaView
  },
  {
    path: '/finalizar',
    name: 'finalizar-ocorrencia',
    component: FinalizarOcorrenciaView
  },
  {
    path: '/ocorrencia/:id',
    name: 'VisualizarOcorrencia', // ← Nome padronizado
    component: VisualizarView,
    props: true
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: PerfilView
  },
  {
    path: '/editar',
    name: 'editar',
    component: EditarPerfilView
  },
  {
    path: '/historico',
    name: 'historico',
    component: HistoricoView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router