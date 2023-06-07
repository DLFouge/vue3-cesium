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
        },{
            path: '/hawkEyeO',
            component: () => import(`@/views/MultiView/hawkEyeO.vue`),
        },{
            path: '/hawkEyeL',
            component: () => import(`@/views/MultiView/hawkEyeL.vue`),
        },{
            path: '/hawkEyeC',
            component: () => import(`@/views/MultiView/hawkEyeC.vue`),
        }] 
    }); 
export default router;