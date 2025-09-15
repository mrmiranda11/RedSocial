import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Asegúrate de que este puerto coincida con tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;