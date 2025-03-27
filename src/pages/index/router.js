import { createRouter, createWebHashHistory } from 'vue-router';
import Photos from './Photos.vue';

const routes = [
  {
    path: '/',
    component: Photos,
  },
  {
    path: '/trashbin',
    component: () => import('./Trashbin'),
  },
  {
    path: '/albums',
    component: () => import('./Albums'),
  },
  {
    path: '/album/:id',
    component: () => import('./Album'),
  },
  {
    path: '/album/new',
    component: () => import('./AlbumNew'),
  },
  {
    path: '/album',
    redirect: '/album/new',
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
