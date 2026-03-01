// lib/http.ts
import { Env } from '@/constants/env.constant';
import axios from 'axios';
import cookie from './cookie';
import { Key } from '@/constants/key.constant';


const http = axios.create({
    baseURL: Env.API_URL,
    withCredentials: true,
});


http.interceptors.request.use(async (config) => {
    const token = await cookie.get(Key.TOKEN);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
    }
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Expires'] = '0';
    config.headers['Pragma'] = 'no-cache';

    return config;
});

export default http;
