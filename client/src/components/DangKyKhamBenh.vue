<template>
  <b-modal
    id="modalDangKyKhamBenh"
    title="Đăng Ký Khám Chữa Bệnh Online"
    size="lg"
    @ok="handleOk"
    ok-title="Đăng Ký"
    cancel-title="Thoát"
  >
    <div class="col-sm-12">
      <div class="formDangKy">
        <div class="row">
          <div class="col-md-6">
            <label class="control-label"
              >Họ tên <span class="batbuoc"><code>(*)</code></span></label
            >
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
            <label class="control-label"
              >Số điện thoại
              <span class="batbuoc"><code>(*)</code></span></label
            >
            <div class="form-group has-feedback">
              <input
                id="PhoneNumber"
                name="PhoneNumber"
                type="number"
                class="form-control number"
                pattern="/^-?\d+\.?\d*$/"
                onkeypress="if(this.value.length==12) return false;"
                placeholder="Số điện thoại"
                minlength="10"
                maxlength="11"
                size="11"
                data-batbuoc="true"
                data-msg="số điện thoại"
                v-model="phone"
                required
              />
            </div>
          </div>
          <div class="col-md-6">
            <label class="control-label"
              >Email <span class="batbuoc"><code>(*)</code></span></label
            >
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
                required
              />
            </div>
          </div>
          <div class="col-md-6">
            <label
              >Giới tính <span class="batbuoc"><code>(*)</code></span></label
            >
            <div class="form-group">
              <select
                id="gender"
                name="gender"
                class="form-control"
                data-batbuoc="true"
                data-msg="giới tính"
                v-model="gender"
              >
                <option value='null'>Chọn Giới Tính</option>
                <option value="Nam">Nam</option>
                <option value="Nu">Nữ</option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <label for="example-datepicker"
              >Chọn ngày khám<code>(*)</code></label
            >
            <b-form-datepicker
              id="example-datepicker"
              v-model="date"
              placeholder="Chọn ngày khám"
              :min="min"
            ></b-form-datepicker>
          </div>
          <div class="col-md-12">
            <label class="control-label">Lý do khám</label>
            <div class="form-group">
              <textarea
                id="lydokham"
                name="lydokham"
                type="text"
                class="form-control"
                v-model="reason"
              ></textarea>
            </div>
          </div>
          <div class="col-md-12">
            <label class="control-label"
              >Chọn phòng khám
              <span class="batbuoc"><code>(*)</code></span></label
            >
            <div class="form-group">
              <select
                id="phongkham"
                name="phongkham"
                class="form-control"
                data-batbuoc="true"
                data-msg="phòng khám"
                v-model="clinic"
              >
                <option value='null'>Chọn Phòng Khám</option>
                <option
                  v-for="(item, index) in clinics"
                  :key="index"
                  :value="item"
                >
                  {{ item.name }}
                </option>
              </select>
            </div>
            <div v-if="clinic && clinic.address">
              <code>Địa Chỉ Phòng Khám: {{ clinic.address }}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import ClinicsService from "@/services/ClinicsService";
import BookingsService from "@/services/BookingsService";
export default {
  data() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const minDate = new Date(today);
    return {
      clinics: [],
      min: minDate,
      date: null,
      clinic: null,
      fullname: null,
      phone: null,
      email: null,
      gender: null,
      reason: null,
    };
  },
  async created() {
    this.clinics = await this.getAllClinic();
  },
  watch: {
    date: function (date) {
      console.log(date);
    },
    clinic: function (clinic) {
      console.log(clinic);
    },
  },
  methods: {
    handleOk: async function (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      if (!this.fullname || !this.phone || !this.email || !this.gender || !this.date || !this.clinic._id) {
        this.$toastr.error("Vui lòng điền đầy đủ thông tin", "Error", {
          timeOut: 3000,
          progressBar: true,
          closeButton: true,
        });
        return;
      }
      var create = await this.bookingCreate(this.fullname,this.phone,this.email,this.gender,this.date,this.reason,this.clinic._id);
      if (create.success) {
        this.$bvModal.hide("modalDangKyKhamBenh");
        this.$toastr.success(create.message, "Thông báo", {
          timeOut: 3000,
          progressBar: true,
          closeButton: true,
        });
      } else {
        this.$toastr.error(create.message, "Error", {
          timeOut: 3000,
          progressBar: true,
          closeButton: true,
        });
      }
    },
    async getAllClinic() {
      try {
        const response = await ClinicsService.all();
        if (response) {
          if (response.data.success) {
            return response.data.data;
          }
        }
      } catch (error) {
        return [];
      }
    },
    async bookingCreate(
      fullname,
      phone,
      email,
      gender,
      date,
      reason,
      clinicId
    ) {
      try {
        const response = await BookingsService.create({
          fullname: fullname,
          phone: phone,
          email: email,
          gender: gender,
          date: date,
          reason: reason,
          clinicId: clinicId,
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },
  },
};
</script>
<style lang="css" scoped>
</style>