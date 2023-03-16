<template>
  <div class="container py-5 scrollbar">
    <h2 class="ml-4">稽核報表</h2>
    <Spinner v-if="isLoading" />
    <template v-else>
      <BarCharts v-if="chartsData.data.length" :initData="chartsData" />
      <div class="filter-wrapper d-flex justify-content-center mt-3">
        <span v-if="!currentUser.isAdmin">
          {{ current.name }}
        </span>
        <span v-if="currentUser.isAdmin">
          店家
        </span>
        <select class="form-select form-select-sm mx-2" aria-label=".form-select-sm example" v-model="userId"
          @change="fetchData">
          <option v-for="u in users" :key="u._id" :value="u._id">
            {{ u.name }}
          </option>
        </select>
        <span>年份：</span>
        <select class="form-select form-select-sm mx-2" aria-label=".form-select-sm example" v-model="year"
          @change="fetchData">
          <option v-for="y in years" :key="y.value" :value="y.value">
            {{ y.name }}
          </option>
        </select>
        <span>月份：</span>
        <select class="form-select form-select-sm mx-2" aria-label=".form-select-sm example" v-model="month"
          @change="fetchData">
          <option v-for="m in months" :key="m.value" :value="m.value">
            {{ m.name }}
          </option>
        </select>
        <span class="mx-2">
          營業天數：{{ records.length }}天
        </span>
        <span class="ml-4">
          物料種類：
        </span>
        <select class="form-select form-select-sm mx-2" aria-label=".form-select-sm example" v-model="ingredientId"
          @change="fetchData">
          <option v-for="i in ingredients" :key="i._id" :value="i._id">
            {{ i.name }}
          </option>
        </select>
        <span class="ml-4">單位：</span>
        <select class="form-select form-select-sm mx-2" aria-label=".form-select-sm example" v-model="unitSet"
          @change="fetchData">
          <option :value="ingredient.unit">
            {{ ingredient.unitName }}
          </option>
          <option :value="ingredient.unit2">
            {{ ingredient.unit2Name }}
          </option>
        </select>
      </div>
      <div class="result-form mt-3 p-3 w-50" style="font-size: 15px">
        <table class="table form-group">
          <thead>
            <tr class="table-info">
              <th>{{ ingredient.name }}分析表</th>
              <th>月總量</th>
              <th>日平均</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">實際量</th>
              <td>{{ statisticNumbers.actualUsed }}</td>
              <td>
                {{ Math.round(statisticNumbers.actualUsed / records.length) }}
              </td>
            </tr>
            <tr>
              <th scope="row">應用量</th>
              <td>{{ statisticNumbers.estimateUsed }}</td>
              <td>
                {{ Math.round(statisticNumbers.estimateUsed / records.length) }}
              </td>
            </tr>
            <tr>
              <th scope="row">誤差量</th>
              <td>{{ statisticNumbers.errorUsed }}</td>
              <td>
                {{ Math.round(statisticNumbers.errorUsed / records.length) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
<script>
import recordsAPI from "./../apis/records";
import adminAPI from "./../apis/admin";
import { Toast } from "./../utils/helpers";
import { mapState } from "vuex";
import moment from "moment";
import Spinner from "../components/Spinner";
import BarCharts from "../components/BarCharts";

export default {
  name: "Charts",
  components: {
    Spinner,
    BarCharts,
  },
  data () {
    return {
      ingredients: [],
      ingredient: {},
      isLoading: true,
      year: "",
      month: "",
      years: [],
      months: [],
      userId: "",
      users: [],
      ingredientId: "",
      chartsData: {},
      records: [],
      statisticNumbers: {},
      unitSet: 1,
    };
  },
  computed: {
    ...mapState(["currentUser", "isAuthenticated"]),
  },
  async created () {
    this.month = moment().format("MM");
    this.year = moment().format("YYYY");
    this.userId = this.currentUser._id;
    await this.fetchIngredients();
    await this.fetchData();
    if (this.isAuthenticated) {
      await this.fetchUsers();
    }

    for (let i = 1;i <= 12;i++) {
      let m = i;
      if (i < 10) {
        m = "0" + i;
      } else {
        m = m.toString();
      }
      this.months.push({ value: m, name: i + "月" });
      if (i < 6) {
        const number = parseInt(this.year, 10) - i + 1
        this.years.push({
          value: number.toString(),
          name: number.toString()
        });
      }
    }
  },
  methods: {
    async fetchData () {
      try {
        this.chartsData.data = [];
        if (!this.ingredientId) {
          this.ingredientId = this.ingredients[0]._id;
        }
        this.ingredient = this.ingredients.find(
          (i) => i._id === this.ingredientId
        );
        const req = {
          year: this.year,
          month: this.month,
          ingredientId: this.ingredientId
        }
        if (this.isAuthenticated) {
          req.authorId = this.userId
        }
        
        const { data } = await recordsAPI.getRecords(req);
        this.records = data.records;
        //製作Lables
        this.createLabels();
        // 製作Data陣列
        this.createData();
        this.statisticalCalculator();
        if (this.unitSet !== 1) {
          this.chartsData.label = `誤差值 (${this.ingredient.unit2Name})`;
        } else {
          this.chartsData.label = `誤差值 (${this.ingredient.unitName})`;
        }
        this.chartsData.title = `${this.ingredient.name}   ${this.year}/${this.month}`;

        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        Toast.fire({
          icon: "error",
          title: "無法載入資料",
        });
      }
    },
    createLabels () {
      //日期標籤生產器
      this.chartsData.labels = [];
      let days = new Date(this.year, this.month, 0).getDate();
      let firstDate = new Date(this.year, this.month, 1);
      for (let i = -days;i < 0;i++) {
        this.chartsData.labels.push(
          moment(firstDate).add(i, "d").format("MM/DD")
        );
      }
    },
    createData () {
      this.chartsData.data = [];
      const monthOfDays = this.chartsData.labels.length;
      let dateArray = [];
      for (let i = 1;i <= monthOfDays;i++) {
        let dateId = this.year + this.month;
        if (i < 10) {
          dateId += "0" + i;
        } else {
          dateId += i;
        }
        dateArray.push(dateId);
      }
      for (let i = 0;i < dateArray.length;i++) {
        this.chartsData.data.push(0);
        this.records.forEach((record) => {
          if (record.dateId === dateArray[i]) {
            this.chartsData.data[i] = record.actualUsed - record.estimateUsed;
            if (this.unitSet !== 1) {
              this.chartsData.data[i] = this.numUnit2(this.chartsData.data[i]);
            }
          }
        });
      }
    },
    async fetchIngredients () {
      try {
        const response = await recordsAPI.getIngredients({});
        this.ingredients = response.data.ingredients;
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法讀取物料資訊，請稍後再試",
        });
      }
    },
    async fetchUsers () {
      try {
        const response = await adminAPI.users.get();
        this.users = response.data.users;
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法讀取用者資訊，請稍後再試",
        });
      }
    },
    statisticalCalculator () {
      this.statisticNumbers.actualUsed = 0;
      this.statisticNumbers.estimateUsed = 0;
      for (let record of this.records) {
        this.statisticNumbers.actualUsed += record.actualUsed;
        this.statisticNumbers.estimateUsed += record.estimateUsed;
      }
      this.statisticNumbers.errorUsed =
        this.statisticNumbers.actualUsed - this.statisticNumbers.estimateUsed;
      if (this.unitSet !== 1) {
        this.statisticNumbers.actualUsed = this.numUnit2(
          this.statisticNumbers.actualUsed
        );
        this.statisticNumbers.estimateUsed = this.numUnit2(
          this.statisticNumbers.estimateUsed
        );
        this.statisticNumbers.errorUsed = this.numUnit2(
          this.statisticNumbers.errorUsed
        );
      }
    },
    numUnit2 (number) {
      number = (number / this.unitSet).toFixed(2);
      return number;
    },
  },
};
</script>
<style scoped>
.container {
  height: 100%;
  overflow-y: scroll;
}

.container::-webkit-scrollbar {
  display: none;
}

th,
td {
  font-size: 14px;
  padding: 10px;
  text-align: center;
}
</style>
