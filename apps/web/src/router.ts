import { createRouter, createWebHistory } from 'vue-router';
import HomePage from "./pages/home.vue";
import SearchPage from './pages/search/index.vue';
import DeepResearch from './pages/research/index.vue';
import i18n from './i18n';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: 'Home'
    }
  },
  {
    path: '/search',
    name: 'SearchPage',
    component: SearchPage,
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
        component: DeepResearch,
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