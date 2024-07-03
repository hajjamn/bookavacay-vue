import { createApp } from 'vue'

import App from './App.vue'
import Home from './pages/Home.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

/* import vue router */
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {path: '/', component: Home, name: 'home'},
    // {path: '/home', component: Home, name: 'home'},

]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})



/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* add icons to the library */
library.add(fas, far, fab)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

// per router 
app.use(router)

app.mount('#app')

