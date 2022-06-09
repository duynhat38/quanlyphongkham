import store from '@/store/store'
import UsersService from '@/services/UsersService'
let toastr = require('toastr')

export default async function auth({ next, router }) {
    if (store.state.token == null || store.state.token == undefined) {
        store.dispatch('clearState');
        return router.push('/login');
    } else {
        try {
            const response = await UsersService.auth();
            if (response) {
                if (response.data.success) {
                    store.dispatch('setUser', response.data.user)
                    return next();
                } else {
                    if (response.data.error) {
                        toastr.error(response.data.message, "Error", {
                            timeOut: 3000,
                            progressBar: true,
                            closeButton: true
                        });
                    }
                    store.dispatch('clearState');
                    return router.push('/login');
                }
            } else {
                return toastr.error("Server không phản hồi", "Error", {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true
                });
            }
        } catch (err) {
            toastr.error(err.response.data.message, "Error", {
                timeOut: 3000,
                progressBar: true,
                closeButton: true
            });
            store.dispatch('clearState');
            return router.push('/login');
        }
    }
}