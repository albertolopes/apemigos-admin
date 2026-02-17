import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api` || 'http://localhost:8080/api',
});

// Variáveis para controle de refresh token
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e não for uma tentativa de login ou refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // Se já estiver renovando, adiciona à fila
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentToken = localStorage.getItem('authToken');
        
        // Chama o endpoint de refresh passando o token atual no header
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
          }
        );

        if (response.data && response.data.token) {
          const newToken = response.data.token;
          localStorage.setItem('authToken', newToken);
          
          // Atualiza o header padrão do axios para futuras requisições
          api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
          
          // Processa a fila de requisições pendentes
          processQueue(null, newToken);
          
          // Refaz a requisição original com o novo token
          originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Se falhar o refresh, desloga o usuário
        localStorage.removeItem('authToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
