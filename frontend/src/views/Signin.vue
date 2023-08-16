<template>
  <div class="container my-auto">
    <div class="row text-info">
      <div class="col-4 text-center" style="font-size: 100px">
        <i class="fas fa-walking"></i>
      </div>
      <div class="col-8">
        <form class="w-100" @submit.prevent.stop="handleSubmit">
          <h4 class="mb-3">Account Login</h4>
          <div class="form w-75">
            <input
              id="account"
              v-model="account"
              type="text"
              class="form-control mb-1"
              placeholder="account ..."
              autocomplete="username"
              name="account"
              required
            />
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-control mb-3"
              placeholder="Password ..."
              name="password"
              autocomplete="current-password"
              required
            />
            <button
              :disabled="isProcesscing"
              type="submit"
              class="btn btn-info"
            >
              LOGIN
            </button>
          </div>
          <p class="mt-5 mb-3 text-muted text-right">&copy; YuCheng Huang</p>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import authorizationAPI from "./../apis/authorization";
import { Toast } from "./../utils/helpers";
import { mapState } from "vuex";
export default {
  data() {
    return {
      account: "",
      password: "",
      isProcesscing: false,
    };
  },
  computed: {
    ...mapState(["currentUser", "isAuthenticated"]),
  },
  methods: {
    async handleSubmit() {
      try {
        if (!this.account || !this.password) {
          Toast.fire({
            icon: "warning",
            title: "請輸入帳號密碼",
          });
          return;
        }
        this.isProcesscing = true;

        const response = await authorizationAPI.signIn({
          account: this.account,
          password: this.password,
        });
        const { data } = response;
        if (data.status !== 200) {
          throw new Error(data.message);
        }
        localStorage.setItem("token", data.token);
        this.$store.commit("setCurrentUser", data.user);

        this.$router.push("/records");
      } catch (error) {
        this.password = "";
        this.isProcesscing = false;
        Toast.fire({
          icon: "warning",
          title: "請輸入正確的帳號密碼",
        });
      }
    },
  },
};
</script>

<style scoped>
input:hover {
  border-color: darkgray;
}
</style>