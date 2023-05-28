import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index' 

// 导入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(router);
app.use(ElementPlus);


app.mount('#app')
