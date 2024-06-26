import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue';
import InicioView from '@/views/InicioView.vue';
import { middleware } from '@/http/middleware/middleware';
import authExpiration from '@/http/middleware/authExpiration';
import redirectIfAuthenticated from '@/http/middleware/redirectIfAuthenticated';
import authenticate from '@/http/middleware/authenticate';
import checkRole from '@/http/middleware/checkRole';
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
      middleware(authenticate),
    ]
  },

  {
    path: '/',
    name: 'n-login',
    component: LoginView,
    beforeEnter: [
      middleware(redirectIfAuthenticated),
    ],
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
      middleware(authenticate),
      middleware(checkRole, ['administrador'])
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
      middleware(authenticate),
      middleware(checkRole, ['administrador'])
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
      middleware(authenticate),
      middleware(checkRole, ['administrador'])
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
      middleware(authenticate),
      middleware(checkRole, ['administrador'])
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
      middleware(authenticate),
      middleware(checkRole, ['administrador'])
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
      middleware(authenticate),
      middleware(checkRole, ['administrador'])
    ],
  },

  {
    path: '/personal/:ciudad',
    name: 'n-personal',
    component: () => import(/* webpackChunkName: "PersonalView" */'@/views/PersonalView.vue'),
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(authenticate),
      middleware(checkRole, ['administrador'])
    ],
  },


  {
    path: '/usuario/:ciudad',
    name: 'n-usuario',
    component: () => import(/* webpackChunkName: "UsuarioView" */'@/views/UsuarioView.vue'),
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(authenticate),
      middleware(checkRole, ['administrador'])
    ],
  },

];//routes

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
