<template>
  <div
    v-if="show"
    class="alert"
    :class="[type, { 'alert-dismissible': dismissible }]"
    role="alert"
  >
    <div class="alert-content">
      <span v-if="icon" class="alert-icon">{{ icon }}</span>
      <div class="alert-message">{{ message }}</div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="alert-close"
      @click="$emit('close')"
      aria-label="Close"
    >
      ×
    </button>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    dismissible: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped>
.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-icon {
  font-size: 1.25rem;
}

.alert-message {
  flex: 1;
}

.alert-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.alert-close:hover {
  opacity: 1;
}

/* Alert types */
.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

.info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}
</style> 