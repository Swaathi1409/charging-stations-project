<template>
  <div class="loading-container" :class="{ overlay: isOverlay }">
    <div class="loading-spinner"></div>
    <div v-if="text" class="loading-text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    text: {
      type: String,
      default: 'Loading...'
    },
    isOverlay: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.loading-container.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2c3e50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 1rem;
  color: #2c3e50;
  font-size: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 