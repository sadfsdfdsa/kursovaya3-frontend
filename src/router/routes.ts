import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), name: 'Main' },
      {
        path: '/admin',
        component: () => import('pages/Admin.vue'),
        name: 'Admin',
      },
      {
        path: '/dashboard/:id',
        component: () => import('pages/Dashboard.vue'),
        name: 'Dashboard',
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/Login.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'Error404',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
