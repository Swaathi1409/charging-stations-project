import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: { guest: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue'),
        meta: { guest: true }
    },
    {
        path: '/stations',
        name: 'Stations',
        component: () => import('../views/Stations.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/map',
        name: 'Map',
        component: () => import('../views/Map.vue'),
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters.isAuthenticated;

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            next({ name: 'Login' });
        } else {
            next();
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        if (isAuthenticated) {
            next({ name: 'Home' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router; 