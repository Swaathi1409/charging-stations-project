<template>
  <div class="stations-container">
    <div class="stations-header">
      <h1>Charging Stations</h1>
      <button @click="showAddModal = true" class="btn-primary">Add Station</button>
    </div>

    <div class="filters">
      <div class="filter-group">
        <label for="status">Status:</label>
        <select id="status" v-model="filters.status" class="form-control">
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="connectorType">Connector Type:</label>
        <select id="connectorType" v-model="filters.connectorType" class="form-control">
          <option value="">All</option>
          <option value="Type 1">Type 1</option>
          <option value="Type 2">Type 2</option>
          <option value="CCS">CCS</option>
          <option value="CHAdeMO">CHAdeMO</option>
          <option value="Tesla">Tesla</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">
      Loading stations...
    </div>
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-else-if="stations && stations.length > 0" class="stations-grid">
      <div v-for="station in stations" :key="station._id" class="station-card">
        <h3>{{ station.name }}</h3>
        <div class="station-details">
          <p><strong>Status:</strong> {{ station.status }}</p>
          <p><strong>Power Output:</strong> {{ station.powerOutput }} kW</p>
          <p><strong>Connector Type:</strong> {{ station.connectorType }}</p>
          <p><strong>Location:</strong> {{ station.location.coordinates[1] }}, {{ station.location.coordinates[0] }}</p>
        </div>
        <div class="station-actions">
          <button @click="editStation(station)" class="btn-secondary">Edit</button>
          <button @click="deleteStation(station._id)" class="btn-danger">Delete</button>
        </div>
      </div>
    </div>
    <div v-else class="info-message">
      No stations found.
    </div>

    <!-- Add/Edit Station Modal -->
    <div v-if="showAddModal || showEditModal" class="modal">
      <div class="modal-content">
        <h2>{{ showEditModal ? 'Edit Station' : 'Add Station' }}</h2>
        <form @submit.prevent="handleSubmit" class="station-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input
              type="text"
              id="name"
              v-model="stationForm.name"
              required
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="latitude">Latitude</label>
            <input
              type="number"
              id="latitude"
              v-model="stationForm.latitude"
              required
              step="any"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="longitude">Longitude</label>
            <input
              type="number"
              id="longitude"
              v-model="stationForm.longitude"
              required
              step="any"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="powerOutput">Power Output (kW)</label>
            <input
              type="number"
              id="powerOutput"
              v-model="stationForm.powerOutput"
              required
              min="0"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="connectorType">Connector Type</label>
            <select
              id="connectorType"
              v-model="stationForm.connectorType"
              required
              class="form-control"
            >
              <option value="Type 1">Type 1</option>
              <option value="Type 2">Type 2</option>
              <option value="CCS">CCS</option>
              <option value="CHAdeMO">CHAdeMO</option>
              <option value="Tesla">Tesla</option>
            </select>
          </div>
          <div class="form-group">
            <label for="status">Status</label>
            <select
              id="status"
              v-model="stationForm.status"
              required
              class="form-control"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ showEditModal ? 'Update' : 'Add' }} Station
            </button>
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Stations',
  setup() {
    const store = useStore();
    const showAddModal = ref(false);
    const showEditModal = ref(false);
    const editingStationId = ref(null);
    const filters = ref({
      status: '',
      connectorType: ''
    });

    const stationForm = ref({
      name: '',
      latitude: '',
      longitude: '',
      powerOutput: '',
      connectorType: 'Type 1',
      status: 'active'
    });

    const loading = computed(() => store.getters.isLoading);
    const error = computed(() => store.getters.error);
    const stations = computed(() => store.getters.allStations);

    const filteredStations = computed(() => {
      console.log('Computing filtered stations...', stations.value);
      return stations.value.filter(station => {
        if (filters.value.status && station.status !== filters.value.status) return false;
        if (filters.value.connectorType && station.connectorType !== filters.value.connectorType) return false;
        return true;
      });
    });

    const fetchStations = async () => {
      try {
        await store.dispatch('fetchStations');
      } catch (err) {
        // Error is handled by the store
        console.error('Failed to fetch stations in component:', err);
      }
    };

    const handleSubmit = async () => {
      // Form validation should be added here

      try {
        const stationData = {
          name: stationForm.value.name,
          location: {
            type: 'Point',
            coordinates: [
              parseFloat(stationForm.value.longitude),
              parseFloat(stationForm.value.latitude)
            ]
          },
          powerOutput: parseFloat(stationForm.value.powerOutput),
          connectorType: stationForm.value.connectorType,
          status: stationForm.value.status
        };

        if (showEditModal.value) {
          await store.dispatch('updateStation', {
            id: editingStationId.value,
            stationData
          });
        } else {
          await store.dispatch('createStation', stationData);
        }

        closeModal();
        // Optionally fetch stations again to update the list after adding/editing
        fetchStations();

      } catch (err) {
        // The error is already handled by the store and available via the 'error' computed property
        console.error('Failed to save station:', err);
      }
    };

    const editStation = (station) => {
      editingStationId.value = station._id;
      stationForm.value = {
        name: station.name,
        latitude: station.location.coordinates[1],
        longitude: station.location.coordinates[0],
        powerOutput: station.powerOutput,
        connectorType: station.connectorType,
        status: station.status
      };
      showEditModal.value = true;
    };

    const deleteStation = async (id) => {
      if (confirm('Are you sure you want to delete this station?')) {
        try {
          await store.dispatch('deleteStation', id);
          // Optionally fetch stations again to update the list after deletion
          fetchStations();
        } catch (err) {
          // Error is handled by the store
          console.error('Failed to delete station:', err);
        }
      }
    };

    const closeModal = () => {
      showAddModal.value = false;
      showEditModal.value = false;
      editingStationId.value = null;
      stationForm.value = {
        name: '',
        latitude: '',
        longitude: '',
        powerOutput: '',
        connectorType: 'Type 1',
        status: 'active'
      };
    };

    onMounted(() => {
       fetchStations();
    });

    return {
      loading,
      error,
      stations: filteredStations, // Still return filteredStations for template use
      showAddModal,
      showEditModal,
      stationForm,
      filters,
      handleSubmit,
      editStation,
      deleteStation,
      closeModal,
      // Also expose the raw stations data for the v-else-if check
      allStations: stations // Expose the original stations ref
    };
  }
};
</script>

<style scoped>
.stations-container {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stations-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.station-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.station-details {
  margin: 1rem 0;
}

.station-actions {
  display: flex;
  gap: 0.5rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.station-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary {
  background-color: #2c3e50;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  padding: 1rem;
  background: #fde8e8;
  border-radius: 4px;
  margin: 1rem 0;
}

.info-message {
  text-align: center;
  padding: 1rem;
  color: #7f8c8d;
}
</style> 