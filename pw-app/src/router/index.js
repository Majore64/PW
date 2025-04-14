import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import EmptyLayout from '@/layouts/EmptyLayout.vue';
import LoginPage from "@/components/Login.vue";
import Funcionarios from "@/components/Funcionarios.vue";
import Ocorrencias from "@/components/Ocorrencias.vue";
import Estatisticas from "@/components/Estatisticas.vue";
import Historico from "@/components/Historico.vue";
import Definicoes from "@/components/Definicoes.vue";

const routes = [
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
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { 
        path: 'funcionarios', 
        name: 'Funcionarios',
        component: Funcionarios 
      },
      { 
        path: 'ocorrencias', 
        name: 'Ocorrencias',
        component: Ocorrencias 
      },
      { 
        path: 'estatisticas', 
        name: 'Estatisticas',
        component: Estatisticas 
      },
      { 
        path: 'historico', 
        name: 'Historico',
        component: Historico 
      },
      { 
        path: 'definicoes', 
        name: 'Definicoes',
        component: Definicoes 
      },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    redirect: '/funcionarios' // Página inicial padrão
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

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
});

export default router;