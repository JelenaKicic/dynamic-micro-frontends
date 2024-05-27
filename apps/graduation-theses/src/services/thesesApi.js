import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const thesesApi = createApi({
    reducerPath: 'thesesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://efee.etf.unibl.org:8443/api/public/zavrsni-radovi' }),
        endpoints: (builder) => ({
            getTheses: builder.query({
            query: ({fetchSize, fetchOffset}) => `?filter=${encodeURIComponent(`{"where":[],"orderBy":[],"fetchSize":${fetchSize},"fetchOffset":${fetchOffset}}`)}`,
        }),
    }),
})

export const { useGetThesesQuery } = thesesApi
