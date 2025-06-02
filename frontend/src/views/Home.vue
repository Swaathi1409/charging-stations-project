<template>
  <div class="home-container">
    <h1>Welcome to Charging Stations Management</h1>
    <div class="features">
      <div class="feature-card">
        <h3>Manage Stations</h3>
        <p>Add, edit, and delete charging stations with ease.</p>
        <router-link to="/stations" class="btn-primary">View Stations</router-link>
      </div>
      <div class="feature-card">
        <h3>Map View</h3>
        <p>View all charging stations on an interactive map.</p>
        <router-link to="/map" class="btn-primary">Open Map</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
};
</script>

<style scoped>
.home-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 3rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.btn-primary {
  display: inline-block;
  background-color: #2c3e50;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #34495e;
}
</style> 