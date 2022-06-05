<template>
  <b-modal id="EditBenhNhanModal" title="Thông tin bệnh nhân" @ok="handleOk" ok-title="Cập nhật" cancel-title="Thoát"
    size="lg">
    <div>
      <div class="col-sm-12">
        <div class="row">
          <div class="col-md-6">
            <label class="control-label">Chứng minh nhân dân</label>
            <div class="form-group has-feedback">
              <input id="identity_card" name="identity_card" type="number" class="form-control number"
                placeholder="Chứng minh nhân dân" data-batbuoc="true" data-msg="Chứng minh nhân dân"
                v-model="identity_card" required disabled/>
            </div>
          </div>
          <div class="col-md-6">
            <label class="control-label">Họ tên</label>
            <div class="form-group has-feedback">
              <input id="patientsName" name="patientsName" type="text" class="form-control" placeholder="Họ tên"
                maxlength="150" data-batbuoc="true" data-msg="họ tên" v-model="fullname" required />
            </div>
          </div>
          <div class="col-md-6">
            <label class="control-label">Số điện thoại</label>
            <div class="form-group has-feedback">
              <input id="phone" name="phone" type="number" class="form-control number" placeholder="Số điện thoại"
                minlength="10" maxlength="11" size="11" data-batbuoc="true" data-msg="số điện thoại" v-model="phone"
                required />
            </div>
          </div>
          <div class="col-md-6">
            <label class="control-label">Địa Chỉ</label>
            <div class="form-group has-feedback">
              <input id="address" name="address" type="text" class="form-control" placeholder="Địa Chỉ"
                data-batbuoc="true" data-msg="Địa Chỉ" v-model="address" required />
            </div>
          </div>
          <div class="col-md-6">
            <label>Giới tính</label>
            <div class="form-group">
              <select id="gender" name="gender" class="form-control" data-batbuoc="true" placeholder="giới tính"
                data-msg="giới tính" v-model="gender">
                <option value="Nam">Nam</option>
                <option value="Nu">Nữ</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-12" v-if="!isAddBenhNhan">
        <h6>Lịch sử khám chữa bệnh</h6>
        <div class="row">
          <b>...</b>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import PatientsService from "../services/PatientsService";
export default {
  props: ["patient"],
  data() {
    return {
      fullname: null,
      phone: null,
      address: null,
      gender: null,
      identity_card: null,
      isAddBenhNhan: true,
    };
  },
  watch: {
    patient: function (patient) {
      if (!patient) {
        this.fullname = null;
        this.phone = null;
        this.address = null;
        this.gender = null;
        this.identity_card = null;
        this.isAddBenhNhan = true;
      } else {
        this.fullname = patient.fullname;
        this.phone = patient.phone;
        this.address = patient.address;
        this.gender = patient.gender;
        this.identity_card = patient.identity_card;
        this.isAddBenhNhan = false;
      }
    },
  },
  created() {
    if (this.patient) {
      this.isAddBenhNhan = false;
    } else {
      this.isAddBenhNhan = true;
    }
  },
  methods: {
    handleOk: async function (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      if (this.isAddBenhNhan) {
        if (!this.fullname || !this.phone || !this.gender || !this.address || !this.identity_card) {
          this.$toastr.error("Vui lòng điền đầy đủ thông tin", "Error", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
          return;
        }
        var add = await this.AddBenhNhan(
          this.identity_card,
          this.fullname,
          this.phone,
          this.gender,
          this.address
        );
        if (add.success) {
          this.$bvModal.hide("EditBenhNhanModal");
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
        var edit = await this.editBenhNhan(
          this.identity_card,
          this.fullname,
          this.phone,
          this.gender,
          this.address
        );
        if (edit.success) {
          this.$emit("editMode");
          this.$bvModal.hide("EditBenhNhanModal");
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
    AddBenhNhan: async function (identity_card, fullname, phone, gender, address) {
      try {
        const response = await PatientsService.create({
          identity_card: identity_card,
          fullname: fullname,
          phone: phone,
          gender: gender,
          address: address
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },
    editBenhNhan: async function (
      identity_card,
      fullname,
      phone,
      gender,
      address
    ) {
      try {
        const response = await PatientsService.edit({
          identity_card: identity_card,
          fullname: fullname,
          phone: phone,
          gender: gender,
          address: address,
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