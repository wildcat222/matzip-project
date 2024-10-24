import { createRouter, createWebHistory } from "vue-router";
import Main from '@/views/main/MainHome.vue';
import Lists from '@/views/Lists/List.vue';
import ListBox from '@/views/Lists/ListBox.vue'
import ListAll from '@/views/Lists/ListAll.vue'

const routes = [
    { path: '/', name: 'Home', component: Main, },
    { path: "/post/create", component: () => import("@/views/post/PostCreate.vue")},
    // 리스트 라우팅
    { path: '/list', name: 'MatzipList', component: Lists },
    // 리스트 서랍 라우팅
    { path: '/listBox', name: 'ListBox', component: ListBox},
    // 모든리스트 조회 라우팅
    { path: '/listAll', name: 'ListAll', component: ListAll },
    // 후기 라우팅
    { path: "/review", component: () => import("@/views/review/Review.vue") },

    { path: "/review/detail", component: () => import("@/views/review/Detail.vue") },

];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
