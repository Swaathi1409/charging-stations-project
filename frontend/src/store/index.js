import { createStore } from 'vuex';
import { auth, stations } from '../services/api';

export default createStore({
    state: {
        user: null,
        token: localStorage.getItem('token') || null,
        stations: [],
        loading: false,
        error: null
    },
    mutations: {
        SET_USER(state, user) {
            state.user = user;
        },
        SET_TOKEN(state, token) {
            state.token = token;
            if (token) {
                localStorage.setItem('token', token);
            } else {
                localStorage.removeItem('token');
            }
        },
        SET_STATIONS(state, stations) {
            state.stations = stations;
        },
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        SET_ERROR(state, error) {
            state.error = error;
        }
    },
    actions: {
        async login({ commit }, credentials) {
            try {
                commit('SET_LOADING', true);
                const { data } = await auth.login(credentials);
                commit('SET_USER', data.user);
                commit('SET_TOKEN', data.token);
                commit('SET_ERROR', null);
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || 'Login failed');
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async register({ commit }, userData) {
            try {
                commit('SET_LOADING', true);
                const { data } = await auth.register(userData);
                commit('SET_USER', data.user);
                commit('SET_TOKEN', data.token);
                commit('SET_ERROR', null);
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || 'Registration failed');
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        logout({ commit }) {
            commit('SET_USER', null);
            commit('SET_TOKEN', null);
        },
        async fetchStations({ commit }) {
            try {
                commit('SET_LOADING', true);
                const { data } = await stations.getAll();
                commit('SET_STATIONS', data);
                commit('SET_ERROR', null);
                return data;
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch stations');
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async createStation({ commit }, stationData) {
            try {
                commit('SET_LOADING', true);
                const { data } = await stations.create(stationData);
                commit('SET_STATIONS', [...this.state.stations, data]);
                commit('SET_ERROR', null);
                return data;
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || 'Failed to create station');
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async updateStation({ commit }, { id, stationData }) {
            try {
                commit('SET_LOADING', true);
                const { data } = await stations.update(id, stationData);
                const updatedStations = this.state.stations.map(station =>
                    station._id === id ? data : station
                );
                commit('SET_STATIONS', updatedStations);
                commit('SET_ERROR', null);
                return data;
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || 'Failed to update station');
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async deleteStation({ commit }, id) {
            try {
                commit('SET_LOADING', true);
                await stations.delete(id);
                const updatedStations = this.state.stations.filter(station => station._id !== id);
                commit('SET_STATIONS', updatedStations);
                commit('SET_ERROR', null);
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || 'Failed to delete station');
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        }
    },
    getters: {
        isAuthenticated: state => !!state.token,
        currentUser: state => state.user,
        allStations: state => state.stations,
        isLoading: state => state.loading,
        error: state => state.error
    }
}); 