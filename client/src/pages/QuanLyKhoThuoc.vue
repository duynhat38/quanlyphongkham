<template>
  <div>
    <vue-bootstrap4-table id="table" :rows="rows" :columns="columns" :config="config" :actions="actions"
      @addMedicine="addMedicine" @importMedicine="importMedicine">
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
        <span><i class="bi bi-card-checklist" @click="editThuoc(props.row)" v-b-modal="'EditMedicineModal'"></i></span>
      </template>
      <template slot="remove" slot-scope="props">
        <span><i class="bi bi-shield-x" @click="removeThuoc(props.row)"></i></span>
      </template>
    </vue-bootstrap4-table>
    <edit-thuoc :medicine="medicineEdit" @editMode="handleEditMode"></edit-thuoc>
    <nhap-thuoc @editMode="handleEditMode"></nhap-thuoc>
  </div>
</template>
<script>
import VueBootstrap4Table from "vue-bootstrap4-table";
import MedicinesService from "@/services/MedicinesService";
import editThuoc from "@/components/editThuoc.vue";
import nhapThuoc from "@/components/NhapThuoc.vue";

export default {
  components: {
    VueBootstrap4Table,
    editThuoc,
    nhapThuoc
  },
  data() {
    return {
      medicineEdit: null,
      rows: [],
      columns: [
        {
          label: "Tên thuốc",
          name: "name",
        },
        {
          label: "Đơn vị",
          name: "unit",
        },
        {
          label: "Giá bán",
          name: "price",
        },
        {
          label: "Giá nhập",
          name: "import_price",
        },
        {
          label: "Số lượng",
          name: "amount",
        },
        {
          label: "Sửa",
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
          btn_text: "Thêm Thuốc",
          event_name: "addMedicine",
          class: "btn btn-primary",
        },
        {
          btn_text: "Nhập Thuốc",
          event_name: "importMedicine",
          class: "btn btn-info",
        },
      ],
      config: {
        checkbox_rows: false,
        show_refresh_button: false,
        show_reset_button: false,
        rows_selectable: true,
        card_title: "Quản Lý Kho Thuốc",
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
    this.rows = await this.getAllMedicine();
  },
  watch: {},
  methods: {
    handleEditMode: async function () {
      this.rows = await this.getAllMedicine();
    },
    addMedicine() {
      this.medicineEdit = null;
      this.$bvModal.show("EditMedicineModal");
    },
    importMedicine() {
      this.$bvModal.show("ImportMedicineModal");
    },
    async editThuoc(payload) {
      const medicine = await this.getDataMedicine(payload._id);
      if (medicine) {
        this.medicineEdit = medicine;
      }
    },
    removeThuoc(medicine) {
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
            const del = await MedicinesService.delete({
              medicineId: medicine._id
            });
            if (del) {
              if (del.data.success) {
                this.rows = await this.getAllMedicine();
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
    async getAllMedicine() {
      try {
        const response = await MedicinesService.all();
        if (response) {
          if (response.data.success) {
            return response.data.data;
          }
        }
      } catch (error) {
        return [];
      }
    },
    async getDataMedicine(medicineId) {
      try {
        const res = await MedicinesService.getMedicine(medicineId);
        if (res.data.success) {
          return res.data.data;
        } else {
          return null;
        }
      } catch (err) {
        return null;
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