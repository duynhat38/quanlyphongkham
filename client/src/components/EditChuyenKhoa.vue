<template>
  <b-modal id="EditSpecialtyModal" title="Chuyên Khoa" @ok="handleOk" ok-title="Cập nhật" cancel-title="Thoát">
    <div class="col-sm-12">
      <div>
        <div class="row">
          <div class="col-md-12" v-if="clinic">
            <label class="control-label">Phòng Khám</label>
            <div class="form-group has-feedback">
              <input type="text" class="form-control" placeholder="Tên Phòng Khám" maxlength="150" data-batbuoc="true"
                data-msg="Tên Phòng Khám" v-model="clinic.name" required disabled />
            </div>
          </div>
          <div class="col-md-6">
            <label class="control-label">Tên Chuyên Khoa</label>
            <div class="form-group has-feedback">
              <input type="text" class="form-control" placeholder="Tên Chuyên Khoa" maxlength="150" data-batbuoc="true"
                data-msg="Tên Chuyên Khoa" v-model="name" required />
            </div>
          </div>
          <div class="col-md-6" v-if="!isAddSpecialty">
            <label class="control-label">Chọn Bác Sĩ</label>
            <div class="form-group">
              <select id="doctor" name="doctor" class="form-control" data-batbuoc="true" data-msg="doctor"
                v-model="doctor">
                <option v-for="(item, index) in doctors" :key="index" :value="item">
                  {{ item.fullname }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import SpecialtiesService from "@/services/SpecialtiesService";
import UsersService from "@/services/UsersService";

export default {
  props: ["clinic", "specialty", "doctors"],
  data() {
    return {
      name: null,
      isAddSpecialty: true,
      doctor: null
    };
  },
  watch: {
    specialty: function (specialty) {
      if (!specialty) {
        this.name = null;
        this.isAddSpecialty = true;
      } else {
        this.name = specialty.name;
        this.doctor = specialty.doctor;
        this.isAddSpecialty = false;
      }
    },
  },
  mounted() { },
  async created() {
    if (this.specialty) {
      this.isAddSpecialty = false;
    } else {
      this.isAddSpecialty = true;
    }
  },
  methods: {
    handleOk: async function (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      if (this.isAddSpecialty) {
        if (!this.name || !this.clinic._id) {
          this.$toastr.error("Vui lòng điền đầy đủ thông tin", "Error", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
          return;
        }
        var add = await this.addSpecialty(this.name, this.clinic._id);
        if (add.success) {
          this.$bvModal.hide("EditSpecialtyModal");
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
        if (!this.specialty._id || !this.name) {
          this.$toastr.error("Vui lòng điền đầy đủ thông tin", "Error", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
          return;
        }
        var edit = await this.editSpecialty(this.specialty._id, this.name, this.doctor._id);
        if (edit.success) {
          this.$emit("editMode");
          this.$bvModal.hide("EditSpecialtyModal");
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
    addSpecialty: async function (name, clinicId) {
      try {
        const response = await SpecialtiesService.create({
          name: name,
          clinicId: clinicId
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },
    editSpecialty: async function (specialtyId, name, doctorId) {
      try {
        const response = await SpecialtiesService.edit({
          specialtyId: specialtyId,
          name: name,
          doctorId: doctorId
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