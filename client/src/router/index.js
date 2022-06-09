import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store'

//middleware
import auth from '@/middleware/auth';
import log from '@/middleware/log';
// end
import AuthLayout from "@/pages/Layout/Auth.vue";
import HomeLayout from "@/pages/Layout/Home.vue";
import IndexLayout from "@/pages/Layout/Index.vue";

import Login from "@/pages/Login.vue";
import Signup from "@/pages/Signup.vue";
import ForgotPassword from "@/pages/ForgotPassword.vue";
import ChangePassword from "@/pages/ChangePassword.vue";
import ResetPassword from "@/pages/ResetPassword.vue";

import Home from "@/pages/Home.vue";
import QuanLyNguoiDung from "@/pages/QuanLyNguoiDung.vue";
import QuanLyBenhNhan from "@/pages/QuanLyBenhNhan.vue";
import QuanLyPhongKham from "@/pages/QuanLyPhongKham.vue";
import QuanLyLichKham from "@/pages/QuanLyLichKham.vue";
import QuanLyDichVu from "@/pages/QuanLyDichVu.vue";
import QuanLyKhoThuoc from "@/pages/QuanLyKhoThuoc.vue";
import KhamChuaBenh from "@/pages/KhamChuaBenh.vue";

import Index from "@/pages/Index.vue";
import VeryBooking from "@/pages/VeryBooking.vue";

Vue.use(Router)

let authPages = {
    path: "/",
    component: AuthLayout,
    name: "Authentication",
    children: [{
            path: "/login",
            name: "Login",
            component: Login,
            meta: {
                middleware: log
            },
            beforeEnter: (to, from, next) => {
                if (store.state.token != null && store.state.token != undefined) {
                    next('/home');
                } else {
                    next();
                }
            }
        },
        {
            path: "/singnup",
            name: "Singnup",
            component: Signup,
            meta: {
                middleware: log
            }
        },
        {
            path: "/forgot-password",
            name: "ForgotPassword",
            component: ForgotPassword,
            meta: {
                middleware: log
            }
        },
        {
            path: "/change-password",
            name: "ChangePassword",
            component: ChangePassword,
            meta: {
                middleware: log
            }
        },
        {
            path: "/reset-password/:userId/:token",
            name: "ResetPassword",
            component: ResetPassword,
            meta: {
                middleware: log
            }
        },
    ]
};

let homePages = {
    path: "/",
    component: HomeLayout,
    name: "Home",
    children: [{
            path: "/home",
            name: "Home",
            component: Home,
            meta: {
                middleware: [auth, log]
            }
        },
        {
            path: "/quanlynguoidung",
            name: "QuanLyNguoiDung",
            component: QuanLyNguoiDung,
            meta: {
                middleware: [auth, log]
            }
        },
        {
            path: "/quanlybenhnhan",
            name: "QuanLyBenhNhan",
            component: QuanLyBenhNhan,
            meta: {
                middleware: [auth, log]
            }
        },
        {
            path: "/quanlyphongkham",
            name: "QuanLyPhongKham",
            component: QuanLyPhongKham,
            meta: {
                middleware: [auth, log]
            }
        },
        {
            path: "/quanlydichvu",
            name: "QuanLyDichVu",
            component: QuanLyDichVu,
            meta: {
                middleware: [auth, log]
            }
        },
        {
            path: "/quanlylichkham",
            name: "QuanLyLichKham",
            component: QuanLyLichKham,
            meta: {
                middleware: [auth, log]
            }
        },
        {
            path: "/khamchuabenh",
            name: "KhamChuaBenh",
            component: KhamChuaBenh,
            meta: {
                middleware: [auth, log]
            }
        },
        {
            path: "/quanlykhothuoc",
            name: "QuanLyKhoThuoc",
            component: QuanLyKhoThuoc,
            meta: {
                middleware: [auth, log]
            }
        },
    ]
};

let indexPages = {
    path: "/",
    component: IndexLayout,
    name: "IndexLayout",
    children: [{
            path: "/",
            name: "Index",
            component: Index,
            meta: {
                middleware: [log]
            }
        },
        {
            path: "/very-booking/:bookingId/:token",
            name: "VeryBooking",
            component: VeryBooking,
            meta: {
                middleware: [log]
            }
        },
    ]
};

const router = new Router({
    mode: 'history',
    routes: [
        indexPages,
        authPages,
        homePages, {
            path: '*',
            redirect: "/"
        }
    ]
})

export default router;

function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    // If no subsequent Middleware exists,
    // the default `next()` callback is returned.
    if (!subsequentMiddleware) return context.next;

    return (...parameters) => {
        // Run the default Vue Router `next()` callback first.
        context.next(...parameters);
        // Then run the subsequent Middleware with a new
        // `nextMiddleware()` callback.
        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({...context, next: nextMiddleware });
    };
}

router.beforeEach((to, from, next) => {
    if (to.meta.middleware) {
        const middleware = Array.isArray(to.meta.middleware) ?
            to.meta.middleware : [to.meta.middleware];

        const context = {
            from,
            next,
            router,
            to,
        };
        const nextMiddleware = nextFactory(context, middleware, 1);

        return middleware[0]({...context, next: nextMiddleware });
    }

    return next();
});