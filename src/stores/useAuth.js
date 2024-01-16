import { defineStore } from "pinia";
import axios from '@/http/connection/axios';
import { ref } from "vue";

export const useAuth = defineStore('idUseAuth', () => {
    const auth = ref({
        state: false,
        access_token: "",
        time_expiration_token: 0,
    });

    const init = () => {
        if (localStorage.getItem('sessionAuth') == null || localStorage.getItem('sessionAuth') == undefined) {
            localStorage.setItem('sessionAuth', JSON.stringify(auth.value));
        }
    }
    init();

    const setAuth = (is_auth) => {
        auth.value.state = is_auth.state;
        auth.value.access_token = is_auth.access_token;
        auth.value.time_expiration_token = is_auth.time_expiration_token;
        localStorage.setItem('sessionAuth', JSON.stringify(auth.value));
    }

    const getAuth = () => {
        return JSON.parse(localStorage.getItem("sessionAuth"));
    }

    const login = async (is_user, is_password) => {
        try {
            const resolve = await axios.post("/auth/login", {
                user: is_user,
                password: is_password,
            });

            if (resolve.data.status == true) {
                setAuth({
                    state: true,
                    access_token: resolve.data.access_token,
                    time_expiration_token: Date.now() + Number(resolve.data.expires_in * 60) * 1000,//convertimos de minutos, segundos a milisegundos 
                })
            }

            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }

    const user = async () => {
        try {
            const resolve = await axios.post("/auth/me");
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }

    const hasRole = async () => {
        try {
            const resolve = await axios.post("/auth/verify-role");
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }

    const updateCredentials = async (credentials) => {
        try {
            const response = await axios.post("/auth/actualizar-credenciales", {
                ...credentials,
            });
            return response.data;

        } catch (error) {
            return error.response.data;
        }
    }

    const logout = async () => {
        try {
            const response = await axios.post("/auth/logout");
            if (response.data.status) {
                setAuth({
                    state: false,
                    access_token: "",
                    time_expiration_token: 0,
                });
            }
            return response.data;

        } catch (error) {
            return error.response.data;
        }
    }

    const checkExpirationToken = () => {
        if (getAuth().state && Date.now() >= getAuth().time_expiration_token) {
            setAuth({
                state: false,
                access_token: "",
                time_expiration_token: 0,
            });
        }
    }
    return { getAuth, login, user, hasRole, updateCredentials, logout, checkExpirationToken }
});



