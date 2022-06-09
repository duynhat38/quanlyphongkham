<template>
    <b-modal id="KeDonThuocModal" title="Kê đơn thuốc" @ok="handleOk" ok-title="Cập nhật" cancel-title="Thoát"
        size="xl">
        <div class="col-md-12">
            <div>
                <div class="row">
                    <div class="col-md-6">
                        <p>Họ tên: {{ fullname }}</p>
                    </div>
                    <div class="col-md-6">
                        <p>Số điện thoại: {{ phone }}</p>
                    </div>
                    <div class="col-md-6">
                        <p>Email: {{ email }}</p>
                    </div>
                    <div class="col-md-6">
                        <p>Giới tính: {{ gender }}</p>
                    </div>
                    <div class="col-md-6">
                        <p>Lý do khám: {{ reason }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-6">
                    <label class="control-label">Chuẩn đoán: </label>
                    <div class="form-group">
                        <textarea id="chuandoan" name="chuandoan" type="text" class="form-control"
                            v-model="diagnose"></textarea>
                    </div>
                </div>
                <div class="col-md-6">
                    <label class="control-label">Lời dặn: </label>
                    <div class="form-group">
                        <textarea id="loidan" name="loidan" type="text" class="form-control"
                            v-model="advice"></textarea>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-12 row">
            <div class="col-md-8">
                <h5>Đơn thuốc</h5>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Sản phẩm</th>
                            <th>Đơn vị</th>
                            <th>Số lượng</th>
                            <th>Cách dùng</th>
                            <th>X</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(medicine, index) in select_medicines" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ medicine.name }}</td>
                            <td>{{ medicine.unit }}</td>
                            <td><input type="number" class="form-control" id="usr" v-model="medicine.amount"></td>
                            <td><input type="text" class="form-control" id="usr" v-model="medicine.guide"></td>
                            <td><span class="badge badge-danger badge-pill" @click="huyThuoc(medicine)"><i
                                        class="bi bi-shield-x"></i></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-md-4">
                <h5>Chọn thuốc</h5>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Đơn vị</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(medicine, index) in medicines" :key="index" @click="chonThuoc(medicine)">
                            <td>{{ medicine.name }}</td>
                            <td>{{ medicine.unit }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </b-modal>
</template>
<script>
import MedicinesService from "@/services/MedicinesService";
import PrescriptionsService from "@/services/PrescriptionsService";

export default {
    props: ["booking"],
    data() {
        return {
            fullname: null,
            phone: null,
            email: null,
            gender: null,
            reason: null,
            diagnose: null,
            advice: null,
            medicines: [],
            select_medicines: []
        };
    },
    watch: {
        booking: function (booking) {
            this.diagnose = null;
            this.advice = null;
            this.select_medicines = [];
            if (!booking) {
                this.fullname = null;
                this.phone = null;
                this.email = null;
                this.gender = null;
                this.reason = null;
            } else {
                this.fullname = booking.fullname;
                this.phone = booking.phone;
                this.email = booking.email;
                this.gender = booking.gender;
                this.reason = booking.reason;
            }
        },
    },
    mounted() { },
    async created() {
        this.medicines = await this.getAllMedicine();
    },
    methods: {
        handleOk: async function (bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault();
            if (!this.booking.patient._id || !this.booking.specialty.doctor || this.select_medicines.length <= 0) {
                return this.$toastr.error('Vui lòng nhập đầy đủ thông tin!', "Error", {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true,
                });
            }
            var res = await this.createPrescription(
                this.booking.patient._id,
                this.booking.specialty.doctor,
                this.select_medicines,
                this.diagnose,
                this.advice
            );
            console.log(res)
            if (res.success) {
                this.$bvModal.hide("KeDonThuocModal");
                this.$emit("editMode");
                this.$toastr.success(res.message, "Thông báo", {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true,
                });
            } else {
                this.$toastr.error(res.message, "Error", {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true,
                });
            }

        },
        chonThuoc: function (medicine) {
            this.select_medicines.push({
                medicineId: medicine._id,
                name: medicine.name,
                unit: medicine.unit,
                guide: null,
                amount: 0
            });
        },
        huyThuoc: function (medicine) {
            const index = this.select_medicines.indexOf(medicine);
            if (index > -1) {
                this.select_medicines.splice(index, 1); // 2nd parameter means remove one item only
            }
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
        async createPrescription(patientId, doctorId, medicines, diagnose, advice) {
            try {
                const res = await PrescriptionsService.create({
                    patientId: patientId,
                    doctorId: doctorId,
                    medicines: medicines,
                    diagnose: diagnose,
                    advice: advice
                });
                if (res.data.success) {
                    return res.data;
                } else {
                    return null;
                }
            } catch (err) {
                return null;
            }
        }
    },
};
</script>
<style lang="css" scope>
</style>