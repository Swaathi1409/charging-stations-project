<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const router = useRouter();

    const isAuthenticated = computed(() => store.getters.isAuthenticated);

    const logout = async () => {
      store.dispatch('logout');
      router.push('/login');
    };

    return {
      isAuthenticated,
      logout
    };
  }
};
</script>

<template>
  <div class="app">
    <nav v-if="isAuthenticated" class="navbar">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item">Charging Stations</router-link>
      </div>
      <div class="navbar-menu">
        <router-link to="/stations" class="navbar-item">Stations</router-link>
        <router-link to="/map" class="navbar-item">Map</router-link>
        <a @click="logout" class="navbar-item">Logout</a>
      </div>
    </nav>

    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #2c3e50;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-menu {
  display: flex;
  gap: 1rem;
}

.navbar-item {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.navbar-item:hover {
  background-color: #34495e;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Global styles */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

* {
  box-sizing: border-box;
}
</style>
