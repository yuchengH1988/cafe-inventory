<template>
  <div class="container py-5">
    <div class="nav-wrapper d-flex">
      <AdminTab />
      <DataTab />
    </div>
    <Spinner v-if="isLoading" />
    <template v-else>
      <div class="composition-main mt-3 d-flex align-items-start">
        <div class="products-wrapper">
          <div class="title">Select Product</div>
          <div
            v-for="product in products"
            :key="product._id"
            class="product-row"
          >
            <span class="product-name">{{ product.name }}</span>
            <button
              type="button"
              class="btn btn-info btn-sm ml-auto"
              @click="fetchComponents(product._id)"
            >
              Edit
            </button>
          </div>
        </div>
        <div v-if="isEditing" class="ingredients-wrapper ml-4 text-center">
          <div class="title">{{ editProduct.name }}</div>
          <div
            v-for="component in components"
            :key="component._id"
            class="product-row d-flex justify-content-between"
          >
            <span class="ingredient-name"
              >{{ component.ingredientName }}({{
                component.ingredientUnit
              }})</span
            >
            <input
              v-model="component.quantity"
              type="number"
              class="quantity form-control w-25"
            />
            <button
              @click="updateComposition(component)"
              type="button"
              class="btn btn-info btn-sm"
              :disabled="isProcessing"
            >
              {{ component.quantity != 0 ? "save" : "delete" }}
            </button>
          </div>
          <div class="buttons-wrapper d-flex p-3">
            <select
              v-model="newIngredientId"
              class="form-select"
              aria-label="new ingredient"
            >
              <option value="" selected>新增成份</option>
              <option
                v-for="ingredient in ingredients"
                :value="ingredient._id"
                :key="ingredient._id"
              >
                {{ ingredient.name }}
              </option>
            </select>
            <button @click="addIngredient" class="btn btn-info btn-sm ml-auto">
              Add
            </button>
          </div>
          <button @click="cancelEdit" class="btn btn-warning btn-sm">
            Cancel
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import AdminTab from "../components/AdminTab.vue";
import DataTab from "../components/DataTab.vue";
import recordsAPI from "../apis/records";
import Spinner from "./../components/Spinner";
import { Toast } from "../utils/helpers";
import adminAPI from "../apis/admin";
export default {
  name: "Admin-Data",
  components: {
    Spinner,
    AdminTab,
    DataTab,
  },
  data() {
    return {
      products: [],
      editProduct: {},
      components: [],
      ingredients: [],
      newIngredientId: "",
      compositions: [],
      isLoading: true,
      isEditing: false,
      isProcessing: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        let response = {};
        response = await recordsAPI.getProducts();
        this.products = response.data.products;
        response = await recordsAPI.getIngredients();
        this.ingredients = response.data.ingredients;
        this.fetchCompositions();
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        Toast.fire({
          icon: "error",
          title: "無法載入後台資料",
        });
      }
    },
    async fetchCompositions() {
      try {
        let response = {};
        response = await adminAPI.compositions.get();
        this.compositions = response.data.compositions;
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法載入成份資料",
        });
      }
    },
    fetchComponents(id) {
      this.resetEditData();
      this.isEditing = true;
      this.components = this.compositions.filter(
        (composition) => id === composition.productId
      );
      this.components = this.components.map((i) => {
        this.ingredients.forEach((ingredient) => {
          if (ingredient._id === i.ingredientId) {
            i.ingredientName = ingredient.name;
            i.ingredientUnit = ingredient.unitName;
          }
        });
        return i;
      });
      this.editProduct = this.products.find((p) => id === p._id);
    },
    cancelEdit() {
      this.isEditing = false;
      this.resetEditData();
    },
    resetEditData() {
      this.editProduct = {};
      this.components = [];
    },
    async updateComposition(component) {
      try {
        this.isProcessing = true;
        let response = {};
        //新成份 新增與刪除
        if (!component._id) {
          if (component.quantity == 0) {
            this.components = this.components.filter(
              (c) => c.ingredientId !== component.ingredientId
            );
            this.isProcessing = false;
            return;
          }
          //新增
          response = await adminAPI.compositions.create({
            quantity: component.quantity,
            ingredientId: component.ingredientId,
            productId: component.productId,
          });
          this.cancelEdit();
        } else {
          //已存在元素更動
          if (component.quantity == 0) {
            if (confirm("確定要刪除嗎？這個動作也會刪除相關紀錄")) {
              response = await adminAPI.compositions.delete({
                id: component._id,
              });
              this.components = this.components.filter(
                (c) => c.ingredientId !== component.ingredientId
              );
            }
          } else {
            response = await adminAPI.compositions.update({
              id: component._id,
              quantity: component.quantity,
            });
          }
        }

        if (response.data.status !== "success") {
          throw new Error(response.data.message);
        }
        Toast.fire({
          icon: "success",
          title: "已更新資料",
        });
        this.fetchCompositions();
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "無法更新成份訊息，請稍後在試",
        });
      }
    },
    addIngredient() {
      const newIngredient = this.components.find(
        (c) => c.ingredientId === this.newIngredientId
      );
      if (newIngredient) {
        Toast.fire({
          icon: "error",
          title: "成份已存在在清單內",
        });
        return;
      }
      const ingredient = this.ingredients.find(
        (i) => i._id === this.newIngredientId
      );
      this.components.push({
        _id: 0,
        quantity: 0,
        ingredientId: this.newIngredientId,
        ingredientUnit: ingredient.unitName,
        ingredientName: ingredient.name,
        productId: this.editProduct._id,
      });
    },
  },
};
</script>
<style scoped>
.ingredients-wrapper,
.products-wrapper {
  background-color: rgb(23, 162, 184, 0.2);
  border-radius: 25px;
  padding: 15px 10px;
  border: 1px solid lightgray;
  color: rgb(66, 66, 66);
  width: 180px;
}
.ingredients-wrapper {
  background-color: #ffffff;
  width: 250px;
}
.title {
  font-size: 20px;
  font-weight: 700;
  text-align: center;
}
.product-row {
  display: flex;
  align-items: center;
  margin: 5px 0;
  padding: 5px 5px;
  border-bottom: 1px solid darkgray;
}
.product-row:last-child {
  border-bottom: 0px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
