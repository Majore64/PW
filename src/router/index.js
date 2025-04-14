import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/components/HomeView.vue'
import TipoOcorrenciaView from '@/components/TipoOcorrenciaView.vue'
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
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router