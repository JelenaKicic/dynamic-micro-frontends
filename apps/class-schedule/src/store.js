import { configureStore } from '@reduxjs/toolkit'
import {classesApi} from "./services/classesApi";

export const store = configureStore({
    reducer: {
        [classesApi.reducerPath]: classesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(classesApi.middleware),
})

