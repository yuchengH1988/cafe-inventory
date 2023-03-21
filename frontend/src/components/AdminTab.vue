<template>
  <div>
    <div class="admin-link-wrapper">
      <router-link
        class="nav-link"
        to="/admin/data">物料參數</router-link>
      <router-link
        class="nav-link"
        to="/admin/users/list">店家</router-link>
    </div>
  </div>
</template>
<style scoped>
.admin-link-wrapper {
  background-color: rgba(23, 162, 184);
  padding: 10px 25px 10px 15px;
  border-radius: 50px;
  color: white;
  font-size: 18px;
  display: inline-flex;
}
.admin-link-wrapper .nav-link {
  color: white;
  font-weight: 300;
  padding: 0 10px;
}
.admin-link-wrapper .nav-link.active {
  color: white;
  font-weight: 700;
}
</style>