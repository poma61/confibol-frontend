import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue';
import InicioView from '@/views/InicioView.vue';

const routes = [
  {
    path: '/',
    name: 'n-login',
    component: LoginView,
    meta: {
      requireAuth: false
    }
  },

  {
    path: '/inicio',
    name: 'n-inicio',
    component: InicioView,
    meta: {
      requireAuth: true
    }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
