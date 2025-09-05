import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';
import Constants from 'expo-constants';



const getBaseURL = () => {
    if (process.env.BACKEND_URL) {
        return process.env.BACKEND_URL;
    }

    if (Platform.OS === 'web') {
        return 'http://localhost:3001/api';
    }

    if (Constants.expoConfig?.hostUri) {
        const ip = Constants.expoConfig.hostUri.split(':')[0];
        return `http://${ip}:3001/api`;
    }

    

    return 'http://localhost:3001/api';

    
};

const API = axios.create({
    baseURL: getBaseURL(),
    timeout: 10000,
});

API.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    } catch (_error) {
        return null;
    }

});

export default API;