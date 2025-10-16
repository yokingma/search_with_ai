import { createRouter, createWebHistory } from 'vue-router';
import { PageLayout } from './components';
import HomePage from "./pages/home/index.vue";
import SearchPage from './pages/chat/index.vue';
import DeepResearch from './pages/research/index.vue';
import i18n from './i18n';
import { ROUTE_NAME } from './constants';

const routes = [
  {
    path: '/',
    component: PageLayout,
    children: [
      {
        path: '',
        name: ROUTE_NAME.HOME,
        component: HomePage,
        meta: {
          title: 'Home'
        }
      },
      {
        path: '/chat',
        name: ROUTE_NAME.SEARCH_PAGE,
        component: SearchPage,
        meta: {
          title: 'Search Chat'
        }
      },
      {
        path: '/research',
        children: [
          {
            path: '',
            redirect: '/'
          },
          {
            path: ':query',
            name: ROUTE_NAME.DEEP_RESEARCH,
            component: DeepResearch,
            props: true,
            meta: {
              title: 'DeepResearch'
            }
          }
        ]
      }
    ],
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