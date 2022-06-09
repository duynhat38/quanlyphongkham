<template>
  <b-modal
    id="EditAccountModal"
    title="Tài khoản đăng nhập"
    @ok="handleOk"
    ok-title="Cập nhật"
    cancel-title="Thoát"
  >
    <div class="col-sm-12">
      <div>
        <div class="row">
          <div class="col-md-6">
            <label class="control-label">Họ tên (*)</label>
            <div class="form-group has-feedback">
              <input
                id="patientsName"
                name="patientsName"
                type="text"
                class="form-control"
                placeholder="Họ tên"
                maxlength="150"
                data-batbuoc="true"
                data-msg="họ tên"
                v-model="fullname"
                required
              />
            </div>
          </div>
          <div class="col-md-6">
            <label class="control-label">Email (*)</label>
            <div class="form-group has-feedback">
              <input
                id="Email"
                name="Email"
                type="text"
                class="form-control"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                placeholder="Email"
                data-batbuoc="true"
                data-msg="Email"
                v-model="email"
                :disabled="account"
                required
              />
            </div>
          </div>
          <div class="col-md-6">
            <label class="control-label">Mật khẩu (*)</label>
            <div class="form-group has-feedback">
              <input
                id="password"
                name="password"
                type="password"
                class="form-control"
                placeholder="******"
                maxlength="20"
                data-batbuoc="true"
                data-msg="Mật khẩu"
                :disabled="!isChangePassword && account"
                v-model="password"
                required
              />
              <div v-if="account">
                <a
                  href="#"
                  v-if="!isChangePassword"
                  @click="(isChangePassword = true), (password = null)"
                  >Thay Đổi Mật Khẩu</a
                >
                <a
                  href="#"
                  v-else
                  @click="(isChangePassword = false), (password = null)"
                  >Huỷ</a
                >
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <label class="control-label">Nhóm người dùng (*)</label>
            <div class="form-group">
              <select
                id="role"
                name="role"
                class="form-control"
                data-batbuoc="true"
                data-msg="role"
                v-model="role"
              >
                <option
                  v-for="(item, index) in roles"
                  :key="index"
                  :value="item.key"
                >
                  {{ item.value }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import UsersService from "@/services/UsersService";
export default {
  props: ["account", "roles", "clinics", "specialties"],
  data() {
    return {
      fullname: null,
      phone: null,
      email: null,
      gender: null,
      role: null,
      password: null,
      isChangePassword: false,
      isAddAccount: true,
    };
  },
  watch: {
    account: function (account) {
      if (!account) {
        this.fullname = null;
        this.phone = null;
        this.email = null;
        this.role = null;
        this.password = null;
        this.isAddAccount = true;
        this.isChangePassword = false;
      } else {
        this.fullname = account.fullname;
        this.phone = account.phone;
        this.email = account.email;
        this.role = account.role;
        this.password = null;
        this.isAddAccount = false;
        this.isChangePassword = false;
      }
    },
  },
  created() {
    if (this.account) {
      this.isAddAccount = false;
    } else {
      this.isAddAccount = true;
    }
  },
  methods: {
    handleOk: async function (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      if (this.isAddAccount) {
        if (!this.fullname || !this.password || !this.role) {
          this.$toastr.error("Vui lòng điền đầy đủ thông tin", "Error", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
          return;
        }
        var add = await this.addAccount(
          this.fullname,
          this.phone,
          this.email,
          this.password,
          this.role
        );
        if (add.success) {
          this.$bvModal.hide("EditAccountModal");
          this.$emit("editMode");
          this.$toastr.success(add.message, "Thông báo", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
        } else {
          this.$toastr.error(add.message, "Error", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
        }
      } else {
        if (!this.account._id || !this.fullname || !this.role) {
          this.$toastr.error("Vui lòng điền đầy đủ thông tin", "Error", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
          return;
        }
        if (this.isChangePassword) {
          if (!this.password) {
            this.$toastr.error("Vui lòng điền mật khẩu", "Error", {
              timeOut: 3000,
              progressBar: true,
              closeButton: true,
            });
            return;
          }
        }
        var edit = await this.editAccount(
          this.account._id,
          this.fullname,
          this.phone,
          this.password,
          this.role
        );
        if (edit.success) {
          this.$emit("editMode");
          this.$bvModal.hide("EditAccountModal");
          this.$toastr.success(edit.message, "Thông báo", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
        } else {
          this.$toastr.error(edit.message, "Error", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
        }
      }
    },
    addAccount: async function (fullname, phone, email, password, role) {
      try {
        const response = await UsersService.create({
          email: email,
          password: password,
          fullname: fullname,
          phone: phone,
          role: role
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },
    editAccount: async function (userId, fullname, phone, password, role) {
      try {
        const response = await UsersService.edit({
          userId: userId,
          password: password,
          fullname: fullname,
          phone: phone,
          role: role
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },
  },
};
</script>
<style lang="css" scope>
</style>