<template>
  <div>
    <vue-bootstrap4-table id="table" :rows="rows" :columns="columns" :config="config" :actions="actions"
      @addService="addService">
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
        <span><i class="bi bi-card-checklist" @click="editDichVu(props.row)" v-b-modal="'EditServiceModal'"></i></span>
      </template>
      <template slot="remove" slot-scope="props">
        <span><i class="bi bi-shield-x" @click="removeDichVu(props.row)"></i></span>
      </template>
    </vue-bootstrap4-table>
    <edit-dich-vu :service="serviceEdit" @editMode="handleEditMode"></edit-dich-vu>
  </div>
</template>
<script>
import VueBootstrap4Table from "vue-bootstrap4-table";
import ServicesService from "@/services/ServicesService";
import EditDichVu from "@/components/EditDichVu.vue";

export default {
  components: {
    VueBootstrap4Table,
    EditDichVu,
  },
  data() {
    return {
      serviceEdit: null,
      serviceDelete: null,
      rows: [],
      columns: [
        {
          label: "Tên Dịch Vụ",
          name: "name",
        },
        {
          label: "Giá Tiền",
          name: "price",
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
          btn_text: "Thêm Dịch Vụ",
          event_name: "addService",
          class: "btn btn-primary",
        },
      ],
      config: {
        checkbox_rows: false,
        show_refresh_button: false,
        show_reset_button: false,
        rows_selectable: true,
        card_title: "Quản Lý Dịch Vụ",
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
    this.rows = await this.getAllService();
  },
  watch: {},
  methods: {
    handleEditMode: async function () {
      this.rows = await this.getAllService();
    },
    addService() {
      this.serviceEdit = null;
      this.$bvModal.show("EditServiceModal");
    },
    async editDichVu(payload) {
      const service = await this.getDataService(payload._id);
      if (service) {
        this.serviceEdit = service;
      }
    },
    removeDichVu(service) {
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
            const del = await ServicesService.delete({
              serviceId: service._id
            });
            if (del) {
              if (del.data.success) {
                this.rows = await this.getAllService();
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
    async getAllService() {
      try {
        const response = await ServicesService.all();
        if (response) {
          if (response.data.success) {
            return response.data.data;
          }
        }
      } catch (error) {
        return [];
      }
    },
    async getDataService(serviceId) {
      try {
        const res = await ServicesService.getService(serviceId);
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