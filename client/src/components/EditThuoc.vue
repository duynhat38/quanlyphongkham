<template>
    <b-modal id="EditMedicineModal" title="Thông tin thuốc" @ok="handleOk" ok-title="Cập nhật" cancel-title="Thoát">
        <div class="col-sm-12">
            <div>
                <div class="row">
                    <div class="col-md-6">
                        <label class="control-label">Tên Thuốc</label>
                        <div class="form-group has-feedback">
                            <input type="text" class="form-control" placeholder="Tên thuốc" maxlength="150"
                                data-batbuoc="true" data-msg="Tên thuốc" v-model="name" required :disabled="!isAddMedicine"/>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="control-label">Đơn Vị</label>
                        <div class="form-group">
                            <select id="unit" name="unit" class="form-control" data-batbuoc="true" data-msg="đơn vị"
                                v-model="unit">
                                <option value='null'> Chọn Đơn vị</option>
                                <option value='Viên'> Viên</option>
                                <option value='Gói'> Gói</option>
                                <option value='Hộp'> Hộp</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="control-label">Giá bán</label>
                        <div class="form-group has-feedback">
                            <input type="number" class="form-control" placeholder="Giá bán" data-batbuoc="true"
                                data-msg="Giá bán" v-model="price" required />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="control-label">Giá nhập</label>
                        <div class="form-group has-feedback">
                            <input type="number" class="form-control" placeholder="Giá nhập" data-batbuoc="true"
                                data-msg="Giá nhập" v-model="import_price" required />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </b-modal>
</template>
<script>
import MedicinesService from "@/services/MedicinesService";
export default {
    props: ["medicine"],
    data() {
        return {
            name: null,
            price: 0,
            unit: null,
            import_price: 0,
            isAddMedicine: true,
        };
    },
    watch: {
        medicine: function (medicine) {
            if (!medicine) {
                this.name = null;
                this.price = 0;
                this.import_price = 0;
                this.unit = null;
                this.isAddMedicine = true;
            } else {
                this.name = medicine.name;
                this.price = medicine.price;
                this.import_price = medicine.import_price;
                this.unit = medicine.unit;
                this.isAddMedicine = false;
            }
        },
    },
    mounted() { },
    created() {
        if (this.medicine) {
            this.isAddMedicine = false;
        } else {
            this.isAddMedicine = true;
        }
    },
    methods: {
        handleOk: async function (bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault();
            if (this.isAddMedicine) {
                if (!this.name || !this.price || !this.import_price || !this.unit) {
                    this.$toastr.error("Vui lòng điền đầy đủ thông tin", "Error", {
                        timeOut: 3000,
                        progressBar: true,
                        closeButton: true,
                    });
                    return;
                }
                var add = await this.addMedicine(
                    this.name,
                    this.unit,
                    this.price,
                    this.import_price
                );
                if (add.success) {
                    this.$bvModal.hide("EditMedicineModal");
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
                if (!this.medicine._id || !this.name || !this.price || !this.unit || !this.import_price) {
                    this.$toastr.error("Vui lòng điền đầy đủ thông tin", "Error", {
                        timeOut: 3000,
                        progressBar: true,
                        closeButton: true,
                    });
                    return;
                }
                var edit = await this.editMedicine(
                    this.medicine._id,
                    this.unit,
                    this.price,
                    this.import_price
                );
                if (edit.success) {
                    this.$emit('editMode')
                    this.$bvModal.hide("EditMedicineModal");
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
        addMedicine: async function (name, unit, price, import_price) {
            try {
                const response = await MedicinesService.create({
                    name: name,
                    unit: unit,
                    price: price,
                    import_price: import_price
                });
                return response.data;
            } catch (err) {
                return err.response.data;
            }
        },
        editMedicine: async function (medicineId, unit, price, import_price) {
            try {
                const response = await MedicinesService.edit({
                    medicineId: medicineId,
                    unit: unit,
                    price: price,
                    import_price: import_price
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