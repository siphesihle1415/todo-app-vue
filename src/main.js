import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUndoAlt, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUndoAlt)
library.add(faPencilAlt)
library.add(faTrashAlt)

const app = createApp(App)

app.use(createPinia())
app.use(PerfectScrollbar, {
    watchOptions: true,
    options: {
      suppressScrollX: true
    }
})
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon).mount('#app')
