import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Members from '../views/Members.vue'
import Passes from '../views/Passes.vue'
import Dbschema from '../views/Dbschema.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/members',
    name: 'Members',
    component: Members
  },
  {
    path: '/passes',
    name: 'Passes',
    component: Passes
  },
  {
    path: '/dbschema',
    name: 'Dbschema',
    component: Dbschema
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
