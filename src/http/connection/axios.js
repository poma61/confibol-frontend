import axios from 'axios';
import app from '@/config/app';
import { useAuth } from '@/stores/useAuth';

const instance = axios.create({
    baseURL: app.BASE_URL + app.PREFIX_URL,
});

instance.interceptors.request.use((config) => {
    const use_auth = useAuth();
    if (use_auth.getAuth().state) {
        const token = use_auth.getAuth().access_token;
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;

});

export default instance;