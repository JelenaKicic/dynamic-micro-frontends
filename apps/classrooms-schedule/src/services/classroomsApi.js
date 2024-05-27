import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const classroomsApi = createApi({
    reducerPath: 'classroomsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://efee.etf.unibl.org:8443/api/public/' }),
    endpoints: (builder) => ({
        getClasses: builder.query({
            query: ({room, date}) => `raspored/${room}/${date}`,
        }),
        getRooms: builder.query({
            query: () => `prostorije`,
        }),
    }),
})

export const { useGetClassesQuery, useGetRoomsQuery } = classroomsApi
