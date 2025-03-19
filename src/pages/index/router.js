import { createRouter, createWebHashHistory } from 'vue-router';
import Photos from './Photos.vue';

const routes = [
  {
    path: '/',
    component: Photos,
  },
  {
    path: '/albums',
    component: () => import('./Albums'),
  },
  {
    path: '/people',
    component: () => import('./People'),
  },
  {
    path: '/settings',
    component: () => import('./Settings'),
  },
  {
    path: '/help',
    component: () => import('./Help'),
  },
  {
    path: '/account',
    component: () => import('./Account'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
