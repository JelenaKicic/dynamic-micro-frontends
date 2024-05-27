import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const settingsApi = createApi({
    reducerPath: 'settingsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://efee.etf.unibl.org:8443/api/public/' }),
        endpoints: (builder) => ({
            getModules: builder.query({
            query: ({studyProgram, year}) => `octt-ep/epg/${studyProgram}`,
        }),
    }),
})

export const { useGetModulesQuery } = settingsApi
