<template>
  <div id="home" class="container">
    <vue-headful title="Trang Chủ" description="Trang Chủ" />
    <div class="row">
        <p>STT: 42</p>
        <p>Họ và tên: Nguyễn Duy Nhật</p>
        <p>Mã SV: AT140732</p>
        <p>Xin chào: {{this.user.email}}</p>
        <a href="" @click="logout()">
          <i class="icofont-logout"></i> Đăng xuất
        </a>
        <router-link to="/change-password">Đổi Mật Khẩu?</router-link>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      user: this.$store.state.user
    };
  },
  async created() {},
  methods: {
    logout: function() {
      this.$store.dispatch('clearState');
      this.$router.push("/login");
    }
  }
};
</script>
<style lang="css" scope>
</style>