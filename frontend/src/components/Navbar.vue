<template>
  <nav class="sidebar bg-info">
    <div class="sidebar__home">
      <router-link
        class="nav-link navbar-home border rounded-circle text-info"
        to="/"
      >
        <i class="fas fa-coffee"></i>
      </router-link>
    </div>
    <template v-if="isAuthenticated">
      <div class="sidebar-menu mt-3">
        <router-link class="nav-link navbar-record" to="/records">
          <i class="fas fa-folder-plus"></i>
          <span>稽核紀錄</span>
        </router-link>
        <router-link class="nav-link navbar-data" to="/charts">
          <i class="fas fa-database"></i>
          <span>報表查詢</span>
        </router-link>
      </div>
      <div class="sidebar-end mt-auto">
        <router-link
          v-if="currentUser.isAdmin"
          class="nav-link navbar-admin"
          to="/admin/data"
        >
          <i class="fas fa-user-cog"></i>
          <span>後台</span>
        </router-link>
        <router-link class="nav-link navbar-user" to="/user">
          <i class="far fa-user"></i>
          <span>使用者</span>
        </router-link>
        <button
          type="button"
          class="btn btn-light logout text-info mt-2"
          @click="logout"
        >
          LOG <br />
          OUT
        </button>
      </div>
    </template>
  </nav>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["currentUser", "isAuthenticated"]),
  },
  methods: {
    logout() {
      this.$store.commit("revokeAuthentication");
      this.$router.push("/signin");
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 80px;
  padding: 30px 0;
}
.sidebar,
.sidebar-menu,
.sidebar-end {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 30px;
}
.nav-link {
  color: white;
  font-size: 30px;
  position: relative;
}
.navbar-home {
  padding: 8px 11px;
  background: white;
}
.nav-link:hover {
  font-size: 32px;
}
.nav-link span {
  display: none;
  font-size: 10px;
  color: rgb(233, 233, 233);
  font-weight: 800;
}
.nav-link:hover span {
  display: block;
  position: absolute;
  width: 100%;
  text-align: center;
  bottom: -7px;
  left: 50%;
  transform: translateX(-50%);
}
.nav-link.active {
  border: 1px solid white;
  padding: 2px 11px;
  border-radius: 25px;
}

.logout {
  font-size: 14px;
  font-weight: 700;
  padding: 4px 10px;
}
</style>