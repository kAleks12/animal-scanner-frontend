import axios from 'axios';

export default axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
});

export const axiosPrivate = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const aiAxios = axios.create({
    baseURL: process.env.REACT_APP_AI_SERVER_URL,
    headers: { 'Content-Type': 'application/json' }
});