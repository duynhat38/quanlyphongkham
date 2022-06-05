<template>
    <b-modal id="KhamChuaBenhModal" title="Khám chữa bệnh" @ok="handleOk" ok-title="Cập nhật" cancel-title="Thoát"
        size="lg">
        <div class="col-md-12" v-if="booking && clinic">
            <div class="col-md-12 mb-2">
                <h5>{{ clinic.name }}</h5>
                <code>Địa chỉ: {{ clinic.address }}</code>
            </div>
            <div class="col-md-12">
                <h5>Thông tin đăng ký</h5>
                <div class="row">
                    <div class="col-md-6">
                        <label class="control-label">Họ tên</label>
                        <div class="form-group has-feedback">
                            <input id="fullname" name="fullname" type="text" class="form-control" placeholder="Họ tên"
                                maxlength="150" data-batbuoc="true" data-msg="họ tên" v-model="fullname" required />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="control-label">Số điện thoại</label>
                        <div class="form-group has-feedback">
                            <input id="phone" name="phone" type="number" class="form-control number"
                                pattern="/^-?\d+\.?\d*$/" onkeypress="if(this.value.length==12) return false;"
                                placeholder="Số điện thoại" minlength="10" maxlength="11" size="11" data-batbuoc="true"
                                data-msg="số điện thoại" v-model="phone" required />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="control-label">Email</label>
                        <div class="form-group has-feedback">
                            <input id="email" name="email" type="text" class="form-control"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" placeholder="Email"
                                data-batbuoc="true" data-msg="Email" v-model="email" required />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label>Giới tính</label>
                        <div class="form-group">
                            <select id="gender" name="gender" class="form-control" data-batbuoc="true"
                                data-msg="giới tính" v-model="gender">
                                <option value="Nam">Nam</option>
                                <option value="Nu">Nữ</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-6">
                        <label class="control-label">Số Chứng Minh Nhân Dân</label>
                        <div class="form-group has-feedback">
                            <input id="identity_card" name="identity_card" type="number" class="form-control number"
                                placeholder="Số Chứng Minh Nhân Dân" data-batbuoc="true"
                                data-msg="Số Chứng Minh Nhân Dân" v-model="identity_card" required />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="control-label">Địa Chỉ</label>
                        <div class="form-group has-feedback">
                            <input id="address" name="address" type="text" class="form-control" placeholder="Địa Chỉ"
                                data-batbuoc="true" data-msg="Địa Chỉ" v-model="address" required />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <h5>Khám chữa bệnh</h5>
                <div class="row">
                    <div class="col-md-6">
                        <label class="control-label">Chọn Chuyên Khoa</label>
                        <div class="form-group">
                            <select id="specialtyId" name="specialtyId" class="form-control" data-batbuoc="true"
                                data-msg="specialty" v-model="specialtyId">
                                <option value="null">Chọn Chuyên Khoa</option>
                                <option v-for="(item, index) in clinic.specialties" :key="index" :value="item._id">
                                    {{ item.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <h5>Dịch Vụ Khám</h5>
                        <div v-if="services.length == 0"><code>Chưa có dịch vụ khám</code></div>
                        <div v-else>
                            <b-form-checkbox-group id="checkboxdichvukham" v-model="serviceSlected"
                                v-for="(item, index) in services" :key="index" :value="item">
                                <b-form-checkbox :value="item">{{ item.name }}</b-form-checkbox>
                            </b-form-checkbox-group>
                            <code>Thành Tiền: <strong>{{ priceserviceSlected.toLocaleString() }}</strong> VNĐ</code>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <h5>Thanh Toán</h5>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="payment" :checked="payment">
                            <label class="form-check-label" for="payment">
                                Đã thanh toán tiền dịch vụ
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </b-modal>
</template>
<script>
import ClinicsService from "@/services/ClinicsService";
import SpecialtiesService from "@/services/SpecialtiesService";
import BookingsService from "@/services/BookingsService";

export default {
    props: ["booking", "services"],
    data() {
        return {
            fullname: null,
            phone: null,
            email: null,
            gender: null,
            identity_card: null,
            serviceSlected: [],
            priceserviceSlected: 0,
            clinic: null,
            specialtyId: null,
            identity_card: null,
            address: null,
            payment: false
        };
    },
    watch: {
        serviceSlected: function (serviceSlected) {
            this.priceserviceSlected = 0;
            serviceSlected.forEach(item => {
                this.priceserviceSlected += item.price;
            });
        },
        booking: async function (booking) {
            if (!booking) {
                this.$bvModal.hide("KhamChuaBenhModal");
                this.$emit("editMode");
                this.$toastr.error("Không tồn tại lịch hẹn", "Thông báo", {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true,
                });
            } else {
                this.fullname = booking.fullname;
                this.phone = booking.phone;
                this.email = booking.email;
                this.gender = booking.gender;
                this.clinic = await this.getDataClinic(booking.clinic._id);
                this.payment = booking.payment;
                if (booking && booking.patient) {
                    this.address = booking.patient.address;
                    this.identity_card = booking.patient.identity_card;
                } else {
                    this.address = null;
                    this.identity_card = null;
                }
                if (booking.services.length > 0) {
                    this.serviceSlected = booking.services;
                } else {
                    this.serviceSlected = [];
                }
                if (booking.specialty) {
                    this.specialtyId = booking.specialty._id;
                } else {
                    this.specialtyId = null;
                }
            }
        },
    },
    async created() { },
    methods: {
        handleOk: async function (bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault();
            if(!this.booking || !this.fullname || !this.phone || !this.email || !this.gender || !this.identity_card || !this.address || !this.clinic || !this.specialtyId || this.serviceSlected.length==0){
                return this.$toastr.error('Vui lòng nhập đầy đủ thông tin!', "Error", {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true,
                });
            }
            var create = await this.taoPhieuKhamChuaBenh(
                this.booking._id,
                this.fullname,
                this.phone,
                this.email,
                this.gender,
                this.identity_card,
                this.address,
                this.clinic._id,
                this.specialtyId,
                this.serviceSlected,
                this.priceserviceSlected
            );
            if (create.success) {
                this.$bvModal.hide("KhamChuaBenhModal");
                this.$emit("editMode");
                this.$toastr.success(create.message, "Thông báo", {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true,
                });
            } else {
                this.$toastr.error(create.message, "Error", {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true,
                });
            }
        },
        async getSpecialty(specialtyId) {
            try {
                const res = await SpecialtiesService.getSpecialty(specialtyId);
                if (res.data.success) {
                    return res.data.data;
                } else {
                    return null;
                }
            } catch (err) {
                return null;
            }
        },
        async getDataClinic(clinicId) {
            try {
                const res = await ClinicsService.getClinic(clinicId);
                if (res.data.success) {
                    return res.data.data;
                } else {
                    return null;
                }
            } catch (err) {
                return null;
            }
        },
        taoPhieuKhamChuaBenh: async function (bookingId, fullname, phone, email, gender, identity_card, address, clinicId, specialtyId, services, payment_price) {
            try {
                const res = await BookingsService.healthcare({
                    bookingId: bookingId,
                    fullname: fullname,
                    phone: phone,
                    email: email,
                    gender: gender,
                    identity_card: identity_card,
                    address: address,
                    clinicId: clinicId,
                    specialtyId: specialtyId,
                    services: services,
                    payment_price: payment_price
                });
                return res.data;
            } catch (err) {
                console.log(err)
                return err.response.data;
            }
        }
    },
};
</script>
<style lang="css" scope>
</style>