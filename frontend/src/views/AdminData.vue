<template>
  <div class="container py-5">
    <div class="nav-wrapper d-flex">
      <AdminTab />
      <DataTab />
    </div>
  </div>
</template>
<script>
import AdminTab from "../components/AdminTab.vue";
import DataTab from "../components/DataTab.vue";
export default {
  name: "Admin-Data",
  components: {
    AdminTab,
    DataTab,
  },
};
</script>
<style scoped>
</style>