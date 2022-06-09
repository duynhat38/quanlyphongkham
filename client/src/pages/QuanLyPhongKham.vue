<template>
  <div>
    <vue-bootstrap4-table id="table" :rows="rows" :columns="columns" :config="config" :actions="actions"
      @addPhongKham="addPhongKham">
      <template slot="paginataion-previous-button"> Trước </template>
      <template slot="paginataion-next-button"> Tiếp </template>
      <template slot="pagination-info" slot-scope="props">
        Tổng số trang này là {{ props.currentPageRowsLength }} | Tổng số kết quả
        của bộ lọc là {{ props.filteredRowsLength }} | Tổng dữ liệu ban đầu là
        {{ props.originalRowsLength }}
      </template>
      <template slot="refresh-button-text">
        <i class="fas fa-sync-alt"></i> My refresh
      </template>
      <template slot="reset-button-text">
        <i class="fas fa-broom"></i> My reset
      </template>
      <template slot="empty-results"> Không tìm thấy dữ liệu </template>
      <template slot="change" slot-scope="props">
        <span><i class="bi bi-card-checklist" @click="editPhongKham(props.row)"
            v-b-modal="'EditClinicModal'"></i></span>
      </template>
      <template slot="remove" slot-scope="props">
        <span><i class="bi bi-shield-x" @click="removePhongKham(props.row)"></i></span>
      </template>
    </vue-bootstrap4-table>
    <edit-phong-kham :clinic="clinicEdit" @editClinic="handleEditClinic" @editMode="handleEditMode"></edit-phong-kham>
  </div>
</template>
<script>
import VueBootstrap4Table from "vue-bootstrap4-table";
import ClinicsService from "@/services/ClinicsService";
import EditPhongKham from "@/components/EditPhongKham.vue";

export default {
  components: {
    VueBootstrap4Table,
    EditPhongKham,
  },
  data() {
    return {
      clinicEdit: null,
      rows: [],
      columns: [
        {
          label: "Tên Phòng Khám",
          name: "name",
        },
        {
          label: "Địa Chỉ Phòng Khám",
          name: "address",
        },
        {
          label: "Chi Tiết",
          name: "",
          slot_name: "change",
        },
        {
          label: "Xoá",
          name: "",
          slot_name: "remove",
        },
      ],
      actions: [
        {
          btn_text: "Thêm Phòng Khám",
          event_name: "addPhongKham",
          class: "btn btn-primary",
        },
      ],
      config: {
        checkbox_rows: false,
        show_refresh_button: false,
        show_reset_button: false,
        rows_selectable: true,
        card_title: "Quản Lý Phòng Khám",
        pagination: true, // default true
        pagination_info: true, // default true
        num_of_visibile_pagination_buttons: 5, // default 5
        per_page: 10, // default 10
        per_page_options: [5, 10, 20, 30],
        global_search: {
          placeholder: "Nhập tên cần tìm",
          visibility: true,
          case_sensitive: false,
          showClearButton: false,
          searchOnPressEnter: false,
          searchDebounceRate: 1000,
          init: {
            value: "",
          },
        },
      },
    };
  },
  async created() {
    this.rows = await this.getAllClinic();
  },
  watch: {},
  methods: {
    handleEditMode: async function () {
      this.rows = await this.getAllClinic();
    },
    handleEditClinic: async function () {
      this.clinicEdit = await this.getDataClinic(this.clinicEdit._id);
    },
    addPhongKham() {
      this.clinicEdit = null;
      this.$bvModal.show("EditClinicModal");
    },
    async editPhongKham(payload) {
      const clinic = await this.getDataClinic(payload._id);
      if (clinic) {
        this.clinicEdit = clinic;
      }
    },
    removePhongKham(clinic) {
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
            const del = await ClinicsService.delete({
              clinicId: clinic._id,
            });
            if (del) {
              if (del.data.success) {
                this.rows = await this.getAllClinic();
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
    async getDataClinic(clinicId) {
      try {
        const res = await ClinicsService.getClinic(clinicId);
        if (res.data.success) {
          return res.data.data;
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    },
    deleteClinic: async function (clinicId) {
      try {
        const response = await ClinicsService.delete({
          clinicId: clinicId,
        });
        return response.data;
      } catch (err) {
        return err.response.data;
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
<style scoped>
#table {
  height: 100%;
  width: 100%;
}
</style>