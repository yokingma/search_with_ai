import { createRouter, createWebHistory } from 'vue-router';
import { PageLayout } from './components';
import HomePage from "./pages/home/index.vue";
import ChatSearchPage from './pages/chat/index.vue';
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
        path: '/chat/:uuid',
        name: ROUTE_NAME.CHAT_PAGE,
        component: ChatSearchPage,
        props: true,
        meta: {
          title: 'Chat Search'
        }
      },
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