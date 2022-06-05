<template>
  <form>
    <div class="logo text-center">
      <img src="/static/img/logo.png" />
    </div>
    <h3>Quên Mật Khẩu</h3>
    <vue-headful title="Quên Mật Khẩu" description="Quên Mật Khẩu" />
    <div class="form-group">
      <label>Email Address</label>
      <input
        type="email"
        class="form-control form-control-lg"
        v-model="email"
        v-on:keyup.enter="forgotPassword()"
      />
    </div>
    <div
      v-if="errors_message != null"
      class="form-group alert alert-danger alert-dismissible fade show mt-3"
      role="alert"
    >
      {{ errors_message }}
    </div>
    <div
      v-if="success_message != null"
      class="form-group alert alert-success alert-dismissible fade show mt-3"
      role="alert"
    >
      {{ success_message }}
    </div>
    <button
      type="button"
      class="btn btn-primary btn-lg btn-block mt-3"
      @click="forgotPassword()"
    >
      Đặt Lại Mật Khẩu
    </button>
    <div class="box_links text-right">
      <router-link to="/login">Quay lại</router-link>
    </div>
  </form>
</template>

<script>
import AuthenticationService from "@/services/AuthenticationService";
export default {
  data() {
    return {
      email: null,
      errors_message: null,
      success_message: null,
      isForgotPassword: false,
    };
  },
  methods: {
    async forgotPassword() {
      try {
        this.errors_message = null;
        this.success_message = null;
        this.isForgotPassword = false;
        var checkEmail = await this.validEmail(this.email);
        if (!checkEmail) {
          this.errors_message = "Định dạng email ko đúng !!!";
          return;
        }
        this.errors_message = null;
        if (this.email) {
          const response = await AuthenticationService.forgotPassword({
            email: this.email,
          });
          if (response) {
            if (response.data.success == true) {
              this.success_message = response.data.message;
              this.isForgotPassword = true;
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
        if (this.isForgotPassword == true) {
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