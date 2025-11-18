import axios from "axios";

const api = axios.create({
  baseURL: "http://srv1022055.hstgr.cloud:3001/api/",
});

const facultiesapi = axios.create({
  baseURL: "http://62d6c51451e6e8f06f12bd5d.mockapi.io/",
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
export { facultiesapi };
