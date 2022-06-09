<template>
  <form>
    <div class="logo text-center">
      <img src="/static/img/logo.png" />
    </div>
    <h3>Đăng Ký</h3>
    <vue-headful title="Đăng Ký" description="Đăng Ký" />
    <div class="form-group">
      <label>Email Address(*)</label>
      <input
        type="email"
        class="form-control form-control-lg"
        v-model="email"
        v-on:keyup.enter="register()"
      />
    </div>
    <div class="form-group">
      <label>Họ Tên</label>
      <input
        type="text"
        class="form-control form-control-lg"
        v-model="fullname"
        v-on:keyup.enter="register()"
      />
    </div>
    <div class="form-group">
      <label>Số Điện Thoại</label>
      <input
        type="text"
        class="form-control form-control-lg"
        v-model="phone"
        v-on:keyup.enter="register()"
      />
    </div>
    <div class="form-group">
      <label>Mật Khẩu(*)</label>
      <input
        type="password"
        class="form-control form-control-lg"
        v-model="password"
        v-on:keyup.enter="register()"
      />
    </div>

    <div class="form-group">
      <label>Nhập Lại Mật Khẩu(*)</label>
      <input
        type="password"
        class="form-control form-control-lg"
        v-model="password_confirmation"
        v-on:keyup.enter="register()"
      />
    </div>
    <div
      v-if="errors_message != null"
      class="form-group alert alert-danger alert-dismissible fade show mt-3"
      role="alert"
    >
      {{ errors_message }}
    </div>
    <button
      type="button"
      class="btn btn-primary btn-lg btn-block mt-3"
      @click="register()"
    >
      Đăng Ký
    </button>

    <div class="box_links text-right">
      Đã có tài khoản
      <router-link to="/login">Đăng Nhập?</router-link>
    </div>
  </form>
</template>

<script>
import AuthenticationService from "@/services/AuthenticationService";
export default {
  data() {
    return {
      email: null,
      password: null,
      password_confirmation: null,
      phone: null,
      fullname: null,
      errors_message: null,
      success_message: null,
      isRegister: false,
    };
  },
  methods: {
    async register() {
      try {
        this.errors_message == null;
        this.success_message == null;
        this.isRegister = false;
        if (
          this.email &&
          this.password &&
          this.password_confirmation
        ) {
          var checkEmail = await this.validEmail(this.email);
          if (!checkEmail) {
            this.errors_message = "Định dạng email ko đúng !!!";
            return;
          }
          if (this.password !== this.password_confirmation) {
            this.errors_message = "Nhập lại mật khẩu không chính xác !!!";
            return;
          }
          const response = await AuthenticationService.register({
            email: this.email,
            password: this.password,
            phone: this.phone,
            fullname: this.fullname,
          });
          if (response) {
            if (response.data.success == true) {
              this.isRegister = true;
              this.success_message = response.data.message;
              this.$router.push("/login");
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
        if (this.isRegister == true) {
          this.$toastr.success(this.success_message, "Thông báo", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
        } else {
          if (this.errors_message == null || this.errors_message == undefined) {
            this.errors_message = "Lỗi không xác định";
          }
          this.$toastr.error(this.errors_message, "Error", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
        }
      }
    },
    validEmail: async function (email) {
      var re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return await re.test(email);
    },
  },
};
</script>
<style lang="css" scoped>
label {
  font-weight: 500;
}
.box_links,
.box_links a {
  text-align: right;
  font-size: 13px;
  padding-top: 15px;
  color: #7a7a7a;
  margin: 0;
}

.box_links a {
  color: #2554ff;
}
.logo img {
  height: 100px;
  width: 100px;
}
</style>