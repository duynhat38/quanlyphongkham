<template>
  <div class="vertical-center">
    <div class="inner-block">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
};
</script>
<style lang="css" scope>
.vertical-center {
  background: #fff url(/static/img/bkg.jpeg) repeat-x center bottom !important;
  background-size: 600px !important;
}
.vertical-center {
  width: 100%;
  height: 100%;
}
.vertical-center {
  display: flex;
  text-align: left;
  justify-content: center;
  flex-direction: column;
}
.vertical-center {
  background: #2554ff;
  min-height: 100vh;
  display: flex;
  font-weight: 400;
}
.inner-block {
  width: 500px;
  margin: auto;
  background: #ffffff;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
  padding: 40px 55px 45px 55px;
  border-radius: 20px;
  transition: all 0.3s;
}
.vertical-center .form-control:focus {
  border-color: #2554ff;
  box-shadow: none;
}

.vertical-center h3 {
  text-align: center;
  margin: 0;
  line-height: 1;
  padding-bottom: 20px;
}
</style>