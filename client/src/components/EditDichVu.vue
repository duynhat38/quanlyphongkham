<template>
  <b-modal
    id="EditServiceModal"
    title="Dịch Vụ"
    @ok="handleOk"
    ok-title="Cập nhật"
    cancel-title="Thoát"
  >
    <div class="col-sm-12">
      <div>
        <div class="row">
          <div class="col-md-6">
            <label class="control-label">Tên Dịch Vụ (*)</label>
            <div class="form-group has-feedback">
              <input
                type="text"
                class="form-control"
                placeholder="Tên Dịch Vụ"
                maxlength="150"
                data-batbuoc="true"
                data-msg="Tên Dịch Vụ"
                v-model="name"
                required
              />
            </div>
          </div>
        <div class="col-md-6">
            <label class="control-label">Giá tiền (*)</label>
            <div class="form-group has-feedback">
              <input
                type="number"
                class="form-control"
                placeholder="Giá tiền"
                data-batbuoc="true"
                data-msg="Giá tiền"
                v-model="price"
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import ServicesService from "@/services/ServicesService";
export default {
  props: ["service"],
  data() {
    return {
      name: null,
      price: null,
      isAddService: true,
    };
  },
  watch: {
    service: function (service) {
      if (!service) {
        this.name = null;
        this.price = null;
        this.isAddService = true;
      } else {
        this.name = service.name;
        this.price = service.price;
        this.isAddService = false;
      }
    },
  },
  mounted() {},
  created() {
    if(this.service){
      this.isAddService = false;
    }else{
      this.isAddService = true;
    }
  },
  methods: {
    handleOk: async function (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      if (this.isAddService) {
        if (!this.name || !this.price) {
          this.$toastr.error("Vui lòng điền đầy đủ thông tin", "Error", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
          return;
        }
        var add = await this.addService(
          this.name,
          this.price
        );
        if (add.success) {
          this.$bvModal.hide("EditServiceModal");
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
        if (!this.service._id || !this.name || !this.price) {
          this.$toastr.error("Vui lòng điền đầy đủ thông tin", "Error", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
          return;
        }
        var edit = await this.editService(
          this.service._id,
          this.name,
          this.price,
        );
        if (edit.success) {
          this.$emit('editMode')
          this.$bvModal.hide("EditServiceModal");
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
    addService: async function (name, price) {
      try {
        const response = await ServicesService.create({
          name: name,
          price: price
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },
    editService: async function (serviceId, name, price) {
      try {
        const response = await ServicesService.edit({
          serviceId: serviceId,
          name: name,
          price: price
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