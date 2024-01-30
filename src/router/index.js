import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue';
import InicioView from '@/views/InicioView.vue';
import { middleware } from '@/http/middleware/middleware';
import authExpiration from '@/http/middleware/authExpiration';
import redirectIfAuthenticated from '@/http/middleware/redirectIfAuthenticated';
import authenticate from '@/http/middleware/authenticate';
import ProfileView from '@/views/ProfileView.vue';
import NotFound from '@/views/NotFound.vue';

const routes = [
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    meta: {
      requireAuth: true
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectIfAuthenticated),
      middleware(authenticate),
    ]
  },

  {
    path: '/',
    name: 'n-login',
    component: LoginView,
    meta: {
      requireAuth: false
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectIfAuthenticated),
      middleware(authenticate),
    ]
  },

  {
    path: '/perfil',
    name: 'n-perfil',
    component: ProfileView,
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectIfAuthenticated),
      middleware(authenticate),
    ],
  },

  {
    path: '/inicio',
    name: 'n-inicio',
    component: InicioView,
    meta: {
      requireAuth: true
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectIfAuthenticated),
      middleware(authenticate),
    ]
  },

  {
    path: '/deposito/:ciudad',
    name: 'n-deposito',
    component: () => import(/* webpackChunkName: "DepositoView" */'@/views/DepositoView.vue'),
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectIfAuthenticated),
      middleware(authenticate),
    ],
  },

  {
    path: '/compra',
    name: 'n-compra',
    component: () => import(/* webpackChunkName: "CompraView" */'@/views/CompraView.vue'),
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectIfAuthenticated),
      middleware(authenticate),
    ],
  },

  {
    path: '/compra/:ciudad',
    name: 'n-compra',
    component: () => import(/* webpackChunkName: "CompraView" */'@/views/CompraView.vue'),
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectIfAuthenticated),
      middleware(authenticate),
    ],
  },

  {
    path: '/producto',
    name: 'n-producto',
    component: () => import(/* webpackChunkName: "ProductoView" */'@/views/ProductoView.vue'),
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectIfAuthenticated),
      middleware(authenticate),
    ],
  },

  {
    path: '/grupo/:ciudad',
    name: 'n-grupo',
    component: () => import(/* webpackChunkName: "GrupoView" */'@/views/GrupoView.vue'),
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectIfAuthenticated),
      middleware(authenticate),
    ],
  },

  {
    path: '/cliente/:ciudad',
    name: 'n-cliente',
    component: () => import(/* webpackChunkName: "ClienteView" */'@/views/ClienteView.vue'),
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectIfAuthenticated),
      middleware(authenticate),
    ],
  },

];//routes

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
