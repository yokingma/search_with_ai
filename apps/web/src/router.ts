import { createRouter, createWebHistory } from 'vue-router';
import HomePage from "./pages/home.vue";
import SearchPage from './pages/search/index.vue';
import DeepResearch from './pages/research/index.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/search',
    name: 'SearchPage',
    component: SearchPage
  },
  {
    path: '/deep',
    name: 'DeepResearch',
    component: DeepResearch
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;