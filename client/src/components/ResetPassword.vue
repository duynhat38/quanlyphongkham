<template>
    <div class="vue-tempalte">
        <form>
            <h3>Đặt Lại Mật Khẩu</h3>
            <vue-headful title="Đặt Lại Mật Khẩu" description="Đặt Lại Mật Khẩu" />
            <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control form-control-lg" v-model="password" v-on:keyup.enter="resetPassword()"/>
            </div>
            <div class="form-group">
                <label>Nhập Lại Mật Khẩu</label>
                <input type="password" class="form-control form-control-lg" v-model="password_confirmation" v-on:keyup.enter="resetPassword()"/>
            </div>
            <div
                v-if="errors_message!=null"
                class="form-group alert alert-danger alert-dismissible fade show mt-3"
                role="alert"
            >{{ errors_message }}</div>
            <div
                v-if="success_message!=null"
                class="form-group alert alert-success alert-dismissible fade show mt-3"
                role="alert"
            >{{ success_message }}</div>
            <button type="button" class="btn btn-dark btn-lg btn-block mt-3" @click="resetPassword()">Đặt Lại Mật Khẩu</button>

        </form>
    </div>
</template>

<script>
import AuthenticationService from "@/services/AuthenticationService";
    export default {
        data() {
            return {
                token: this.$route.params.token,
                userId: this.$route.params.userId,
                password: null,
                password_confirmation: null,
                errors_message: null,
                success_message: null,
                isResetPassword: false
            }
        },
    async created() {},
    methods: {
        async resetPassword() {
            try {
                this.errors_message = null;
                this.success_message = null;
                this.isResetPassword = false;
                if (this.password !== this.password_confirmation) {
                    this.errors_message = "Nhập lại mật khẩu không chính xác !!!";
                    return;
                }
                if(this.password){
                const response = await AuthenticationService.resetPassword({
                    password: this.password,
                    userId: this.userId,
                    token: this.token
                });
                if(response){
                    if (response.data.success == true) {
                        this.success_message = response.data.message;
                        this.isResetPassword = true;
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
                if(this.isResetPassword == true){
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