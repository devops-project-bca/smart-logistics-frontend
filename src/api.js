import axios from "axios";


// Use localhost for development, Azure as primary, Render as fallback
const LOCAL_API = "http://localhost:8080/api";
const AZURE_API = "https://smart-logistics-backend.happyhill-9f60ef5d.centralindia.azurecontainerapps.io/api";
const RENDER_API = "https://smart-logistics-backend.onrender.com/api";

// Helper to test if Azure is up, fallback to Render if not
let API_BASE = LOCAL_API;
if (window.location.hostname !== "localhost") {
  API_BASE = AZURE_API;
}

// Optionally, test Azure and fallback to Render if Azure is down
// This is async, so we export a promise-based axios instance below
let axiosInstance;
async function getAxiosInstance() {
  if (axiosInstance) return axiosInstance;
  let baseURL = API_BASE;
  if (window.location.hostname !== "localhost") {
    try {
      // Try a lightweight Azure health check
      await fetch(AZURE_API + "/shipments", { method: "HEAD" });
      baseURL = AZURE_API;
    } catch {
      baseURL = RENDER_API;
      console.warn("Azure backend unavailable, falling back to Render API");
    }
  }
  axiosInstance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
  });
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
  return axiosInstance;
}

console.log("API_BASE configured to:", API_BASE);



export const ShipmentAPI = {
  list: async () => (await getAxiosInstance()).get("/shipments"),
  get: async (id) => (await getAxiosInstance()).get(`/shipments/${id}`),
  create: async (payload) => {
    console.log("Create request with payload:", JSON.stringify(payload, null, 2));
    return (await getAxiosInstance()).post("/shipments", payload);
  },
  update: async (id, payload) => {
    console.log("Update request for id:", id, "with payload:", JSON.stringify(payload, null, 2));
    return (await getAxiosInstance()).put(`/shipments/${id}`, payload);
  },
  remove: async (id) => (await getAxiosInstance()).delete(`/shipments/${id}`),
  getByTracking: async (trackingNumber) =>
    (await getAxiosInstance()).get(`/shipments/tracking/${trackingNumber}`),
};