import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue the request while refresh is in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = Cookies.get('refresh_token');

            if (!refreshToken) {
                // No refresh token available, clear tokens and reject
                Cookies.remove('token');
                Cookies.remove('refresh_token');
                processQueue(error, null);
                isRefreshing = false;
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${api.defaults.baseURL}/auth/refresh`,
                    { refresh_token: refreshToken },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                const { access_token, refresh_token: new_refresh_token } = response.data;

                // Store new tokens
                Cookies.set('token', access_token, { expires: 7 });
                Cookies.set('refresh_token', new_refresh_token, { expires: 30 });

                // Update authorization header
                originalRequest.headers.Authorization = `Bearer ${access_token}`;

                processQueue(null, access_token);
                isRefreshing = false;

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear tokens
                Cookies.remove('token');
                Cookies.remove('refresh_token');
                processQueue(refreshError, null);
                isRefreshing = false;
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
