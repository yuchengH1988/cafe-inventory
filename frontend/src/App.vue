<template>
  <div id="cafe-inventory">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import "bootstrap";
import "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "jquery/src/jquery.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import Navbar from "./components/Navbar";
export default {
  name: "app",
  components: {
    Navbar,
  },
};
</script>
<style scoped>
#cafe-inventory {
  display: flex;
  height: 100vh;
  min-height: 480px;
}

router-view {
  flex: 1;
  padding: 20px;
  max-height: 100vh;
  overflow-y: auto;
}
@media (max-width: 992px) {
  #cafe-inventory {
    display: block;
    padding-top: 40px;
  }
  .container {
    max-width: 90%;
  }
}
</style>