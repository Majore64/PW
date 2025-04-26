import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/components/HomeView.vue'
import TipoOcorrenciaView from '@/components/TipoOcorrenciaView.vue'
import CriarOcorrencia from '@/components/CriarOcorrencia.vue'
import HistoricoOcorrenciasView from '@/components/HistoricoOcorrenciasView.vue'
import LoginPage from "@/components/Login.vue";

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
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: EmptyLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: LoginPage,
      },
    ],
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (to.meta.requiresAuth && !user) {
    next('/login');
  }
  else if (to.path === '/login' && user) {
    next('/');
  }
  else {
    next();
  }
})

export default router
