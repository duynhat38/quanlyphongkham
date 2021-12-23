<template>
    <div class="vue-tempalte">
        <form>
            <h3>Đăng Nhập</h3>
            <vue-headful title="Đăng Nhập" description="Đăng Nhập" />
            <div class="form-group">
                <label>Tên Đăng Nhập</label>
                <input type="text" class="form-control form-control-lg" v-model="username" v-on:keyup.enter="login()"/>
            </div>

            <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control form-control-lg" v-model="password" v-on:keyup.enter="login()"/>
            </div>
            <div
                v-if="errors_message!=null"
                class="form-group alert alert-danger alert-dismissible fade show mt-3"
                role="alert"
            >{{ errors_message }}</div>
            <button type="button" class="btn btn-dark btn-lg btn-block mt-3" @click="login()">Đăng Nhập</button>
            <p class="forgot-password text-right">
                Bạn chưa có tài khoản
                <router-link to="/singnup">Đăng Ký?</router-link>
            </p>
            <p class="forgot-password text-right mt-2 mb-4">
                <router-link to="/forgot-password">Quên mật khẩu ?</router-link>
            </p>
        </form>
    </div>
</template>

<script>
import AuthenticationService from "@/services/AuthenticationService";
    export default {
        data() {
            return {
                username: null,
                password: null,
                errors_message: null,
                success_message: null,
                isLogin: false
            }
        },
    methods: {
        async login() {
            try {
                this.errors_message == null
                this.success_message == null
                this.isLogin = false
                if(this.username && this.password){
                const response = await AuthenticationService.login({
                    username: this.username,
                    password: this.password
                });
                if(response){
                    if (response.data.token && response.data.user) {
                    this.$store.dispatch("setToken", response.data.token);
                    this.$store.dispatch("setUser", response.data.user);
                    this.success_message = response.data.message;
                    this.$router.push("/");
                    this.isLogin = true;
                    }
                }else{
                    this.errors_message = 'Server không phản hồi';
                }
                }else{
                this.errors_message = 'Vui lòng điền đầy đủ thông tin';
                }
            } catch (error) {
                this.errors_message = error.response.data.message;
            }finally{
                if(this.isLogin == true){
                this.$toastr.success(this.success_message, 'Thông báo', {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true
                });
                }else{
                    if(this.errors_message == null || this.errors_message == undefined){
                        this.errors_message = 'Lỗi không xác định';
                    }
                    this.$toastr.error(this.errors_message, "Error", {
                        timeOut: 3000,
                        progressBar: true,
                        closeButton: true
                    });
                }
            }
        }
    }
}
</script>