// service.ts
import axios from "axios";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_HOST, // Hoặc URL của bạn
});
export const auth = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});

export const loginApi = async (data: { email: string; password: string }) => {
  const response = await instance.post("login", data);
  return response.data;
};
export const registerApi = async (data: any) => {
  const response = await instance.post("register", data);
  return response.data;
};
