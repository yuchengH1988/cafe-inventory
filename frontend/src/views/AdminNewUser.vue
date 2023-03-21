<template>
  <div class="container py-5">
    <div class="nav-wrapper d-flex">
      <AdminTab />
      <UserTab />
    </div>
    <div class="table-wrapper p-4 mx-auto">
      <form @submit.stop.prevent="createUser">
        <div class="form-group row">
          <label for="account" class="col-sm-4 col-form-label">Account</label>
          <div class="col-sm-8">
            <input
              type="text"
              class="form-control"
              id="account"
              name="account"
              placeholder="Account"
            />
          </div>
        </div>
        <div class="form-group row">
          <label for="name" class="col-sm-4 col-form-label">Name</label>
          <div class="col-sm-8">
            <input
              type="text"
              class="form-control"
              id="name"
              name="name"
              placeholder="Name"
            />
          </div>
        </div>
        <div class="form-group row">
          <label for="email" class="col-sm-4 col-form-label">Email</label>
          <div class="col-sm-8">
            <input
              type="email"
              class="form-control"
              id="email"
              name="email"
              placeholder="Email"
            />
          </div>
        </div>
        <div class="form-group row">
          <label for="inputPassword3" class="col-sm-4 col-form-label"
            >Password</label
          >
          <div class="col-sm-8">
            <input
              type="password"
              class="form-control"
              id="inputPassword3"
              name="password"
              placeholder="Password"
            />
          </div>
        </div>
        <div class="form-group row">
          <label for="inputPassword3" class="col-sm-4 col-form-label"
            >* Password</label
          >
          <div class="col-sm-8">
            <input
              type="password"
              class="form-control"
              id="checkPassword"
              name="checkPassword"
              placeholder="Check Password"
            />
          </div>
        </div>
        <div class="form-group row">
          <div class="col-sm-4">Admin</div>
          <div class="col-sm-8">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="isAdmin"
                name="isAdmin"
                value="true"
              />
            </div>
          </div>
        </div>
        <div class="form-group row justify-content-end">
          <button
            :disabled="isProcessing"
            type="submit"
            class="back-btn btn btn-info"
          >
            {{ isProcessing ? "Processing" : "Create" }}
          </button>
          <router-link to="/admin/users">
            <button type="button" class="back-btn btn btn-warning ml-3">
              Back
            </button>
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import AdminTab from "../components/AdminTab.vue";
import UserTab from "../components/UserTab.vue";
import { Toast } from "../utils/helpers";
import adminAPI from "../apis/admin";
export default {
  name: "Admin-Users",
  components: {
    AdminTab,
    UserTab
  },
  data() {
    return {
      isProcessing: false,
    };
  },
  methods: {
    async createUser(e) {
      try {
        // <!-- account, name, email, password, checkPassword, isAdmin -->
        const form = e.target;
        const formData = new FormData(form);
        const { data } = await adminAPI.users.create({ formData });
        if (data.status !== "success") {
          Toast.fire({
            icon: "error",
            title: data.message,
          });
        }

        this.isProcessing = false;
        this.$router.push("/admin/users");
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "無法建立使用者，請稍後再試",
        });
      }
    },
  },
};
</script>


<style scoped>
.back-btn {
  border-radius: 25px;
}
.table-wrapper {
  border: 2px solid lightgray;
  border-radius: 15px;
  margin: 20px 10px 0 10px;
  max-width: 500px;
}
</style>
