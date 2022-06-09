<template>
  <vue-bootstrap4-table
    :rows="rows"
    :columns="columns"
    :config="config"
    :actions="actions"
    @on-download="onDownload"
  >
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
      <span><i class="bi bi-credit-card-2-front" @click="change(props.row)"></i></span>
    </template>
  </vue-bootstrap4-table>
</template>
<script>
import VueBootstrap4Table from "vue-bootstrap4-table";
export default {
  components: {
    VueBootstrap4Table,
  },
  data() {
    return {
      rows: [
        {
          id: 1,
          name: {
            first_name: "Vladimir",
            last_name: "Nitzsche",
          },
          address: {
            country: "Mayotte",
          },
          email: "franecki.anastasia@gmail.com",
        },
        {
          id: 2,
          name: {
            first_name: "Irwin",
            last_name: "Bayer",
          },
          age: 23,
          address: {
            country: "Guernsey",
          },
          email: "rlittle@macejkovic.biz",
        },
        {
          id: 3,
          name: {
            first_name: "Don",
            last_name: "Herman",
          },
          address: {
            country: "Papua New Guinea",
          },
          email: "delia.becker@cormier.com",
        },
        {
          id: 4,
          name: {
            first_name: "Don",
            last_name: "Herman",
          },
          address: {
            country: "Papua New Guinea",
          },
          email: "delia.becker@cormier.com",
        },
      ],
      columns: [
        {
          label: "#",
          name: "id",
        },
        {
          label: "Họ Tên",
          name: "name.first_name",
        },
        {
          label: "Giới Tính",
          name: "email",
        },
        {
          label: "Tuổi",
          name: "address.country",
        },
        {
          label: "Điện Thoại",
          name: "address.country",
        },
        {
          label: "Địa Chỉ",
          name: "address.country",
        },
        {
          label: "Sửa",
          name: "",
          slot_name: "change",
        },
      ],
      actions: [
        {
          btn_text: "Download",
          event_name: "on-download",
          class: "btn btn-primary",
          event_payload: {
            msg: "my custom msg",
          },
        },
      ],
      config: {
        checkbox_rows: false,
        show_refresh_button: false,
        show_reset_button: false,
        rows_selectable: true,
        card_title: "Bệnh Nhân",
        pagination: true, // default true
        pagination_info: true, // default true
        num_of_visibile_pagination_buttons: 7, // default 5
        per_page: 7, // default 10
        per_page_options: [5, 10, 20, 30],
        global_search: {
          placeholder: "Nhập tên bệnh nhân",
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
  created() {},
  methods: {
    onDownload(payload) {
      console.log(payload);
    },
    change(payload) {
      console.log(payload);
      alert(payload.address.country)
    },
  },
};
</script>