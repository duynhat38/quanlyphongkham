<template>
  <b-modal id="EditClinicModal" :title="name" @ok="handleOk" ok-title="Cập nhật" cancel-title="Thoát" size="lg">
    <div class="col-sm-12">
      <div>
        <div class="row">
          <div class="col-md-6">
            <label class="control-label">Tên Phòng Khám</label>
            <div class="form-group has-feedback">
              <input type="text" class="form-control" placeholder="Tên Phòng Khám" maxlength="150" data-batbuoc="true"
                data-msg="Tên Phòng Khám" v-model="name" required />
            </div>
          </div>
          <div class="col-md-6">
            <label class="control-label">Địa Chỉ Phòng Khám</label>
            <div class="form-group has-feedback">
              <input type="text" class="form-control" placeholder="Địa Chỉ Phòng Khám" maxlength="150"
                data-batbuoc="true" data-msg="Địa Chỉ Phòng Khám" v-model="address" required />
            </div>
          </div>
          <div class="col-md-12 row" v-if="!isAddClinic">
            <div class="col-md-6">
              <div class="control-label">Danh Sách Chuyên Khoa <span class="badge badge-success badge-pill"
                  v-if="clinic">{{
                      clinic.specialties.length
                  }} </span></div>
              <span class="badge badge-primary badge-pill"><i class="bi bi-card-checklist"
                  v-b-modal="'EditSpecialtyModal'"> Thêm Chuyên Khoa</i></span>
              <edit-chuyen-khoa :clinic="clinic" :doctors="clinic.doctors" :specialty="specialtyEdit"
                @editMode="handleEditMode">
              </edit-chuyen-khoa>
              <ul class="list-group" v-if="clinic && clinic.specialties.length > 0">
                <li class="list-group-item d-flex justify-content-between align-items-center"
                  v-for="(item, index) in clinic.specialties" :key="index">
                  {{ item.name }}
                  <span class="badge badge-info badge-pill" v-if="item.doctor && item.doctor.fullname">Bác Sĩ: {{
                      item.doctor.fullname
                  }}</span>
                  <span class="badge badge-danger badge-pill" v-else>Chưa có Bác Sĩ</span>
                  <span class="badge badge-info badge-pill"><i class="bi bi-card-checklist"
                      @click="editChuyenKhoa(item)" v-b-modal="'EditSpecialtyModal'"></i></span>
                  <span class="badge badge-danger badge-pill" @click="removeChuyenKhoa(item._id, clinic._id)"><i
                      class="bi bi-shield-x"></i></span>
                </li>
              </ul>
              <code v-else> Phòng khám chưa có chuyên khoa!</code>
            </div>
            <div class="col-md-6">
              <div class="control-label">Danh Sách Bác Sĩ <span class="badge badge-success badge-pill" v-if="clinic">{{
                  clinic.doctors.length
              }} </span></div>
              <span class="badge badge-primary badge-pill"><i class="bi bi-card-checklist" v-b-modal="'AddDoctorModal'">
                  Thêm Bác Sĩ</i></span>
              <them-bac-si :clinic="clinic" @editMode="handleEditMode">
              </them-bac-si>
              <ul class="list-group" v-if="clinic && clinic.doctors.length > 0">
                <li class="list-group-item d-flex justify-content-between align-items-center"
                  v-for="(item, index) in clinic.doctors" :key="index">
                  {{ item.fullname }}
                  <span class="badge badge-danger badge-pill" @click="removeBacSi(item._id, clinic._id)"><i
                      class="bi bi-shield-x"></i></span>
                </li>
              </ul>
              <code v-else> Phòng khám chưa có bác sĩ!</code>
            </div>
            <div class="col-md-6">
              <div class="control-label">Danh Sách Tiếp Tân <span class="badge badge-success badge-pill"
                  v-if="clinic">{{
                      clinic.receptionists.length
                  }} </span></div>
              <span class="badge badge-primary badge-pill"><i class="bi bi-card-checklist"
                  v-b-modal="'AddReceptionistModal'">
                  Thêm Tiếp Tân</i></span>
              <them-tiep-tan :clinic="clinic" @editMode="handleEditMode">
              </them-tiep-tan>
              <ul class="list-group" v-if="clinic && clinic.receptionists.length > 0">
                <li class="list-group-item d-flex justify-content-between align-items-center"
                  v-for="(item, index) in clinic.receptionists" :key="index">
                  {{ item.fullname }}
                  <span class="badge badge-danger badge-pill" @click="removeTiepTan(item._id, clinic._id)"><i
                      class="bi bi-shield-x"></i></span>
                </li>
              </ul>
              <code v-else> Phòng khám chưa có tiếp tân!</code>
            </div>
            <div class="col-md-6">
              <div class="control-label">Danh Sách Dược Sĩ <span class="badge badge-success badge-pill" v-if="clinic">{{
                  clinic.pharmacists.length
              }} </span></div>
              <span class="badge badge-primary badge-pill"><i class="bi bi-card-checklist" v-b-modal="'AddPharmacistModal'">
                  Thêm Dược Sĩ</i></span>
              <them-duoc-si :clinic="clinic" @editMode="handleEditMode">
              </them-duoc-si>
              <ul class="list-group" v-if="clinic && clinic.pharmacists.length > 0">
                <li class="list-group-item d-flex justify-content-between align-items-center"
                  v-for="(item, index) in clinic.pharmacists" :key="index">
                  {{ item.fullname }}
                  <span class="badge badge-danger badge-pill" @click="removeDuocSi(item._id, clinic._id)"><i
                      class="bi bi-shield-x"></i></span>
                </li>
              </ul>
              <code v-else> Phòng khám chưa có dược sĩ!</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import ClinicsService from "@/services/ClinicsService";
