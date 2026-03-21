import axios from "axios";

// Use localhost for development, Azure for production
// Change this to switch between backends for testing
const API_BASE = process.env.REACT_APP_API_URL || 
  (window.location.hostname === "localhost" 
    ? "http://localhost:8080/api"
    : "https://smart-logistics-backend.happyhill-9f60ef5d.centralindia.azurecontainerapps.io/api");

console.log("API_BASE configured to:", API_BASE);

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error Details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
      },
    });
    return Promise.reject(error);
  }
);

export const ShipmentAPI = {
  list: () => axiosInstance.get("/shipments"),
  get: (id) => axiosInstance.get(`/shipments/${id}`),
  create: (payload) => {
    console.log("Create request with payload:", JSON.stringify(payload, null, 2));
    return axiosInstance.post("/shipments", payload);
  },
  update: (id, payload) => {
    console.log("Update request for id:", id, "with payload:", JSON.stringify(payload, null, 2));
    return axiosInstance.put(`/shipments/${id}`, payload);
  },
  remove: (id) => axiosInstance.delete(`/shipments/${id}`),
  getByTracking: (trackingNumber) =>
    axiosInstance.get(`/shipments/tracking/${trackingNumber}`),
};