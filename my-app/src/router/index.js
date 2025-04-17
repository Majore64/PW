import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import CriarOcorrenciaView from '../views/CriarOcorrenciaView.vue' // Novo import

const routes = [
  { path: '/', component: LoginView },
  { path: '/dashboard', component: DashboardView },
  { path: '/criar', component: CriarOcorrenciaView } // Nova rota
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router