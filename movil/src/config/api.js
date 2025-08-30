import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as Network from "expo-network";

const api = axios.create(); // instancia única

export const setBaseURL = async () => {
  let baseURL = "http://192.168.1.5:3001/api";

  if (Platform.OS === "web") baseURL = "http://localhost:3001/api";
  else if (Platform.OS === "android") baseURL = "http://192.168.1.5:3001/api";
  else if (Platform.OS === "ios") baseURL = "http://192.168.1.5:3001/api";

  try {
    const ip = await Network.getIpAddressAsync();
    // Solo usa esta línea si tu backend está corriendo en el mismo dispositivo
    // baseURL = `http://${ip}:3001/api`;
  } catch {}

  api.defaults.baseURL = baseURL;
  api.defaults.timeout = 10000;

  // Interceptor para token (solo se agrega una vez)
  // if (!api.interceptors.request.handlers.length) {
  //   api.interceptors.request.use(async (config) => {
  //     const token = await AsyncStorage.getItem("token");
  //     if (token) config.headers.Authorization = `Bearer ${token}`;
  //     return config;
  //   });
  // }
  
};

export default api;