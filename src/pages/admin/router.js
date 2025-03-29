import { createRouter, createWebHashHistory } from 'vue-router';
import Dashboard from './Dashboard.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/users',
    component: () => import('./Users'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