import SpecialtiesService from "@/services/SpecialtiesService";
import EditChuyenKhoa from "@/components/EditChuyenKhoa.vue";
import ThemBacSi from "@/components/ThemBacSi.vue";
import ThemDuocSi from "@/components/ThemDuocSi.vue";
import ThemTiepTan from "@/components/ThemTiepTan.vue";

export default {
  components: {
    EditChuyenKhoa,
    ThemBacSi,
    ThemDuocSi,
    ThemTiepTan
  },
  props: ["clinic"],
  data() {
    return {
      name: null,
      address: null,
      isAddClinic: true,
      specialtyEdit: null,
    };
  },
  watch: {
    clinic: function (clinic) {
      if (!clinic) {
        this.name = null;
        this.address = null;
        this.isAddClinic = true;
      } else {
        this.name = clinic.name;
        this.address = clinic.address;
        this.isAddClinic = false;
      }
    },
  },
  mounted() { },
  created() {
    if (this.clinic) {
      this.isAddClinic = false;
    } else {
      this.isAddClinic = true;
    }
  },
  methods: {
    editChuyenKhoa(specialty) {
      this.specialtyEdit = specialty;
    },
    removeChuyenKhoa(specialtyId, clinicId) {
      this.$swal({
        title: "Bạn có chắc chắn muốn xoá không ?",
        text:
          "Tất cả dữ liệu cũng sẽ bị xóa. Bạn không thể phục hồi dữ liệu nếu đồng ý tiếp tục",
        type: "warning",
        icon: "warning",
        closeModal: true,
        buttons: ["Trở lại", "Tiếp Tục"]
      }).then(async result => {
        if (result) {
          try {
            const del = await SpecialtiesService.delete({
              specialtyId: specialtyId,
              clinicId: clinicId
            });
            if (del) {
              if (del.data.success) {
                this.$emit('editClinic')
                this.alertDisplay(
                  "Thông báo",
                  del.data.message,
                  "success"
                );
              } else {
                this.alertDisplay("Error", del.data.message, "error");
              }
            } else {
              this.alertDisplay("Error", "Server không phản hồi !!!", "error");
            }
          } catch (error) {
            this.alertDisplay("Error", error.response.data.message, "error");
          }
        } else {
          this.alertDisplay(
            "Thông báo",
            "Bạn đã hủy yêu cầu xóa dữ liệu",
            "info"
          );
        }
      });
    },
    removeBacSi(doctorId, clinicId) {
      this.$swal({
        title: "Bạn có chắc chắn muốn xoá không ?",
        text:
          "Tất cả dữ liệu cũng sẽ bị xóa. Bạn không thể phục hồi dữ liệu nếu đồng ý tiếp tục",
        type: "warning",
        icon: "warning",
        closeModal: true,
        buttons: ["Trở lại", "Tiếp Tục"]
      }).then(async result => {
        if (result) {
          try {
            const del = await ClinicsService.deleteDoctor({
              doctorId: doctorId,
              clinicId: clinicId
            });
            if (del) {
              if (del.data.success) {
                this.$emit('editClinic')
                this.alertDisplay(
                  "Thông báo",
                  del.data.message,
                  "success"
                );
              } else {
                this.alertDisplay("Error", del.data.message, "error");
              }
            } else {
              this.alertDisplay("Error", "Server không phản hồi !!!", "error");
            }
          } catch (error) {
            this.alertDisplay("Error", error.response.data.message, "error");
          }
        } else {
          this.alertDisplay(
            "Thông báo",
            "Bạn đã hủy yêu cầu xóa dữ liệu",
            "info"
          );
        }
      });
    },
    removeTiepTan(receptionistId, clinicId) {
      this.$swal({
        title: "Bạn có chắc chắn muốn xoá không ?",
        text:
          "Tất cả dữ liệu cũng sẽ bị xóa. Bạn không thể phục hồi dữ liệu nếu đồng ý tiếp tục",
        type: "warning",
        icon: "warning",
        closeModal: true,
        buttons: ["Trở lại", "Tiếp Tục"]
      }).then(async result => {
        if (result) {
          try {
            const del = await ClinicsService.deleteReceptionist({
              receptionistId: receptionistId,
              clinicId: clinicId
            });
            if (del) {
              if (del.data.success) {
                this.$emit('editClinic')
                this.alertDisplay(
                  "Thông báo",
                  del.data.message,
                  "success"
                );
              } else {
                this.alertDisplay("Error", del.data.message, "error");
              }
            } else {
              this.alertDisplay("Error", "Server không phản hồi !!!", "error");
            }
          } catch (error) {
            this.alertDisplay("Error", error.response.data.message, "error");
          }
        } else {
          this.alertDisplay(
            "Thông báo",
            "Bạn đã hủy yêu cầu xóa dữ liệu",
            "info"
          );
        }
      });
    },
    removeDuocSi(pharmacistId, clinicId) {
      this.$swal({
        title: "Bạn có chắc chắn muốn xoá không ?",
        text:
          "Tất cả dữ liệu cũng sẽ bị xóa. Bạn không thể phục hồi dữ liệu nếu đồng ý tiếp tục",
        type: "warning",
        icon: "warning",
        closeModal: true,
        buttons: ["Trở lại", "Tiếp Tục"]
      }).then(async result => {
        if (result) {
          try {
            const del = await ClinicsService.deletePharmacist({
              pharmacistId: pharmacistId,
              clinicId: clinicId
            });
            if (del) {
              if (del.data.success) {
                this.$emit('editClinic')
                this.alertDisplay(
                  "Thông báo",
                  del.data.message,
                  "success"
                );
              } else {
                this.alertDisplay("Error", del.data.message, "error");
              }
            } else {
              this.alertDisplay("Error", "Server không phản hồi !!!", "error");
            }
          } catch (error) {
            this.alertDisplay("Error", error.response.data.message, "error");
          }
        } else {
          this.alertDisplay(
            "Thông báo",
            "Bạn đã hủy yêu cầu xóa dữ liệu",
            "info"
          );
        }
      });
    },
    handleEditMode: async function () {
      this.$emit('editClinic')
    },
    handleOk: async function (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      if (this.isAddClinic) {
        if (!this.name || !this.address) {
          this.$toastr.error("Vui lòng điền đầy đủ thông tin", "Error", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
          return;
        }
        var add = await this.addClinic(
          this.name,
          this.address
        );
        if (add.success) {
          this.$bvModal.hide("EditClinicModal");
          this.$emit('editMode')
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
        if (!this.clinic._id || !this.name || !this.address) {
          this.$toastr.error("Vui lòng điền đầy đủ thông tin", "Error", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
          return;
        }
        var edit = await this.editClinic(
          this.clinic._id,
          this.name,
          this.address,
        );
        if (edit.success) {
          this.$emit('editMode')
          this.$bvModal.hide("EditClinicModal");
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
    addClinic: async function (name, address) {
      try {
        const response = await ClinicsService.create({
          name: name,
          address: address
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },
    editClinic: async function (clinicId, name, address) {
      try {
        const response = await ClinicsService.edit({
          clinicId: clinicId,
          name: name,
          address: address
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },
    async getAllSpecialty() {
      try {
        const response = await SpecialtiesService.all();
        if (response) {
          if (response.data.success) {
            return response.data.data;
          }
        }
      } catch (error) {
        return [];
      }
    },
    alertDisplay(title, message, type) {
      switch (type) {
        case "success": {
          this.$toastr.success(message, title, {
            timeOut: 5000,
            progressBar: true,
            closeButton: true
          });
          break;
        }
        case "info": {
          this.$toastr.info(message, title, {
            timeOut: 5000,
            progressBar: true,
            closeButton: true
          });
          break;
        }
        case "warning": {
          this.$toastr.warning(message, title, {
            timeOut: 5000,
            progressBar: true,
            closeButton: true
          });
          break;
        }
        case "error": {
          this.$toastr.error(message, title, {
            timeOut: 5000,
            progressBar: true,
            closeButton: true
          });
          break;
        }
        default: {
          this.$toastr.info(message, title, {
            timeOut: 5000,
            progressBar: true,
            closeButton: true
          });
          break;
        }
      }
    },
  },
};
</script>
<style lang="css" scope>
</style>