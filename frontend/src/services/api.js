import axios from "axios";

const api = axios.create({
  baseURL: "https://inventory-management-system-cazo.onrender.com/",
});

export default api;