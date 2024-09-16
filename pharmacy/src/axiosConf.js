// src/axiosConfig.js
import axios from "axios";
import Cookies from "js-cookie";
import { url } from "./Url";
// Función para obtener un nuevo token de acceso usando el token de refresco
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(url + "login/refresh-token");
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token", error);
    // Manejo de errores, como redirigir al usuario a la página de inicio de sesión
    // navigate('/login'); // Descomenta y usa si necesitas redirigir
  }
};

// Configuración de Axios
const axiosInstance = axios.create({
  baseURL: url, // Cambia esto a la URL de tu API
});

// Interceptor de respuesta para manejar la renovación del token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
