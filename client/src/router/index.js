import Vue from 'vue'
import Router from 'vue-router'
//middleware
import auth from '@/middleware/auth';
import log from '@/middleware/log';
// end
import AuthLayout from "@/components/Layout/Auth.vue";
import Login from "@/components/Login.vue";
import Signup from "@/components/Signup.vue";
import ForgotPassword from "@/components/ForgotPassword.vue";
import ChangePassword from "@/components/ChangePassword.vue";
import ResetPassword from "@/components/ResetPassword.vue";
import Home from "@/components/Home.vue";

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

const router = new Router({
    mode: 'history',
    routes: [{
            path: "/",
            redirect: "/home",
            meta: {
                middleware: [auth, log]
            }
        },
        authPages,
        {
            path: "/",
            component: AuthLayout,
            children: [{
                path: "home",
                name: "Home",
                components: { default: Home },
                meta: {
                    middleware: [auth, log]
                }
            }, ]
        },
        {
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