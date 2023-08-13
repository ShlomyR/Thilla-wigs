/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import 'tailwindcss/base.css'


// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'




const app = createApp(App)

registerPlugins(app)

app.use(VCalendar, {});

app.mount('#app')
