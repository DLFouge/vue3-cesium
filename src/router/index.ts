import { createRouter, createWebHistory } from 'vue-router'; 
const routerHistory = createWebHistory(); 
const router = createRouter({   
    history: routerHistory, //history写法不同   
    routes: [{       
            path: '/',       
            redirect: '/home',     
        },{       
            path: '/home',       
            component: () => import(`@/views/Home.vue`),     
        }], 
    }); 
export default router;