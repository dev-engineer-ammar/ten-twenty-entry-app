import axios from "axios";
import { getCookie } from "./cookie";
import { BASE_URL } from "../config/config";


// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  params: {},
});


// API calls related to authentication
const api = {

  authPost: async (url, data, token = "") => {
    try {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axiosInstance.post(url, data);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network error");
    }
  },
  get: async (url, params = {}, token) => {
    try {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axiosInstance.get(url, { params });
      return response;
    } catch (error) {
      throw error.response.data;
    }
  },
  post: async (url, data = {}, token) => {
    try {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axiosInstance.post(url, data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  // Add PUT method
  put: async (url, data, token) => {
    //   try {
    //     axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    //     const response = await axiosInstance.put(url, data);
    //     return response.data;
    //   } catch (error) {
    //     console.error("Error in PUT request:", error);
    //     throw error.response ? error.response.data : new Error("Network error");
    //   }
  },
  delete: async (url, params = {}, token) => {
    try {
      const token = getCookie("accessToken");
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axiosInstance.delete(url);
      return response.data;
    } catch (error) {
      console.error("Error in DELETE request:", error);
      throw error.response ? error.response.data : new Error("Network error");
    }
  }

};

export default api;