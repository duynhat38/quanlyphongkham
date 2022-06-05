<template>
  <div class="App">
    <div class="col-md-12 header-top">
      <div class="container">
        <div class="row">
          <div class="col-sm-6 col-xs-12">
            <div class="header-links header-description">
              <div class="row">
                <div class="col-md-12" id="name_company">
                  <a href="/"
                    ><img
                      src="/static/img/logo.png"
                      style="width: 45px; height: 45px; border-radius: 50%"
                  /></a>
                  <span> Hệ thống quản lý phòng khám</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-4 col-xs-12" style="margin-top: 10px">
            <div class="header-links header-description">
              <div class="row">
                <div class="col-md-12">
                  <span>
                    <i class="fa fa-phone fa-1x" aria-hidden="true"></i>
                    Hotline: 0999.999.999
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-2 col-xs-12" style="margin-top: 10px">
            <div class="header-links header-description">
              <router-link :to="'/login'"><span>Đăng nhập</span></router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="main-container-home" class="container">
      <router-view></router-view>
    </div>
    <div id="footer-landingpage">
      <footer>
        <div class="container">
          <div class="row">
            <div class="col-md-6">
              <span style="font-size: 20px">Phòng Khám Demo </span><br />
            </div>
            <div class="col-md-3" style="cursor: pointer">
              <span>Liên hệ với chúng tôi</span><br />
              <span>Hỏi đáp thắc mắc</span><br />
              <span>Tư vấn sức khoẻ</span><br />
            </div>
            <div class="col-md-3" style="cursor: pointer">
              <span>Fanpage</span><br />
              <span>Hướng dẫn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
<style lang="css" scope>
.header-top {
  background: #006b39;
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 10%;
  padding-right: 10%;
}
.header-links,
.header-links > a {
  color: #fff;
  padding: 10px;
}
.header-description > a {
  text-decoration: none;
}
#main-container-home {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 36px;
  overflow: auto;
  position: relative;
  padding-top: 15px;
  padding-bottom: 50px;
}
#footer-landingpage {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
  padding: 0;
  background: #006b39;
  z-index: 3;
  padding: 15px;
  color: #ffffff;
  margin-top: 1%;
}
</style>