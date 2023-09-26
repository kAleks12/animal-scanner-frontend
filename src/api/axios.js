import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api/v1';
const AI_BASE_URL = 'http://localhost:8081/api/v1';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const aiAxios = axios.create({
    baseURL: AI_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});