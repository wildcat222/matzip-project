import { createRouter, createWebHistory } from "vue-router";
import {useAuthStore} from "@/components/stores/auth.js";
import UserSearch from "@/views/admin/admin-views/UserSearch.vue";
import ActivityLevelSearch from "@/views/admin/admin-views/ActivityLevelSearch.vue";
import AdminBaseView from "@/views/admin/AdminBaseView.vue";
import UserBase from "@/views/user/UserBase.vue";
import ListAll from "@/views/Lists/ListAll.vue";

const routes = [
    { path: "/login", component: () => import("@/views/auth/LoginForm.vue") },
    {
        path: "/user",
        component: UserBase,
        children: [
            { path: "/", component: () => import("@/views/home/HomeView.vue")},
            { path: "auth/register", component: () => import("@/views/auth/Register.vue") },
            { path: "auth/registerTOS", component: () => import("@/views/auth/RegisterTOS.vue") },
            { path: "register-success", component: () => import("@/views/auth/RegisterSuccess.vue") },
            { path: "auth/find-email", component: () => import("@/views/auth/FindEmail.vue") },
            { path: "auth/find-password", component: () => import("@/views/auth/FindPassword.vue") },
            { path: "auth/reset-password", component: () => import("@/views/auth/ResetPassword.vue") },
            { path: "post/create", component: () => import("@/views/post/PostCreate.vue")},
            { path: "post/:id/edit", component: () => import("@/views/post/PostEdit.vue") },
            { path: "post", component: () => import("@/views/post/PostList.vue") },
            { path: "post/:id", component: () => import("@/views/post/PostDetail.vue") },
            { path: "review", component: () => import("@/views/review/Review.vue") },
            { path: "review/detail", component: () => import("@/views/review/Detail.vue") },
            // 모든리스트 조회 라우팅
            { path: 'listAll', name: 'ListAll', component: ListAll },
            // 유저 마이페이지 조회
            { path: ":userSeq", component: () => import("@/views/user/UserProfileView.vue") },
            // 리스트 다른 사람 서랍 조회
            { path: 'listbox/:listUserSeq', component: () => import("@/views/Lists/ListBox.vue")},


        ]
    },
    // { path: "/auth/find-email", component: () => import("@/views/auth/FindEmail.vue") },
    // { path: "/auth/find-password", component: () => import("@/views/auth/FindPassword.vue") },
    // { path: "/auth/reset-password", component: () => import("@/views/auth/ResetPassword.vue") },
    // { path: "/post/create", component: () => import("@/views/post/PostCreate.vue")},
    // { path: "/review", component: () => import("@/views/review/Review.vue") },
    // { path: "/review/detail", component: () => import("@/views/review/Detail.vue") },
    {
        path: "/admin",
        component: AdminBaseView,
        children: [
            {
                path: "users",
                component: UserSearch
            },
            {
                path: "active-level",
                component: ActivityLevelSearch
            },
            {
                path: "user/:userSeq",
                component: () => import('@/views/admin/admin-views/UserDetail.vue')
            },
            {
                path: 'report-search',
                component: () => import('@/views/admin/admin-views/ReportSearch.vue')
            },
            // {
            //     path: '',
            //     name: 'ReportHandling',
            //     component: () => import('@/views/admin/admin-views/')
            //
            // }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

/* Navigation Guard : beforeEach 가드를 사용하여 라우트 이동 전에 인증 상태를 체크한다. */
router.beforeEach((to, from, next) => { //라우팅 하려고하는곳, 하기전, 한후
    const authStore = useAuthStore();

    // 인증이 필요한 페이지에 접근할 때
    if (to.meta.requiresAuth && !authStore.accessToken) {
        next({path: '/login'}); // 로그인 페이지로 리다이렉션
    }
    // 이미 로그인한 상태에서 로그인, 회원가입 페이지에 접근할 때
    else if (authStore.accessToken && (to.path === '/login' || to.path === 'user/auth/register')) {
        const userSeq = authStore.userSeq; // authStore에서 userSeq 값을 가져옴
        next({path: `/user/${userSeq}`}); // 마이페이지로 리디렉션
        // 비밀번호 재설정 페이지에 접근할 때
    } else if(to.path === 'user/auth/reset-password') {
        next({path: '/login'});
        // 약관 동의 없이 회원가입 페이지로 직접 접근할 때
    } else if((to.path === '/user/auth/register' && !authStore.isTermsAccepted)) {
        next({ path: '/user/auth/registerTOS' }); // 약관 동의 페이지로 리디렉션
    } else {
        next(); // 나머지 경우는 계속 진행
    }
});

export default router;
