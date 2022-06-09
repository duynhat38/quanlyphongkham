<template>
  <b-modal id="EditBookingModal" title="Chi Tiết Lịch Hẹn" @ok="handleOk" ok-title="Cập nhật" cancel-title="Thoát"
    size="lg">
    <div class="col-sm-12">
      <div>
        <h5>Thông tin bệnh nhân</h5>
        <div class="row">
          <div class="col-md-6">
            <label class="control-label">Họ tên</label>
            <div class="form-group has-feedback">
              <input id="patientsName" name="patientsName" type="text" class="form-control" placeholder="Họ tên"
                maxlength="150" data-batbuoc="true" data-msg="họ tên" v-model="fullname" :disabled="booking" required />
            </div>
          </div>
          <div class="col-md-6">
            <label class="control-label">Số điện thoại</label>
            <div class="form-group has-feedback">
              <input id="PhoneNumber" name="PhoneNumber" type="number" class="form-control number"
                pattern="/^-?\d+\.?\d*$/" onkeypress="if(this.value.length==12) return false;"
                placeholder="Số điện thoại" minlength="10" maxlength="11" size="11" data-batbuoc="true"
                data-msg="số điện thoại" v-model="phone" :disabled="booking" required />
            </div>
          </div>
          <div class="col-md-6">
            <label class="control-label">Email</label>
            <div class="form-group has-feedback">
              <input id="Email" name="Email" type="text" class="form-control"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" placeholder="Email" data-batbuoc="true"
                data-msg="Email" v-model="email" :disabled="booking" required />
            </div>
          </div>
          <div class="col-md-6">
            <label>Giới tính (*)</label>
            <div class="form-group">
              <select id="gender" name="gender" class="form-control" data-batbuoc="true" data-msg="giới tính"
                v-model="gender" :disabled="booking">
                <option value='null'>Chọn Giới Tính</option>
                <option value="Nam">Nam</option>
                <option value="Nu">Nữ</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-sm-12">
      <h5>Thông tin lịch hẹn</h5>
      <div class="row">
        <div class="col-md-6">
          <label for="example-datepicker">Ngày khám</label>
          <b-form-datepicker id="example-datepicker" v-model="date" placeholder="Chọn ngày khám" :min="min">
          </b-form-datepicker>
        </div>
        <div class="col-md-12">
          <label class="control-label">Lý do khám</label>
          <div class="form-group">
            <textarea id="lydokham" name="lydokham" type="text" class="form-control" v-model="reason"></textarea>
          </div>
        </div>
        <div class="col-md-12">
          <label class="control-label">Phòng khám <span class="batbuoc"></span></label>
          <div class="form-group">
            <select id="phongkham" name="phongkham" class="form-control" data-batbuoc="true" data-msg="phòng khám"
              v-model="clinic">
              <option value='null'>Chọn Phòng Khám</option>
              <option v-for="(item, index) in clinics" :key="index" :value="item">
                {{ item.name }}
              </option>
            </select>
          </div>
          <div v-if="clinic && clinic.address">
            <code>Địa Chỉ Phòng Khám: {{ clinic.address }}</code>
          </div>
        </div>
        <div class="col-md-6" v-if="!isAddBooking">
          <label class="control-label">Trạng Thái</label>
          <div class="form-group">
            <select id="status" name="status" class="form-control" data-batbuoc="true" data-msg="status"
              v-model="status">
              <option v-for="(item, index) in statuss" :key="index" :value="item.key">
                {{ item.value }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import BookingsService from "@/services/BookingsService";
export default {
  props: ["booking", "clinics", "statuss"],
  data() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const minDate = new Date(today);
    return {
      min: minDate,
      fullname: null,
      phone: null,
      email: null,
      gender: null,
      identity_card: null,
      isAddBooking: true,
      date: null,
      reason: null,
      clinic: null,
      status: null
    };
  },
  watch: {
    booking: function (booking) {
      if (!booking) {
        this.fullname = null;
        this.phone = null;
        this.email = null;
        this.gender = null;
        this.identity_card = null;
        this.isAddBooking = true;
        this.date = null;
        this.reason = null;
        this.clinic = null;
        this.status = null;
      } else {
        this.fullname = booking.fullname;
        this.phone = booking.phone;
        this.email = booking.email;
        this.gender = booking.gender;
        this.identity_card = booking.identity_card;
        this.isAddBooking = false;
        this.date = booking.date;
        this.reason = booking.reason;
        this.clinic = booking.clinic;
        this.status = booking.status;
      }
    },
  },
  created() {
    if (this.booking) {
      this.isAddBooking = false;
    } else {
      this.isAddBooking = true;
    }
  },
  methods: {
    handleOk: async function (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      if (this.isAddBooking) {
        if (
          !this.fullname ||
          !this.phone ||
          !this.email ||
          !this.gender ||
          !this.date ||
          !this.clinic._id
        ) {
          this.$toastr.error("Vui lòng điền đầy đủ thông tin", "Error", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
          return;
        }
        var create = await this.bookingCreate(
          this.fullname,
          this.phone,
          this.email,
          this.gender,
          this.date,
          this.reason,
          this.clinic._id,
          'Confirmed'
        );
        if (create.success) {
          this.$bvModal.hide("EditBookingModal");
          this.$emit("editMode");
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
      } else {
        var edit = await this.editBooking(
          this.booking._id,
          this.status,
          this.date,
          this.reason,
          this.clinic._id
        );
        if (edit.success) {
          this.$emit("editMode");
          this.$bvModal.hide("EditBookingModal");
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
    editBooking: async function (
      bookingId,
      status,
      date,
      reason,
      clinicId,
    ) {
      try {
        const response = await BookingsService.edit({
          bookingId: bookingId,
          status: status,
          date: date,
          reason: reason,
          clinicId: clinicId
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },
    async bookingCreate(
      fullname,
      phone,
      email,
      gender,
      date,
      reason,
      clinicId,
      status
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
          status: status,
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