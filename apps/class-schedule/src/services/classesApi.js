import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const classesApi = createApi({
    reducerPath: 'classesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://efee.etf.unibl.org:8443/api/public/raspored/' }),
        endpoints: (builder) => ({
            getClasses: builder.query({
            query: ({studyProgram, module}) => `studijski-program/${studyProgram}/godina/${module}`,
        }),
    }),
})

export const { useGetClassesQuery } = classesApi
