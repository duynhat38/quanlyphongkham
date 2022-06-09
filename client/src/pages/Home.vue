<template>
  <div id="home-main">
    <vue-headful title="Trang Chủ" description="Trang Chủ" />
  </div>
</template>
<script>
import QuanLyLichKham from './QuanLyLichKham.vue'
export default {
  components: {QuanLyLichKham},
  data() {
    return {
      user: this.$store.state.user
    };
  },
  async created() {
    if(this.user.role=='admin'){
      this.$router.push("/quanlynguoidung");
    }else if(this.user.role=='bacsi'){
      this.$router.push("/khamchuabenh");
    }else if(this.user.role=='tieptan'){
      this.$router.push("/quanlylichkham");
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch('clearState');
      this.$router.push("/login");
    }
  }
};
</script>
<style lang="css" scope>
#home-main, #home-main > div{
  width: 100%;
  height: 100%;
}
</style>