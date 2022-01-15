/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { actions, getters } from 'src/store/modules/auth';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const baseURL: string = process.env.DEV
  ? 'http://localhost:3000'
  : 'https://api.example.com';

const api = axios.create({ baseURL });

axios.interceptors.request.use(
  (config) => {
    const token = getters.accessToken.value;
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return axios
        .post('/auth/token', {
          refresh_token: getters.refreshToken.value,
        })
        .then((res) => {
          if (res.status === 201) {
            // 1) put token to LocalStorage
            actions.setTokens(
              res.data as {
                access_token: string;
                refresh_token: string;
              }
            );

            // 2) Change Authorization header
            if (getters.accessToken.value) {
              axios.defaults.headers.common[
                'Authorization'
              ] = `Bearer ${getters.accessToken.value}`;
            }

            // 3) return originalRequest object with Axios.
            return axios(originalRequest);
          }
        });
    }
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
