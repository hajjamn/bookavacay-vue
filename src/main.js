import { createApp } from 'vue'

import App from './App.vue'
import Home from './pages/Home.vue'
import Research from './pages/Research.vue'
import AdvancedSearch from './pages/AdvancedSearch.vue'
import AppHeader from './components/AppHeader.vue'
import ApartmentDetail from './pages/ApartmentDetail.vue'
import Login from './pages/Login.vue'
// import router from './router'


import * as Vue from 'vue';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

/* import vue router */
// import {Vue} from 'vue';
// import {VueRouter} from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router'

// Vue.use(VueRouter);

const routes = [
    { path: '/', component: Home, name: 'home' },
    { path: '/research', component: Research, name: 'research' },
    { path: '/input', component: AppHeader, name: 'input', props: true },
    { path: '/search', component: AdvancedSearch, name: 'AdvancedSearch', props: true },
    { path: '/apartments/:id', component: ApartmentDetail, name: ApartmentDetail, props: true },
    { path: '/login', component: Login, name: 'login'},
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router;




/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* add icons to the library */
library.add(fas, far, fab)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

// per router 
app.use(router)

app.mount('#app')





