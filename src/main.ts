import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

// 按需求导入样式，普通的<el-button>这种不需要
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';

const app = createApp(App)
app.use(router)
app.mount('#app')
