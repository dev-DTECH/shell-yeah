import axios from 'axios';
import constants from './constants';

const api = axios.create({
    baseURL: constants.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

export const unauthorizedApi = axios.create({
    baseURL: constants.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

export const userService = axios.create({
    baseURL: `/user-service`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

export default api;