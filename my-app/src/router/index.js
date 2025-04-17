import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import CriarOcorrenciaView from '../views/CriarOcorrenciaView.vue' // Novo import
import FinalizarOcorrenciaView from '@/views/FinalizarOcorrenciaView.vue'
import VizualizarView from '@/views/VizualizarView.vue'
import PerfilView from '@/views/PerfilView.vue'


const routes = [
  { path: '/', component: LoginView },
  { path: '/dashboard', component: DashboardView },
  { path: '/criar', component: CriarOcorrenciaView }, 
  { path: '/finalizar', component: FinalizarOcorrenciaView },
  { path: '/vizualizar', component: VizualizarView },
  { path: '/perfil', component: PerfilView },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router