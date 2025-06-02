<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Register</h2>
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            required
            class="form-control"
            :class="{ 'is-invalid': errors.name }"
          />
          <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
          />
          <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            required
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
          />
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="form.confirmPassword"
            required
            class="form-control"
            :class="{ 'is-invalid': errors.confirmPassword }"
          />
          <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>

        <div class="auth-links">
          <p>
            Already have an account?
            <router-link to="/login">Login here</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Register',
  setup() {
    const store = useStore();
    const router = useRouter();

    const form = ref({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    const errors = ref({});
    const loading = computed(() => store.getters.isLoading);
    const error = computed(() => store.getters.error);

    const validateForm = () => {
      errors.value = {};
      let isValid = true;

      if (!form.value.name) {
        errors.value.name = 'Name is required';
        isValid = false;
      }

      if (!form.value.email) {
        errors.value.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
        errors.value.email = 'Please enter a valid email';
        isValid = false;
      }

      if (!form.value.password) {
        errors.value.password = 'Password is required';
        isValid = false;
      } else if (form.value.password.length < 6) {
        errors.value.password = 'Password must be at least 6 characters';
        isValid = false;
      }

      if (!form.value.confirmPassword) {
        errors.value.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (form.value.password !== form.value.confirmPassword) {
        errors.value.confirmPassword = 'Passwords do not match';
        isValid = false;
      }

      return isValid;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      try {
        await store.dispatch('register', {
          name: form.value.name,
          email: form.value.email,
          password: form.value.password
        });
        router.push('/');
      } catch (err) {
        // Error is handled by the store
      }
    };

    return {
      form,
      errors,
      loading,
      error,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);
  padding: 2rem;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-card h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-control.is-invalid {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
}

.btn-primary {
  background-color: #2c3e50;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.auth-links {
  text-align: center;
  margin-top: 1rem;
}

.auth-links a {
  color: #2c3e50;
  text-decoration: none;
}

.auth-links a:hover {
  text-decoration: underline;
}
</style> 