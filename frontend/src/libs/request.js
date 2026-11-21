import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 60000,
    withCredentials: true,
});

export default instance;
