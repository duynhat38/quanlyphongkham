<template>
  <form>
    <div class="logo text-center">
      <img src="/static/img/logo.png" />
    </div>
    <h3>Đăng Nhập</h3>
    <vue-headful title="Đăng Nhập" description="Đăng Nhập" />
    <div class="form-group">
      <label>Email</label>
      <input
        type="text"
        class="form-control form-control-lg"
        v-model="email"
        v-on:keyup.enter="login()"
      />
    </div>

    <div class="form-group">
      <label>Mật Khẩu</label>
      <input
        type="password"
        class="form-control form-control-lg"
        v-model="password"
        v-on:keyup.enter="login()"
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
      @click="login()"
    >
      Đăng Nhập
    </button>
    <div class="col-md-12">
      <div class="box_links float-left">
        Chưa có tài khoản
        <router-link to="/singnup">Đăng Ký?</router-link>
      </div>
      <div class="box_links float-right">
        <router-link to="/forgot-password">Quên mật khẩu ?</router-link>
      </div>
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
      errors_message: null,
      success_message: null,
      isLogin: false,
    };
  },
  methods: {
    async login() {
      try {
        this.errors_message == null;
        this.success_message == null;
        this.isLogin = false;
        if (this.email && this.password) {
          var checkEmail = await this.validEmail(this.email);
          if (!checkEmail) {
            this.errors_message = "Định dạng email ko đúng !!!";
            return;
          } else {
            const response = await AuthenticationService.login({
              email: this.email,
              password: this.password,
            });
            if (response) {
              if (response.data.token && response.data.user) {
                this.$store.dispatch("setToken", response.data.token);
                this.$store.dispatch("setUser", response.data.user);
                this.success_message = response.data.message;
                this.$router.push("/home");
                this.isLogin = true;
              }
            } else {
              this.errors_message = "Server không phản hồi";
            }
          }
        } else {
          this.errors_message = "Vui lòng điền đầy đủ thông tin";
        }
      } catch (error) {
        this.errors_message = error.response.data.message;
      } finally {
        if (this.isLogin == true) {
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
  text-align: center;
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