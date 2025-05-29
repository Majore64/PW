import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/components/HomeView.vue'
import TipoOcorrenciaView from '@/components/TipoOcorrenciaView.vue'
import CriarOcorrencia from '@/components/CriarOcorrencia.vue'
import HistoricoOcorrenciasView from '@/components/HistoricoOcorrenciasView.vue'
import DetalhesOcorrenciaView from '@/components/DetalhesOcorrenciaView.vue'
import Login from '@/components/Login.vue'
import ChatBot from '@/components/ChatBot.vue'





const routes = [
  
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/chatbot',
    name: 'ChatBot',
    component: ChatBot  
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
    path: '/detalhes/:id',
    name: 'DetalhesOcorrencia',
    component: () => import('@/components/DetalhesOcorrenciaView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
