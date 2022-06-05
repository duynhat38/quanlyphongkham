<template>
    <b-modal id="AddPharmacistModal" title="Thêm Dược Sĩ" @ok="handleOk" ok-title="Thêm" cancel-title="Thoát">
        <div class="col-sm-12">
            <div>
                <div class="row">
                    <div class="col-md-12" v-if="clinic">
                        <label class="control-label">Phòng Khám</label>
                        <div class="form-group has-feedback">
                            <input type="text" class="form-control" placeholder="Tên Phòng Khám" maxlength="150"
                                data-batbuoc="true" data-msg="Tên Phòng Khám" v-model="clinic.name" required disabled />
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="list-group">
                            <label class="control-label">Chọn Dược Sĩ</label>
                            <a href="#" class="list-group-item list-group-item-action"
                                :class="{ 'active': (item == pharmacist) }" v-for="(item, index) in pharmacists" :key="index"
                                :value="item" @click="click(item)">
                                {{ item.fullname }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </b-modal>
</template>
<script>
import ClinicsService from "@/services/ClinicsService";
import UsersService from "@/services/UsersService";

export default {
    props: ["clinic"],
    data() {
        return {
            pharmacists: [],
            pharmacist: null
        };
    },
    watch: {
    },
    mounted() { },
    async created() {
        this.pharmacists = await this.getPharmacists();
    },
    methods: {
        click: function (pharmacist) {
            this.pharmacist = pharmacist;
        },
        handleOk: async function (bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault();
            if (!this.pharmacist._id || !this.clinic._id) {
                this.$toastr.error("Vui lòng điền đầy đủ thông tin", "Error", {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true,
                });
                return;
            }
            var add = await this.addPharmacist(this.clinic._id, this.pharmacist._id);
            if (add.success) {
                this.$bvModal.hide("AddPharmacistModal");
                this.$emit("editMode");
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
        },
        addPharmacist: async function (clinicId, pharmacistId) {
            try {
                const response = await ClinicsService.addPharmacist({
                    clinicId: clinicId,
                    pharmacistId: pharmacistId
                });
                return response.data;
            } catch (err) {
                return err.response.data;
            }
        },
        async getPharmacists() {
            try {
                const response = await UsersService.getPharmacists();
                if (response) {
                    if (response.data.success) {
                        return response.data.data;
                    }
                }
            } catch (error) {
                return [];
            }
        },
    },
};
</script>
<style lang="css" scope>
</style>