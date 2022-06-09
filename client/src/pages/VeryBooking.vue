<template>
  <div class="text-center">
    <p>{{ message }}</p>
  </div>
</template>
<script>
import BookingsService from "@/services/BookingsService";
export default {
  data() {
    return {
      token: this.$route.params.token,
      bookingId: this.$route.params.bookingId,
      message: null,
    };
  },
  async created() {
      var very = await this.veryBooking(this.bookingId,this.token);
      console.log(very)
      if(very){
          this.message = very;
      }
  },
  methods: {
    async veryBooking(bookingId, token) {
      try {
        const res = await BookingsService.very({
            bookingId: bookingId,
            token: token
        });
        return res.data.message;
      } catch (err) {
        return err.response.data.message;
      }
    },
  },
};
</script>