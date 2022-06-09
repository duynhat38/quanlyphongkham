<template>
    <b-modal id="AddReceptionistModal" title="Thêm Tiếp Tân" @ok="handleOk" ok-title="Thêm" cancel-title="Thoát">
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
                            <label class="control-label">Chọn Tiếp Tân</label>
                            <a href="#" class="list-group-item list-group-item-action"
                                :class="{ 'active': (item == receptionist) }" v-for="(item, index) in receptionists" :key="index"
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
            receptionists: [],
            receptionist: null
        };
    },
    watch: {
    },
    mounted() { },
    async created() {
        this.receptionists = await this.getReceptionists();
    },
    methods: {
        click: function (receptionist) {
            this.receptionist = receptionist;
        },
        handleOk: async function (bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault();
            if (!this.receptionist._id || !this.clinic._id) {
                this.$toastr.error("Vui lòng điền đầy đủ thông tin", "Error", {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true,
                });
                return;
            }
            var add = await this.addReceptionist(this.clinic._id, this.receptionist._id);
            if (add.success) {
                this.$bvModal.hide("AddReceptionistModal");
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
        addReceptionist: async function (clinicId, receptionistId) {
            try {
                const response = await ClinicsService.addReceptionist({
                    clinicId: clinicId,
                    receptionistId: receptionistId
                });
                return response.data;
            } catch (err) {
                return err.response.data;
            }
        },
        async getReceptionists() {
            try {
                const response = await UsersService.getReceptionists();
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