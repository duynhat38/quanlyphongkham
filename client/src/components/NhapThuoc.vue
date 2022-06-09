<template>
    <b-modal id="ImportMedicineModal" title="Nhập thuốc" @ok="handleOk" ok-title="Cập nhật" cancel-title="Thoát"
        size="xl">
        <div class="col-md-12 row">
            <div class="col-md-8">
                <h5>Thuốc đang chọn</h5>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Đơn vị</th>
                            <th>Số lượng</th>
                            <th>Giá nhập</th>
                            <th>Thành tiền</th>
                            <th>X</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(medicine, index) in select_medicines" :key="index">
                            <td>{{ medicine.name }}</td>
                            <td>{{ medicine.unit }}</td>
                            <td><input type="number" class="form-control" id="usr" v-model="medicine.amount"></td>
                            <td><input type="number" class="form-control" id="usr" v-model="medicine.import_price"></td>
                            <td>{{ (medicine.import_price * medicine.amount).toLocaleString() }} VNĐ</td>
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
export default {
    props: [""],
    data() {
        return {
            medicines: [],
            select_medicines: [],
            total_price: 0
        };
    },
    watch: {
        select_medicines: function (medicines) {
            this.total_price = 0;
            medicines.forEach(item => {
                this.total_price += (item.import_price * item.amount);
            });
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
            for(var i=0;i<this.select_medicines.length;i++){
                await this.importMedicine(this.select_medicines[i]._id,this.select_medicines[i].amount);
            }
            this.$bvModal.hide("ImportMedicineModal");
            this.$emit("editMode");
            this.$toastr.success("Cập nhật thành công", "Thông báo", {
                timeOut: 3000,
                progressBar: true,
                closeButton: true,
            });

        },
        chonThuoc: function (medicine) {
            const index = this.select_medicines.indexOf(medicine);
            if (index > -1) {
                return;
            }
            this.select_medicines.push(medicine);
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
        async importMedicine(medicineId, amount) {
            try {
                const res = await MedicinesService.import({
                    medicineId: medicineId,
                    amount: amount
                });
                if (res.data.success) {
                    return res.data;
                } else {
                    return null;
                }
            } catch (err) {
                return null;
            }
        },
    },
};
</script>
<style lang="css" scope>
</style>