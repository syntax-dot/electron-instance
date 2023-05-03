import { createApp } from 'vue'
import { createPinia } from 'pinia'
import IconWrapper from '~/components/icon-wrapper.vue'
import router from './router'
import App from './App.vue'
import { hookMiddleware } from './core/middleware'

hookMiddleware(router)

const pinia = createPinia()
const app = createApp(App)
app.component('icon-wrapper', IconWrapper)
app.use(router).use(pinia)

router.isReady().then(() => app.mount('#app'))
