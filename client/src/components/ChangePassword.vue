<template>
    <div class="vue-tempalte">
        <form>
            <h3>Đổi Mật Khẩu</h3>
            <vue-headful title="Đổi Mật Khẩu" description="Đổi Mật Khẩu" />

            <div class="form-group">
                <label>Mật Khẩu Hiện Tại</label>
                <input type="password" class="form-control form-control-lg" v-model="password" v-on:keyup.enter="changePassword()"/>
            </div>
            <div class="form-group">
                <label>Mật Khẩu Mới</label>
                <input type="password" class="form-control form-control-lg" v-model="password_new" v-on:keyup.enter="changePassword()"/>
            </div>
            <div class="form-group">
                <label>Nhập Lại Mật Khẩu Mới</label>
                <input type="password" class="form-control form-control-lg" v-model="password_confirmation" v-on:keyup.enter="changePassword()"/>
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
            <button type="button" class="btn btn-dark btn-lg btn-block mt-3" @click="changePassword()">Đổi Mật Khẩu</button>
        </form>
    </div>
</template>

<script>
import UsersService from "@/services/UsersService";
    export default {
        data() {
            return {
                password: null,
                password_new: null,
                password_confirmation: null,
                errors_message: null,
                success_message: null,
                isChangePassword: false,
            };
        },
    methods: {
        async changePassword() {
        try {
            this.errors_message == null
            this.success_message == null
            this.isChangePassword = false
            if (
            this.password &&
            this.password_new &&
            this.password_confirmation
            ) {
            if (this.password_new !== this.password_confirmation) {
                this.errors_message = "Nhập lại mật khẩu không chính xác !!!";
                return;
            }
            const response = await UsersService.changePassword({
                password: this.password,
                password_new: this.password_new
            });
            if (response) {
                if (response.data.success == true) {
                this.isChangePassword = true;
                this.success_message = response.data.message;
                }
            } else {
                this.errors_message = "Server không phản hồi";
            }
            } else {
            this.errors_message = "Vui lòng điền đầy đủ thông tin";
            }
        } catch (error) {
            this.errors_message = error.response.data.message;
        } finally {
            if (this.isChangePassword == true) {
            this.$toastr.success(this.success_message, "Thông báo", {
                timeOut: 3000,
                progressBar: true,
                closeButton: true
            });
            } else {
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