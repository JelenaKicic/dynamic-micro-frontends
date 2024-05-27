import { configureStore } from '@reduxjs/toolkit'
import {settingsApi} from "./services/settingsApi";

export const store = configureStore({
    reducer: {
        [settingsApi.reducerPath]: settingsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(settingsApi.middleware),
})

