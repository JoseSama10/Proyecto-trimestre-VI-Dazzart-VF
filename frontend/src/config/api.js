// Archivo central para las llamadas al backend
// Exporta BASE_URL, una instancia de axios llamada API y helpers útiles
import axios from 'axios';

// Resuelve la URL del backend preferentemente desde Vite (import.meta.env),
// luego desde variables de entorno antiguas (process.env), y por último fallback
// a localhost para desarrollo local.
let viteUrl = null;
try {
  // import.meta exists in ESM environments (Vite). En algunos contextos puede lanzar,
  // por eso lo hacemos en try/catch para evitar errores durante la ejecución en Node.
  viteUrl = import.meta?.env?.VITE_BACKEND_URL ?? null;
} catch (e) {
  viteUrl = null;
}

const resolvedEnvUrl = viteUrl || ((typeof process !== 'undefined' && process.env && process.env.REACT_APP_BACKEND_URL) || 'http://localhost:3001');

export const BASE_URL = resolvedEnvUrl;

// Exportar también la versión con /api para compatibilidad con archivos que
// tenían `const BASE_URL = 'http://.../api'` y no quieran cambiar sus llamadas.
export const BASE_API = `${BASE_URL.replace(/\/$/, '')}/api`;

// Instancia de axios configurada con la ruta base de la API
export const API = axios.create({
  baseURL: `${BASE_URL.replace(/\/$/, '')}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Interceptor de respuesta para normalizar mensajes de error hacia la UI
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const displayMessage = error?.response?.data?.message || error?.message || 'Error desconocido';
    return Promise.reject({ ...error, displayMessage });
  }
);

// Interceptor para añadir Authorization cuando exista token en localStorage
API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      // no hacemos nada si localStorage no está disponible
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper para construir URLs de imágenes de productos
export const imgUrl = (imagenNombre) => {
  if (!imagenNombre) return '/default.png';
  const safe = encodeURIComponent(imagenNombre.replace(/^.*[\\/]/, ''));
  return `${BASE_URL.replace(/\/$/, '')}/productos/img/${safe}`;
};

export default API;
