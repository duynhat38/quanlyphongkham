<template>
    <div>
        <vue-bootstrap4-table id="table" :rows="rows" :columns="columns" :config="config" :actions="actions"
            @addBooking="addBooking">
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
                <span><i class="bi bi-card-checklist" @click="editBooking(props.row)"
                        v-b-modal="'EditBookingModal'"></i></span>
            </template>
            <template slot="remove" slot-scope="props">
                <span><i class="bi bi-shield-x" @click="removeBooking(props.row)"></i></span>
            </template>
            <template slot="healthcare" slot-scope="props">
                <span><i class="bi bi-credit-card-2-back-fill" @click="healthCareBooking(props.row)"
                        v-b-modal="'KhamChuaBenhModal'"></i></span>
            </template>
            <template slot="date" slot-scope="props">
                {{ formatterDate(props.cell_value) }}
            </template>
            <template slot="status" slot-scope="props">
                {{ changeStatus(props.cell_value) }}
            </template>
        </vue-bootstrap4-table>
        <edit-booking :booking="bookingEdit" :clinics="clinics" :statuss="statuss" :services="services"
            @editMode="handleEditMode"></edit-booking>
        <phieu-kham-chua-benh :booking="bookingHealthCare" :services="services" @editMode="handleEditMode"></phieu-kham-chua-benh>
    </div>
</template>
<script>
import VueBootstrap4Table from "vue-bootstrap4-table";
import BookingsService from "@/services/BookingsService";
import ServicesService from "@/services/ServicesService";
import ClinicsService from "@/services/ClinicsService";
import AllcodesService from "@/services/AllcodesService";
import EditBooking from "@/components/EditBooking.vue";
import PhieuKhamChuaBenh from "@/components/PhieuKhamChuaBenh.vue";
import moment from "moment";
import SpecialtiesService from "../services/SpecialtiesService";

export default {
    components: {
        VueBootstrap4Table,
        EditBooking,
        PhieuKhamChuaBenh
    },
    data() {
        return {
            specialty: null,
            statuss: [],
            clinics: [],
            services: [],
            bookingEdit: null,
            bookingHealthCare: null,
            rows: [],
            columns: [
                {
                    label: "Phòng Khám",
                    name: "clinic.name",
                },
                {
                    label: "Ngày",
                    name: "date",
                    slot_name: "date",
                },
                {
                    label: "Email",
                    name: "email",
                },
                {
                    label: "Họ Tên",
                    name: "fullname",
                },
                {
                    label: "Số điện thoại",
                    name: "phone",
                },
                {
                    label: "Giới Tính",
                    name: "gender",
                },
                {
                    label: "Trạng Thái",
                    name: "status",
                    slot_name: "status",
                },
                {
                    label: "Chi Tiết",
                    name: "",
                    slot_name: "change",
                },
                {
                    label: "Phiếu Khám Chữa Bệnh",
                    name: "",
                    slot_name: "healthcare",
                },
                {
                    label: "Xoá",
                    name: "",
                    slot_name: "remove",
                },
            ],
            actions: [
                {
                    btn_text: "Thêm Lịch Khám",
                    event_name: "addBooking",
                    class: "btn btn-primary",
                },
            ],
            config: {
                checkbox_rows: false,
                show_refresh_button: false,
                show_reset_button: false,
                rows_selectable: true,
                card_title: "Khám Chữa Bệnh",
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
        this.specialty = await this.findSpecialtyByDoctor(this.$store.state.user._id);
        if(!this.specialty){
            return this.alertDisplay('Thông Báo', 'Bạn chưa được phân nhiệm vụ cho chuyên khoa nào trong phòng khám !','info');
        }
        this.rows = await this.getAllBookingsBySpecialty(this.specialty._id);
        this.clinics = await this.getAllClinic();
        this.statuss = await this.getStatuss();
        this.services = await this.getAllService();
    },
    watch: {},
    methods: {
        changeStatus: function (status) {
            var status_value = null;
            this.statuss.forEach(item => {
                if (item.key == status) {
                    status_value = item.value;
                }
            })
            return status_value;
        },
        formatterDate: function (value) {
            return moment(value).format("DD/MM/YYYY");
        },
        handleEditMode: async function () {
            this.rows = await this.getAllBookingsBySpecialty(this.specialty._id);
        },
        addBooking() {
            this.bookingEdit = null;
            this.$bvModal.show("EditBookingModal");
        },
        async editBooking(payload) {
            const booking = await this.getDataBooking(payload._id);
            if (booking) {
                this.bookingEdit = booking;
            }
        },
        healthCareBooking(booking) {
            this.bookingHealthCare = booking;
        },
        removeBooking(booking) {
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
                        const del = await BookingsService.delete({
                            bookingId: booking._id,
                        });
                        if (del) {
                            if (del.data.success) {
                                this.rows = await this.getAllBookingsBySpecialty(this.specialty._id);
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
        async findSpecialtyByDoctor(doctorId) {
            try {
                const res = await SpecialtiesService.findSpecialtyByDoctor({
                    doctorId: doctorId
                });
                if (res.data.success) {
                    return res.data.data;
                } else {
                    return null;
                }
            } catch (err) {
                return null;
            }
        },
        async getAllBookingsBySpecialty(specialtyId) {
            try {
                const response = await BookingsService.getAllBookingsBySpecialty({
                    specialtyId: specialtyId
                });
                if (response) {
                    if (response.data.success) {
                        return response.data.data;
                    }
                }
            } catch (error) {
                return [];
            }
        },
        async getDataBooking(bookingId) {
            try {
                const res = await BookingsService.getBooking(bookingId);
                if (res.data.success) {
                    return res.data.data;
                } else {
                    return null;
                }
            } catch (err) {
                return null;
            }
        },
        async getStatuss() {
            try {
                const res = await AllcodesService.index({
                    type: "STATUS",
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