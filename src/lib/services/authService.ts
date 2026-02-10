import api from './api';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'authToken';

export const getToken = (): string | null => {
  // Tenta pegar do cookie primeiro (mais confiável para middleware e evita problemas de SSR/hydration)
  const token = Cookies.get(TOKEN_KEY);
  if (token) return token;

  // Fallback para localStorage (opcional, mas bom manter por compatibilidade se algo falhar no cookie)
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const setToken = (token: string): void => {
  // Define o cookie para expirar em 7 dias (ajuste conforme necessário)
  // path: '/' garante que o cookie seja acessível em todas as rotas
  Cookies.set(TOKEN_KEY, token, { expires: 7, path: '/' });

  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY, { path: '/' });
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const loginApi = async (email: string, password: string) => {
  const response = await api.post('/auth/login', {
    email,
    password,
    userLogin: true,
  });

  if (response.data && response.data.token) {
    return response.data.token;
  }

  throw new Error('Token não encontrado na resposta da API');
};

export const getUserInfo = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
