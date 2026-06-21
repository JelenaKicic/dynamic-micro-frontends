import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const oglasiApi = createApi({
    reducerPath: 'oglasiApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://efee.etf.unibl.org:8443/api/public/oglasne-ploce/' }),
    endpoints: (builder) => ({
        getAnnouncements: builder.query({
            query: (board) => `${board}`,
        }),
    }),
})

export const { useGetAnnouncementsQuery } = oglasiApi
