import axios from "axios";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
});

export const teste = axios.create({
  baseURL: "http://localhost:3000",
});

export default api;
