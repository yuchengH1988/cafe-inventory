<template>
  <div>
    <div class="link-wrapper d-flex">
      <router-link class="nav-link" to="/admin/data">Data</router-link> |
      <router-link class="nav-link" to="/admin/charts">Charts</router-link> |
      <router-link class="nav-link" to="/admin/users">Users</router-link>
    </div>
  </div>
</template>
<style scoped>
.link-wrapper {
  background-color: rgba(23, 162, 184, 0.8);
  padding: 10px;
  width: 220px;
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