<template>
  <div>
    <div class="link-wrapper d-flex ml-3">
      <router-link class="nav-link" to="/admin/data/ingredients"
        >Ingredients</router-link
      >
      |
      <router-link class="nav-link" to="/admin/data/products"
        >Products</router-link
      >
      |
      <router-link class="nav-link" to="/admin/data/composition"
        >Conposition</router-link
      >
    </div>
  </div>
</template>
<style scoped>
.link-wrapper {
  background-color: rgba(23, 162, 184, 0.8);
  padding: 10px;
  width: 340px;
  height: 47px;
  border-radius: 50px;
  color: white;
  font-size: 18px;
}
.nav-link {
  color: white;
  font-weight: 300;
  padding: 0 10px;
}
.nav-link.active {
  font-weight: 700;
}
</style>