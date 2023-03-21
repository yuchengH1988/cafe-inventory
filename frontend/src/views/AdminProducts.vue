<template>
  <div class="container py-5">
    <div class="nav-wrapper d-flex">
      <AdminTab />
      <DataTab />
    </div>
    <Spinner v-if="isLoading" />
    <template v-else>
      <div class="mt-3 d-flex align-items-start">
        <div class="list-wrapper card">
          <span class="list-title">Products List</span>
          <div
            v-for="product in products"
            :key="product.id"
            class="item-wrapper d-flex align-items-center">
            <span>{{ product.name }}</span>
            <button
              type="button"
              class="btn btn-info btn-sm ml-auto"
              @click="editInput(product._id)"
            >
              Edit
            </button>
          </div>
          <button
            type="button"
            class="btn btn-info btn-sm mx-5 mt-3"
            @click="
              resetEditData();
              editInput();
            "
          >
            New
          </button>
        </div>
        <div
          v-if="isEditing"
          class="form-item ml-3 card">
          <span class="form-title mb-2">{{
            editProduct.name ? editProduct.name : "New Ingredient"
          }}</span>
          <div class="form-row-wrapper">
            <span 
              class="form-key text-center">
              Name
            </span>
            <input
              type="text"
              class="form-control form-input"
              v-model="editProduct.name"
            />
          </div>
          <div class="form-row-wrapper">
            <span class="form-key text-center">Size</span>
            <input
              type="text"
              class="form-control form-input"
              v-model="editProduct.size"
            />
          </div>
          <div class="form-row-wrapper">
            <span class="form-key text-center">Price</span>
            <input
              type="number"
              class="form-control form-input"
              v-model="editProduct.price"
            />
          </div>
          <div class="form-row-wrapper justify-content-between">
            <button
              :disabled="isProcessing"
              class="btn btn-info"
              @click="updateProduct"
            >
              {{ isProcessing ? "Processing" : "Save" }}
            </button>
            <button @click="cancelEdit" class="btn btn-warning">Cancel</button>
            <button
              :disabled="isProcessing"
              v-if="editProduct._id"
              @click="deleteProduct"
              class="btn btn-danger"
            >
              {{ isProcessing ? "Processing" : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import AdminTab from "../components/AdminTab.vue";
import Spinner from "./../components/Spinner";
import DataTab from "../components/DataTab.vue";
import adminAPI from "../apis/admin";
import recordsAPI from "../apis/records";
import { Toast } from "../utils/helpers";
export default {
  name: "Admin-Data",
  data() {
    return {
      products: [],
      editProduct: {
        _id: "",
        name: "",
        size: "",
        price: 0,
      },
      isEditing: false,
      isProcessing: false,
      nav: ''
    };
  },
  components: {
    Spinner,
    AdminTab,
    DataTab,
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.nav = 'admin-data';
        const { data } = await recordsAPI.getProducts();
        this.products = data.products;
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法取得商品資料",
        });
      }
    },
    editInput(id) {
      this.isEditing = true;
      const product = this.products.find((i) => i._id === id);
      this.editProduct = {
        ...this.editProduct,
        ...product,
      };
    },
    async updateProduct() {
      try {
        if (!this.editProduct.name || !this.editProduct.price) {
          Toast.fire({
            icon: "error",
            title: "Price 和 Name為必填欄位",
          });
          return;
        }
        this.isProcessing = true;
        let response = {};
        if (this.editProduct._id) {
          response = await adminAPI.products.update({
            id: this.editProduct._id,
            name: this.editProduct.name,
            size: this.editProduct.size,
            price: this.editProduct.price,
          });
        } else {
          response = await adminAPI.products.create({
            name: this.editProduct.name,
            size: this.editProduct.size,
            price: this.editProduct.price,
          });
        }
        if (response.data.status !== "success") {
          throw new Error(response.data.message);
        }
        this.fetchData();
        this.resetEditData();
        Toast.fire({
          icon: "success",
          title: "已更新資料",
        });
        this.isEditing = false;
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "無法更新商品訊息，請稍後在試",
        });
      }
    },
    resetEditData() {
      this.editProduct = {
        _id: "",
        name: "",
        size: "",
        price: 0,
      };
    },
    cancelEdit() {
      this.isEditing = false;
      this.resetEditData();
    },
    async deleteProduct() {
      try {
        this.isProcessing = true;
        if (confirm("確定要刪除嗎？這個動作也會刪除相關紀錄")) {
          const { data } = await adminAPI.products.delete({
            id: this.editProduct._id,
          });
          if (data.status !== "success") {
            throw new Error(data.message);
          }
          Toast.fire({
            icon: "success",
            title: "已刪除資料",
          });
        }
        this.isEditing = false;
        this.isProcessing = false;
        this.fetchData();
        this.resetEditData();
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "無法刪除商品，請稍後在試",
        });
      }
    },
  },
};
</script>
<style src="../../assets/css/dataSetting.css"></style>
<style scoped>

.form-key {
  width: 30%;
}
.form-input {
  width: 70%;
}
</style>