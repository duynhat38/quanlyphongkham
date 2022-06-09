<template>
  <div>
    <vue-bootstrap4-table id="table" :rows="rows" :columns="columns" :config="config" :actions="actions"
      @addAccount="addAccount">
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
        <span><i class="bi bi-card-checklist" @click="editAccount(props.row)" v-b-modal="'EditAccountModal'"></i></span>
      </template>
      <template slot="remove" slot-scope="props">
        <span><i class="bi bi-shield-x" @click="removeAccount(props.row)"></i></span>
      </template>
      <template slot="change_role" slot-scope="props">
        {{ changeRole(props.row.role) }}
      </template>
    </vue-bootstrap4-table>
    <edit-account :account="accountEdit" :roles="roles" :clinics="clinics" :specialties="specialties"
      @editMode="handleEditMode"></edit-account>
  </div>
</template>
<script>
import VueBootstrap4Table from "vue-bootstrap4-table";
import UsersService from "@/services/UsersService";
import AllcodesService from "@/services/AllcodesService";
import EditAccount from "@/components/EditAccount.vue";
import ClinicsService from "@/services/ClinicsService";
import SpecialtiesService from "@/services/SpecialtiesService";

export default {
  components: {
    VueBootstrap4Table,
    EditAccount
  },
  data() {
    return {
      accountEdit: null,
      clinics: [],
      specialties: [],
      roles: [],
      rows: [],
      columns: [
        {
          label: "Email",
          name: "email",
        },
        {
          label: "Họ Tên",
          name: "fullname",
        },
        {
          label: "Nhóm Người Dùng",
          name: "role",
          slot_name: "change_role",
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
          btn_text: "Thêm Tài Khoản",
          event_name: "addAccount",
          class: "btn btn-primary",
        },
      ],
      config: {
        checkbox_rows: false,
        show_refresh_button: false,
        show_reset_button: false,
        rows_selectable: true,
        card_title: "Quản Lý Tài Khoản Người Dùng",
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
    this.rows = await this.getAllAccount();
    this.roles = await this.getRoles();
    this.clinics = await this.getAllClinic();
    this.specialties = await this.getAllSpecialty();
  },
  watch: {},
  methods: {
    handleEditMode: async function () {
      this.rows = await this.getAllAccount();
    },
    changeRole(role) {
      var role_value = null;
      this.roles.forEach(item => {
        if (item.key == role) {
          role_value = item.value;
        }
      })
      return role_value;
    },
    addAccount() {
      this.accountEdit = null;
      this.$bvModal.show("EditAccountModal");
    },
    async editAccount(payload) {
      const account = await this.getDataAccount(payload._id);
      if (account) {
        this.accountEdit = account;
      }
    },
    removeAccount(account) {
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
            const del = await UsersService.delete({
              userId: account._id,
            });
            if (del) {
              if (del.data.success) {
                this.rows = await this.getAllAccount();
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
    async getAllAccount() {
      try {
        const response = await UsersService.all();
        if (response) {
          if (response.data.success) {
            return response.data.data;
          }
        }
      } catch (error) {
        return [];
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
    async getRoles() {
      try {
        const res = await AllcodesService.index({
          type: "ROLE",
        });
        if (res.data.success) {
          return res.data.data;
        } else {
          return [];
        }
      } catch (err) {
        return [];
      }
    },
    async getDataAccount(UserId) {
      try {
        const res = await UsersService.getUser(UserId);
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