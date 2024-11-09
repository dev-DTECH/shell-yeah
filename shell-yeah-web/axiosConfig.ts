import axios from 'axios';
import contants from './constants';

const api = axios.create({
    baseURL: contants.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

export const unauthorizedApi = axios.create({
    baseURL: contants.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

export default api;