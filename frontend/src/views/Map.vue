<template>
  <div class="map-container">
    <div id="map" class="map"></div>
    <div v-if="selectedStation" class="station-info">
      <h3>{{ selectedStation.name }}</h3>
      <div class="station-details">
        <p><strong>Status:</strong> {{ selectedStation.status }}</p>
        <p><strong>Power Output:</strong> {{ selectedStation.powerOutput }} kW</p>
        <p><strong>Connector Type:</strong> {{ selectedStation.connectorType }}</p>
        <p><strong>Location:</strong> {{ selectedStation.location.coordinates[1] }}, {{ selectedStation.location.coordinates[0] }}</p>
      </div>
      <button @click="selectedStation = null" class="btn-secondary">Close</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import default Leaflet marker assets
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Configure Leaflet to use the default marker assets
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

export default {
  name: 'Map',
  setup() {
    const store = useStore();
    const map = ref(null);
    const markers = ref([]);
    const selectedStation = ref(null);

    const initMap = async () => {
      try {
        await nextTick(); // Wait for the next DOM update cycle

        // Create map centered at a default location
        map.value = L.map('map').setView([0, 0], 2);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map.value);

        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = [position.coords.latitude, position.coords.longitude];
              map.value.setView(userLocation, 12);
            },
            (error) => {
              console.error('Error getting location:', error);
            }
          );
        }

        // Fetch and display stations
        const stations = await store.dispatch('fetchStations');

        // Check if stations is an array before iterating
        if (Array.isArray(stations)) {
          stations.forEach(station => {
            const marker = L.marker([
              station.location.coordinates[1],
              station.location.coordinates[0]
            ]).addTo(map.value);

            marker.bindPopup(station.name);
            marker.on('click', () => {
              selectedStation.value = station;
            });

            markers.value.push(marker);
          });
        } else {
          console.error('Failed to fetch stations or received invalid data:', stations);
          // Optionally display an error message to the user
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    onMounted(() => {
      initMap();
    });

    onUnmounted(() => {
      if (map.value) {
        map.value.remove();
      }
      markers.value = [];
    });

    return {
      selectedStation
    };
  }
};
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 64px);
}

.map {
  width: 100%;
  height: 100%;
}

.station-info {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  z-index: 1000;
}

.station-details {
  margin: 1rem 0;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}
</style> 