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
          <span class="list-title">Ingredient List</span>
          <div
            v-for="ingredient in ingredients"
            :key="ingredient.id"
            class="item-wrapper d-flex align-items-center"
          >
            <span>{{ ingredient.name }}</span>
            <button
              type="button"
              class="btn btn-info btn-sm ml-auto"
              @click="editInput(ingredient._id)"
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
        <div v-if="isEditing" class="form-item ml-3 card">
          <span class="form-title mb-2">{{
            editIngredient.name ? editIngredient.name : "New Ingredient"
          }}</span>
          <div class="form-row-wrapper">
            <span class="form-key text-center">名稱</span>
            <input
              type="text"
              class="form-control form-input"
              v-model="editIngredient.name"
            />
          </div>
          <div class="form-row-wrapper">
            <span class="form-key text-center">基本單位</span>
            <input
              disabled
              type="number"
              class="form-control form-input"
              value="1"
            />
          </div>
          <div class="form-row-wrapper">
            <span class="form-key text-center">基本單位名稱</span>
            <input
              type="text"
              class="form-control form-input"
              v-model="editIngredient.unitName"
            />
          </div>
          <div class="form-row-wrapper">
            <span class="form-key text-center">大單位</span>
            <input
              type="number"
              class="form-control form-input"
              v-model="editIngredient.unit2"
            />
          </div>
          <div class="form-row-wrapper">
            <span class="form-key text-center">大單位名稱</span>
            <input
              type="text"
              class="form-control form-input"
              v-model="editIngredient.unit2Name"
            />
          </div>
          <div class="form-row-wrapper justify-content-between">
            <button
              :disabled="isProcessing"
              class="btn btn-info"
              @click="updateIngredient"
            >
              {{ isProcessing ? "Processing" : "Save" }}
            </button>
            <button @click="cancelEdit" class="btn btn-warning">Cancel</button>
            <button
              :disabled="isProcessing"
              v-if="editIngredient._id"
              @click="deleteIngredient"
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
import DataTab from "../components/DataTab.vue";
import adminAPI from "../apis/admin";
import recordsAPI from "../apis/records";
import { Toast } from "../utils/helpers";
import Spinner from "./../components/Spinner";
export default {
  name: "Admin-Data",
  data() {
    return {
      ingredients: [],
      editIngredient: {
        _id: "",
        name: "",
        unit: 1,
        unitName: "",
        unit2: 0,
        unit2Name: "",
      },
      isEditing: false,
      isProcessing: false,
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
        const { data } = await recordsAPI.getIngredients();
        this.ingredients = data.ingredients;
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法取得原料資料",
        });
      }
    },
    editInput(id) {
      this.isEditing = true;
      const ingredient = this.ingredients.find((i) => i._id === id);
      this.editIngredient = {
        ...this.editIngredient,
        ...ingredient,
      };
    },
    async updateIngredient() {
      try {
        if (
          !this.editIngredient.name ||
          !this.editIngredient.unit ||
          !this.editIngredient.unitName
        ) {
          Toast.fire({
            icon: "error",
            title: "請填上所有欄位。",
          });
          return;
        }
        this.isProcessing = true;
        let response = {};
        if (this.editIngredient._id) {
          response = await adminAPI.ingredients.update({
            id: this.editIngredient._id,
            name: this.editIngredient.name,
            unit: this.editIngredient.unit,
            unitName: this.editIngredient.unitName,
            unit2: this.editIngredient.unit2,
            unit2Name: this.editIngredient.unit2Name,
          });
        } else {
          response = await adminAPI.ingredients.create({
            name: this.editIngredient.name,
            unit: this.editIngredient.unit,
            unitName: this.editIngredient.unitName,
            unit2: this.editIngredient.unit2,
            unit2Name: this.editIngredient.unit2Name,
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
          title: "無法更新原料訊息，請稍後在試",
        });
      }
    },
    resetEditData() {
      this.editIngredient = {
        _id: "",
        name: "",
        unit: 1,
        unitName: "",
        unit2: 0,
        unit2Name: "",
      };
    },
    cancelEdit() {
      this.isEditing = false;
      this.resetEditData();
    },
    async deleteIngredient() {
      try {
        this.isProcessing = true;
        if (confirm("確定要刪除嗎？這個動作也會刪除相關紀錄")) {
          const { data } = await adminAPI.ingredients.delete({
            id: this.editIngredient._id,
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
          title: "無法刪除原料，請稍後在試",
        });
      }
    },
  },
};
</script>
<style src="../../assets/css/dataSetting.css"></style>