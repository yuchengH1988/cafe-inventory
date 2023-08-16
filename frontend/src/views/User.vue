<template>
  <div class="container py-5">
    <Spinner v-if="isLoading" />
    <template v-else>
      <form @submit.stop.prevent="updateUser">
        <div class="user-wrapper rounded w-50 mx-auto">
          <div class="text-center">
            <img
              :src="avatar"
              class="avatar d-bloc img-thumbnail border-0"
              width="100"
              height="100"
            />
            <input
              v-if="isEditing"
              class="ml-3"
              id="avatar"
              type="file"
              name="avatar"
              accept="image/*"
              @change="handleFileChange"
            />
          </div>
          <div class="row mt-3">
            <div class="input-group itemsSection">
              <span class="input-group-text">NAME</span>
              <input
                :disabled="!isEditing"
                class="form-control"
                name="name"
                type="text"
                v-model="name"
                required
              />
            </div>
          </div>
          <div class="row mt-3">
            <div class="input-group itemsSection">
              <span class="input-group-text">Account</span>
              <input
                disabled
                class="form-control"
                name="account"
                type="text"
                v-model="account"
                required
              />
            </div>
          </div>
          <div class="row mt-3">
            <div class="input-group itemsSection">
              <span class="input-group-text mr-2">E-MAIL</span>
              <input
                :disabled="!isEditing"
                class="form-control"
                name="email"
                type="email"
                v-model="email"
                required
              />
            </div>
          </div>
          <div v-if="isEditing" class="row mt-3">
            <div class="input-group itemsSection">
              <span class="input-group-text mr-2">Password</span>
              <input
                class="form-control"
                name="password"
                type="password"
                v-model="password"
                required
              />
            </div>
          </div>
          <div v-if="isEditing" class="row mt-3">
            <div class="input-group itemsSection">
              <span class="input-group-text mr-2">Check Password</span>
              <input
                class="form-control"
                name="checkPassword"
                type="password"
                v-model="checkPassword"
                required
              />
            </div>
          </div>
          <div class="row mt-3 mr-4 justify-content-end">
            <button
              v-if="!isEditing"
              @click="changeStatus"
              type="button"
              class="btn btn-info"
            >
              Edit
            </button>
            <button
              v-if="isEditing"
              @click="fakeButton"
              type="button"
              class="btn btn-info mr-3"
            >
              儲存
            </button>
            <!-- <button
              v-if="isEditing"
              :disabled="isProcessing"
              type="submit"
              class="btn btn-info mr-3"
            >
              {{ isProcessing ? "...處理中" : "儲存" }}
            </button> -->
            <button
              v-if="isEditing"
              @click="changeStatus"
              type="button"
              class="btn btn-warning"
            >
              取消
            </button>
          </div>
        </div>
      </form>
    </template>
  </div>
</template>
<script>
import Spinner from "./../components/Spinner";
import usersAPI from "./../apis/users";
import { Toast } from "./../utils/helpers";
import { mapState } from "vuex";
export default {
  name: "User",
  components: {
    Spinner,
  },
  data() {
    return {
      name: "",
      email: "",
      avatar: "",
      temp_name: "",
      temp_avatar: "",
      temp_email: "",
      account: "",
      password: "",
      checkPassword: "",
      isEditing: false,
      isProcessing: false,
      isLoading: true,
    };
  },
  created() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const { data } = await usersAPI.getCurrentUser();
        this.name = data.name;
        this.avatar = data.avatar;
        this.account = data.account;
        this.email = data.email;
        this.isLoading = false;
      } catch (error) {
        console.log('1234', error)
        this.isLoading = false;
        Toast.fire({
          icon: "error",
          title: "無法取得使用者資料請稍後在試",
        });
      }
    },
    changeStatus() {
      this.isEditing = this.isEditing ? false : true;
      if (this.isEditing === true) {
        this.temp_name = this.name;
        this.temp_avatar = this.avatar;
        this.temp_email = this.email;
      } else {
        this.name = this.temp_name;
        this.avatar = this.temp_avatar;
        this.email = this.temp_email;
        this.password = "";
        this.checkPassword = "";
      }
    },
    fakeButton () {
      Toast.fire({
        icon: "warning",
        title: "更新用戶功能關閉中\n純面試用途，不要改密碼🙏拍謝",
      });
    },
    // async updateUser(e) {
    //   try {
    //     this.isProcessing = true;
    //     //當使用者沒輸入名稱
    //     if (
    //       !this.name.trim() ||
    //       !this.email ||
    //       !this.password ||
    //       !this.checkPassword
    //     ) {
    //       Toast.fire({
    //         icon: "warning",
    //         title: "請填上所有欄位",
    //       });
    //       return;
    //     }
    //     if (this.password !== this.checkPassword) {
    //       Toast.fire({
    //         icon: "warning",
    //         title: "確認密碼不正確",
    //       });
    //       return;
    //     }

    //     const form = e.target;
    //     const formData = new FormData(form);
    //     const { data } = await usersAPI.updateUser({
    //       formData,
    //     });
    //     if (data.status !== 200) {
    //       throw new Error(data.message);
    //     }
    //     this.password = "";
    //     this.checkPassword = "";
    //     this.isEditing = false;
    //     this.isProcessing = false;
    //   } catch (error) {
    //     this.fetchUser();
    //     this.isEditing = false;
    //     this.isProcessing = false;
    //     Toast.fire({
    //       icon: "error",
    //       title: "無法更新使用者資料，請稍後再試",
    //     });
    //   }
    // },
    handleFileChange(e) {
      const { files } = e.target;
      if (!files.length) return;
      const imageURL = window.URL.createObjectURL(files[0]);
      this.avatar = imageURL;
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>


<style scoped>
.container {
  overflow-y: scroll;
}
.container::-webkit-scrollbar {
  display: none;
}
.user-wrapper {
  border: 2px #68cddd solid;
  padding: 20px;
  box-shadow: 0px 2px 10px 0px rgb(0 0 0 / 8%);
}
.avatar {
  background-color: transparent;
  border-radius: 25px;
}
.input-group-text {
  text-align: center;
  margin-right: 10px;
  width: 35%;
}
.itemsSection {
  margin: 0 15px;
}
</style>