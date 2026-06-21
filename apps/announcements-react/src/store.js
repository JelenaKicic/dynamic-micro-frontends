import { configureStore } from '@reduxjs/toolkit'
import { oglasiApi } from "./services/oglasiApi";

export const store = configureStore({
    reducer: {
        [oglasiApi.reducerPath]: oglasiApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(oglasiApi.middleware),
})
