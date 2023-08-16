<template>
  <div class="container py-5">
    <div class="nav-wrapper d-flex">
      <AdminTab />
      <UserTab />
    </div>
    <Spinner v-if="isLoading" />
    <template v-else>
      <div class="table-wrapper p-4">
        <table class="table">
          <thead class="thead table-info">
            <tr>
              <th scope="col">Acccount</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">isAdmin</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.id">
              <th scope="row">{{ u.account }}</th>
              <td>{{ u.name }}</td>
              <td>{{ u.email }}</td>
              <td>{{ u.isAdmin ? "Admin" : "User" }}</td>
              <td>
                <template v-if="currentUser._id !== u._id">
                  <!-- v-if="currentUser._id !== u._id" -->
                  <button
                    :disabled="isProcessing"
                    @click="toggleAdmin(u)"
                    class="btn btn-info btn-sm"
                  >
                    權限更換
                  </button>
                  <button
                    :disabled="isProcessing"
                    class="btn btn-danger btn-sm ml-3"
                    @click="deleteUser(u)"
                  >
                    Delete
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
<script>
import AdminTab from "../components/AdminTab.vue";
import UserTab from "../components/UserTab.vue";
import adminAPI from "../apis/admin";
import { Toast } from "./../utils/helpers";
import Spinner from "./../components/Spinner";
import { mapState } from "vuex";
export default {
  name: "Admin-Users",
  components: {
    AdminTab,
    Spinner,
    UserTab
  },
  data() {
    return {
      isLoading: true,
      isProcessing: false,
      users: [],
    };
  },
  created() {
    this.fetchUsers();
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await adminAPI.users.get();
        this.users = response.data.users;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        Toast.fire({
          icon: "error",
          title: "無法讀取用者資訊，請稍後再試",
        });
      }
    },
    async toggleAdmin(user) {
      try {
        const { data } = await adminAPI.users.toggleAdmin({
          id: user._id,
        });
        if (data.status !== 200) {
          throw new Error(data.message);
        }
        user.isAdmin = !user.isAdmin;
        Toast.fire({
          icon: "success",
          title: `使用者${user.account}已更換權限`,
        });

        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "無法變動權限，請稍後再試",
        });
      }
    },
    async deleteUser(user) {
      try {
        if (confirm("確定要刪除使用者嗎？")) {
          const { data } = await adminAPI.users.delete({
            id: user._id,
          });
          if (data.status !== 200) {
            throw new Error(data.message);
          }
          this.users = this.users.filter((u) => u._id !== user._id);
          Toast.fire({
            icon: "success",
            title: `使用者${user.account}已被刪除`,
          });
        }

        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "無法變動權限，請稍後再試",
        });
      }
    },
  },
};
</script>
<style scoped>
.new-user {
  border-radius: 25px;
}
</style>
