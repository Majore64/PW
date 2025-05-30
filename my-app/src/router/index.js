import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue')
  },
  {
    path: '/criar',
    name: 'criar-ocorrencia',
    component: () => import('@/views/CriarOcorrenciaView.vue')
  },
  // Rota mais específica primeiro
  {
    path: '/ocorrencia/:id',
    name: 'VisualizarOcorrencia',
    component: () => import('@/views/VisualizarView.vue'),
    props: true
  },
  {
    path: '/finalizar/ocorrencia/:id',
    name: 'FinalizarForm',
    component: () => import('@/views/FinalizarFormView.vue'),
    props: true
  },
  {
    path: '/finalizar',
    name: 'ListaFinalizacao',
    component: () => import('@/views/FinalizarOcorrenciaView.vue')
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: () => import('@/views/PerfilView.vue')
  },
  {
    path: '/editar',
    name: 'editar',
    component: () => import('@/views/EditarPerfilView.vue')
  },
  {
    path: '/historico',
    name: 'historico',
    component: () => import('@/views/HistoricoView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router