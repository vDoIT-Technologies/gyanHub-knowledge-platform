import axios, { AxiosInstance } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const llmApi: AxiosInstance = axios.create({
  baseURL,
});

export default llmApi;
