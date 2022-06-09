<template>
  <div class="App" id="container">
    <div id="header">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#"
          ><i class="bi bi-hospital"></i> Phòng Khám Demo</a
        >
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <router-link to="/home" class="nav-link" href="#"
                ><i class="bi bi-house-heart"></i> Trang Chủ
                <span class="sr-only">(current)</span></router-link>
            </li>
            <li class="nav-item">
              <router-link to="/quanlylichkham" class="nav-link" href="#"
                ><i class="bi bi-people-fill"></i> Lịch Khám</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/khamchuabenh" class="nav-link" href="#"
                ><i class="bi bi-bar-chart-line-fill"></i> Khám Chữa Bệnh</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/quanlybenhnhan" class="nav-link" href="#"
                ><i class="bi bi-people-fill"></i> Bệnh Nhân</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/quanlykhothuoc" class="nav-link" href="#"
                ><i class="bi bi-people-fill"></i> Kho Thuốc</router-link
              >
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownCaiDat"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="bi bi-wrench"></i> Cài đặt
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdownCaiDat">
                <router-link
                  to="/quanlynguoidung"
                  class="dropdown-item"
                  href="#"
                  >Quản Lý Người Dùng</router-link
                >
                <router-link
                  to="/quanlyphongkham"
                  class="dropdown-item"
                  href="#"
                  >Quản Lý Phòng Khám</router-link
                >
                <router-link
                  to="/quanlydichvu"
                  class="dropdown-item"
                  href="#"
                  >Quản Lý Dịch Vụ</router-link
                >
              </div>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <span v-if="user">Xin Chào {{ role_text + ' '+user.fullname}}</span>
            <a class="nav-link" href="#" @click="logout()"
              ><i class="bi bi-send"></i> Đăng Xuất</a
            >
          </form>
        </div>
      </nav>
    </div>
    <div id="body">
      <router-view></router-view>
    </div>
    <div id="footer">
      <footer>
        <ul class="nav justify-content-center">
            <li class="nav-item">
              <router-link to="/quanlylichkham" class="nav-link" href="#"
                ><i class="bi bi-people-fill"></i> Lịch Khám</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/khamchuabenh" class="nav-link" href="#"
                ><i class="bi bi-bar-chart-line-fill"></i> Khám Chữa Bệnh</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/quanlybenhnhan" class="nav-link" href="#"
                ><i class="bi bi-people-fill"></i> Bệnh Nhân</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/quanlykhothuoc" class="nav-link" href="#"
                ><i class="bi bi-people-fill"></i> Kho Thuốc</router-link
              >
            </li>
        </ul>
      </footer>
    </div>
  </div>
</template>
<script>
import AllcodesService from "@/services/AllcodesService";

export default {
  components: {},
  data() {
    return {
      user: this.$store.state.user,
      roles: [],
      role_text: undefined
    };
  },
  async created() {
    this.roles = await this.getRoles();
    this.validationRole();
  },
  watch: {},
  methods: {
    logout: function () {
      this.$store.dispatch("clearState");
      this.$router.push("/login");
    },
    validationRole(){
        this.roles.forEach(role => {
          if(role.key == this.user.role){
            this.role_text = role.value;
          }
      });
    },
    async getRoles() {
      try {
        const res = await AllcodesService.index({
          type: "ROLE",
        });
        if (res.data.success) {
          return res.data.data;
        } else {
          return [];
        }
      } catch (err) {
        return [];
      }
    },
  },
};
</script>
<style lang="css" scope>
html,
body,
.App {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
#container {
  min-height: 100%;
  position: relative;
}
#container {
  height: 100%;
}
#header {
  padding: 0;
  top: 0;
  left: 0;
  width: 100%;
}
#body {
  box-sizing: border-box;
  padding: 0 36px;
  overflow: auto;
  position: relative;
  padding-top: 15px;
  padding-bottom: 115px;
  background-color: #edeff0;
  width: 100%;
  height: 100%;
}
#body > div {
  width: 100%;
  height: 100%;
}
#footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
  padding: 0;
  background: #fff;
  border-top: 1px solid #e1e1e1;
  z-index: 3;
}
</style>