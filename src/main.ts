import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import VueKonva from 'vue-konva';
import { createWebHistory, createRouter } from 'vue-router'

import IndexPage from '@/components/pages/index.vue'
import LoginPage from '@/components/pages/LoginPage.vue'
import NewProject from "@/components/pages/NewProject.vue";

const routes = [
  { path: '/', component: IndexPage },
  { path: '/login', component: LoginPage },
  { path: '/:uuid', component: NewProject },
]

const app = createApp(App)

app.use(createRouter({
  history: createWebHistory(),
  routes,
}))
app.use(createPinia())
app.use(VueKonva)

app.mount('#app')
