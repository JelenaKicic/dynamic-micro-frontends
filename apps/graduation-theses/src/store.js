import { configureStore } from '@reduxjs/toolkit'
import {thesesApi} from "./services/thesesApi";

export const store = configureStore({
    reducer: {
        [thesesApi.reducerPath]: thesesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thesesApi.middleware),
})

