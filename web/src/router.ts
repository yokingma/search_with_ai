import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "./pages/home.vue"
import SearchPage from './pages/search.vue'


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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router