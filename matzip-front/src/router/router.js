import {createRouter, createWebHistory} from "vue-router";
import UserSearch from "@/views/admin/admin-views/UserSearch.vue";
import ActivityLevelSearch from "@/views/admin/admin-views/ActivityLevelSearch.vue";
import AdminBaseView from "@/views/admin/AdminBaseView.vue";
import Login from "@/views/Login.vue";

const route = createRouter({
    history: createWebHistory(),
    routes: [
        {path: "/", component: Login},
        {path: "/revuew", component: () => import("@/views/review/Review.vue")},
        {path: "/review/detail", component: () => import("@/views/review/Detail.vue")},
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
            ]
        }


        // {
        //     path: "/admin/report",
        //     component:
        // },
        // {
        //     path: "/admin/report-reason",
        //     component:
        // },
        // {
        //     path: "/admin/penalty-detail",
        //     component:
        // },
        // {
        //     path: "/admin/penalty",
        //     component:
        // },
        // {
        //     path: "/admin/restaurant",
        //     component:
        // },
    ]
});

export default route;
