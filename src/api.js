import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export const ShipmentAPI = {
  list: () => axios.get(API_BASE),
  get: (id) => axios.get(`${API_BASE}/${id}`),
  create: (payload) => axios.post(API_BASE, payload),
  update: (id, payload) => axios.put(`${API_BASE}/${id}`, payload),
  remove: (id) => axios.delete(`${API_BASE}/${id}`),
  getByTracking: (trackingNumber) =>
    axios.get(`${API_BASE}/tracking/${trackingNumber}`),
};
