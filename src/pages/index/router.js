import { createRouter, createWebHashHistory } from 'vue-router';
import Photos from './Photos.vue';

const routes = [
  {
    path: '/',
    name: 'Photos',
    component: Photos,
  },
  {
    path: '/photo/:id',
    component: () => import('./Photo'),
  },
  {
    path: '/photo',
    redirect: '/',
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
    path: '/person/:id',
    component: () => import('./Person'),
  },
  {
    path: '/person',
    redirect: '/people',
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
  {
    path: '/search',
    component: () => import('./Search'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
