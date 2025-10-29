import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // backend URL
  withCredentials: true,            // if you’re using cookies
});

export default instance;
