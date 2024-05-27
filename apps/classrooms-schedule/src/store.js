import { configureStore } from '@reduxjs/toolkit'
import {classroomsApi} from "./services/classroomsApi";

export const store = configureStore({
    reducer: {
        [classroomsApi.reducerPath]: classroomsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(classroomsApi.middleware),
})

