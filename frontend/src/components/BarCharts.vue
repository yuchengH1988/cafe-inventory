
<script>
import { Bar, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
export default {
  name: "BarChart",
  extends: Bar,
  mixins: reactiveProp,
  data() {
    return {
      chartsData: this.initData,
    };
  },
  props: {
    initData: {
      type: Object,
    },
  },
  mounted() {
    this.renderPipeChart();
  },
  methods: {
    renderPipeChart() {
      this.renderChart(
        {
          labels: this.chartsData.labels,
          datasets: [
            {
              label: this.chartsData.label,
              data: this.chartsData.data,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 1,
              hoverBorderWidth: 2,
            },
          ],
        },
        {
          title: {
            display: true,
            text: this.chartsData.title,
            fontSize: 20,
          },
          responsive: true,
          maintainAspectRatio: false,
        }
      );
    },
  },
  watch: {
    initData: {
      deep: true,
      handler(newValue) {
        this.chartsData = newValue;
        this.renderPipeChart();
      },
    },
  },
};
</script>
