import { createRouter, createWebHistory } from 'vue-router';
// import HomePage from "./pages/home.vue"; // 移除直接导入
// import SearchPage from './pages/search/index.vue'; // 移除直接导入
// import DeepResearch from './pages/research/index.vue'; // 移除直接导入
import i18n from './i18n';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./pages/home.vue'), // 懒加载
    meta: {
      title: 'Home'
    }
  },
  {
    path: '/search',
    name: 'SearchPage',
    component: () => import('./pages/search/index.vue'), // 懒加载
    meta: {
      title: 'Search'
    }
  },
  {
    path: '/deep-research',
    children: [
      {
        path: '',
        redirect: '/'
      },
      {
        path: ':query',
        name: 'DeepResearch',
        component: () => import('./pages/research/index.vue'), // 懒加载
        props: true,
        meta: {
          title: 'DeepResearch'
        }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const routeTitle = to.meta.title as string;
  if (routeTitle) document.title = `${routeTitle} - ${i18n.global.t('title')}`;
});

export default router;
