import { defineStore } from "pinia";
import axios from '@/http/connection/axios';
import { ref } from "vue";

export const useAuth = defineStore('idUseAuth', () => {
    const auth = ref({
        state: false,
        access_token: "",
        time_expiration_token: 0,
        type_token: "",
        role: ""
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
        auth.value.type_token = is_auth.type_token;
        auth.value.role = is_auth.role;

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
                    access_token: resolve.data.session_auth.access_token,
                    time_expiration_token: Date.now() + Number(resolve.data.session_auth.time_expiration_token * 60) * 1000,//convertimos de minutos, segundos a milisegundos
                    type_token: resolve.data.session_auth.type_token,
                    role: resolve.data.session_auth.role,
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

    const hasRole = (roles) => {
        // Verifica si el valor de getAuth().role se encuentra en el array roles
        //devuelve true si el valor getAuth().role esta en el array roles;
        return roles.includes(getAuth().role);
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
                    type_token: "",
                    role: ""
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
                type_token: "",
                role: ""
            });
        }
    }
    return { getAuth, login, user, hasRole, updateCredentials, logout, checkExpirationToken }
});



