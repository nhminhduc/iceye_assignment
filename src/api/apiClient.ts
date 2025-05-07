/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import Cookies from "js-cookie";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const instance = axios.create({ baseURL, timeout: 10000 });

// Attach access token to requests
instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers = config.headers ?? {};
      (
        config.headers as RawAxiosRequestHeaders
      ).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export async function get<T>(
  url: string,
  cfg?: AxiosRequestConfig
): Promise<T> {
  const { data } = await instance.get<T>(url, cfg);
  return data;
}

export async function post<T>(
  url: string,
  body?: any,
  cfg?: AxiosRequestConfig
): Promise<T> {
  const { data } = await instance.post<T>(url, body, cfg);
  return data;
}

export async function put<T>(
  url: string,
  body?: any,
  cfg?: AxiosRequestConfig
): Promise<T> {
  const { data } = await instance.put<T>(url, body, cfg);
  return data;
}

export async function del<T>(
  url: string,
  cfg?: AxiosRequestConfig
): Promise<T> {
  const { data } = await instance.delete<T>(url, cfg);
  return data;
}

export const apiClient = { get, post, put, del };
export default apiClient;
