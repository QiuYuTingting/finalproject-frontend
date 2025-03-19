import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 2000,
});


instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});


instance.interceptors.response.use(
  (response) => response,

  // 超出 2xx 范围的状态码都会触发该函数。
  function (error) {
    if (error.status === 401 && error.config.url !== '/token') {
      window.location.replace('/login/');
    }

    return Promise.reject(error);
  }
);

export default instance;
