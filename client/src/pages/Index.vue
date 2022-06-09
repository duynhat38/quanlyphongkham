<template>
  <div class="row">
    <div class="col-md-8 width_page_register2">
      <div class="row" id="bacsi_noibat">
        <div class="col-md-12">
          <h3 class="link title_doctor_res">Bác sĩ nổi bật</h3>
        </div>
        <div class="col-md-3 card box_doctor">
          <div style="height: 100%">
            <div class="box_title2">
              <div class="box_img">
                <img src="/static/img/doctor.jpeg" alt="Alternate Text" />
              </div>
              <div class="box_title_label">
                <span><b>Bác Sĩ A</b></span
                ><br /><span></span>
              </div>
            </div>
            <div class="box_content">
              <div class="content_"><p></p></div>
            </div>
          </div>
        </div>
        <div class="col-md-3 card box_doctor">
          <div style="height: 100%">
            <div class="box_title2">
              <div class="box_img">
                <img src="/static/img/doctor.jpeg" alt="Alternate Text" />
              </div>
              <div class="box_title_label">
                <span><b>Bác sĩ B</b></span
                ><br /><span></span>
              </div>
            </div>
            <div class="box_content">
              <div class="content_"><p></p></div>
            </div>
          </div>
        </div>
        <div class="col-md-3 card box_doctor">
          <div style="height: 100%">
            <div class="box_title2">
              <div class="box_img">
                <img src="/static/img/doctor.jpeg" alt="Alternate Text" />
              </div>
              <div class="box_title_label">
                <span><b>Bác Sĩ C</b></span
                ><br /><span></span>
              </div>
            </div>
            <div class="box_content">
              <div class="content_"><p></p></div>
            </div>
          </div>
        </div>
        <div class="col-md-3 card box_doctor">
          <div style="height: 100%">
            <div class="box_title2">
              <div class="box_img">
                <img src="/static/img/doctor.jpeg" alt="Alternate Text" />
              </div>
              <div class="box_title_label">
                <span><b>Bác Sĩ D</b></span
                ><br /><span></span>
              </div>
            </div>
            <div class="box_content">
              <div class="content_"><p></p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4 width_page_register">
      <div class="row">
        <div class="col-md-12 image_page">
          <img
            src="/static/img/logo.png"
            style="width: 100px; height: 100px; border-radius: 50%"
          />
        </div>
        <div class="col-md-12" style="text-align: center">
          <span style="font-weight: bold; color: #006b39"
            >Đăng Ký Lịch Khám</span
          ><br />
        </div>
        <div class="col-md-12" style="text-align: center">
          <button
            type="button"
            class="btn btn-success"
            v-b-modal="'modalDangKyKhamBenh'"
          >
            <i class="fa fa-heartbeat fa-1x" aria-hidden="true">&nbsp;</i> ĐẶT
            LỊCH KHÁM
          </button>
          <dang-ky-kham-benh></dang-ky-kham-benh>
        </div>
      </div>
    </div>
    <div class="col-md-12 width_page_register3">
      <div class="row">
        <div class="col-md-12">
          <h3 class="link hopital_title">Các phòng khám nổi bật</h3>
        </div>
        <div class="col-md-3 card box_hopital">
          <div style="height: 100%">
            <div class="box_title_hopital">
              <div class="box_img">
                <img
                  src="/static/img/logo-phong-kham.jpeg"
                  alt="Alternate Text"
                />
              </div>
              <div class="box_title_label">
                <span><b>Phòng Khám A</b></span
                ><br /><span>Thanh Xuân Trung-Thanh Xuân-Thành phố Hà Nội</span>
              </div>
            </div>
            <div
              class="box_content_hopital"
              style="padding: 3%; margin-left: 3%"
            >
              <div class="content_hop"><p></p></div>
            </div>
          </div>
        </div>
        <div class="col-md-3 card box_hopital">
          <div style="height: 100%">
            <div class="box_title_hopital">
              <div class="box_img">
                <img
                  src="/static/img/logo-phong-kham.jpeg"
                  alt="Alternate Text"
                />
              </div>
              <div class="box_title_label">
                <span><b>Phòng Khám B</b></span
                ><br /><span
                  >Thị trấn Chúc Sơn-Huyện Chương Mỹ-Thành phố Hà Nội</span
                >
              </div>
            </div>
            <div
              class="box_content_hopital"
              style="padding: 3%; margin-left: 3%"
            >
              <div class="content_hop"><p></p></div>
            </div>
          </div>
        </div>
        <div class="col-md-3 card box_hopital">
          <div style="height: 100%">
            <div class="box_title_hopital">
              <div class="box_img">
                <img
                  src="/static/img/logo-phong-kham.jpeg"
                  alt="Alternate Text"
                />
              </div>
              <div class="box_title_label">
                <span><b>Phòng Khám C</b></span
                ><br /><span
                  >Ngõ 28 - Phường Hòa Thọ Tây-Quận Cẩm Lệ-Thành phố Đà
                  Nẵng</span
                >
              </div>
            </div>
            <div
              class="box_content_hopital"
              style="padding: 3%; margin-left: 3%"
            >
              <div class="content_hop"><p></p></div>
            </div>
          </div>
        </div>
        <div class="col-md-3 card box_hopital">
          <div style="height: 100%">
            <div class="box_title_hopital">
              <div class="box_img">
                <img
                  src="/static/img/logo-phong-kham.jpeg"
                  alt="Alternate Text"
                />
              </div>
              <div class="box_title_label">
                <span><b>Phòng Khám D</b></span
                ><br /><span
                  >Ngõ 28 - Xã Đan Phượng-Huyện Đan Phượng-Thành phố Hà
                  Nội</span
                >
              </div>
            </div>
            <div
              class="box_content_hopital"
              style="padding: 3%; margin-left: 3%"
            >
              <div class="content_hop"><p></p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DangKyKhamBenh from "@/components/DangKyKhamBenh.vue";
export default {
  components: {
    DangKyKhamBenh
  },
}
</script>
<style lang="css" scope>
.width_page_register {
  line-height: 3;
  text-align: center;
}
.width_page_register2 {
}
.width_page_register3 {
  border-top: 3px solid #b8becc;
  margin-top: 2%;
}
.box_doctor {
  box-shadow: 0 10px 20px rgb(0 0 0 / 19%), 0 6px 6px rgb(0 0 0 / 23%);
  padding: 10px;
}
.box_title2 {
  height: 55%;
}
.box_title2 img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #c4daea;
}
.box_img {
  width: 40%;
  border-radius: 50%;
  margin: 0 auto;
}
.box_title_label {
  text-align: center;
}
.box_content {
  height: 40%;
}
.content_ {
  margin-top: 2%;
}
.box_hopital {
  padding: 10px;
  box-shadow: 0 10px 20px rgb(0 0 0 / 19%), 0 6px 6px rgb(0 0 0 / 23%);
}
.hopital_title {
  padding-top: 10px;
}
.box_title_hopital img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>