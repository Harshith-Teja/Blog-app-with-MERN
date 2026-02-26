import axios from "axios";
import { BASE_URL } from "./requestUrl";
import {
  signoutFailure,
  signoutStart,
  signoutSuccess,
  updateAccessToken,
} from "../redux/user/userSlice";
import { store } from "../redux/store";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.get(`${BASE_URL}/refresh`, {
          withCredentials: true,
        });

        if (!response) throw new Error("No response from refresh endpoint");

        const newAccessToken = response?.data?.accessToken;
        store.dispatch(updateAccessToken(newAccessToken));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axios(originalRequest);
      } catch (err) {
        console.log("Refresh token expired or invalid. Logging out...");

        const handleSignout = async () => {
          try {
            store.dispatch(signoutStart());

            const response = await axios.post(`${BASE_URL}/logout`, {
              withCredentials: true,
            });

            const data = response?.data;

            if (data?.success === false) {
              store.dispatch(signoutFailure(data?.message));
              window.location.href = "/login";
              return;
            }

            store.dispatch(signoutSuccess());
            window.location.href = "/login";
          } catch (err: any) {
            store.dispatch(signoutFailure(err.message));
            window.location.href = "/login";
          }
        };

        handleSignout();
      }

      return Promise.reject(error);
    }
  }
);
