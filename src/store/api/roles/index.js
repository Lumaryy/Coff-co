import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "../../../utils";

export const rolesSlice = createApi({
  reducerPath: 'roles',
  baseQuery: fetchBaseQuery({
    baseUrl:import.meta.env.VITE_BASE_URL,
    headers:{
      'Content-Type': 'application/json',
      token:`${getCookie('authToken')}`
    },
  }),

  endpoints:(build)=>({

//LISTAR ROLES
  getRol: build.query({
    query:()=>({
      url:'/rol/listar',
      method:'GET',
    }),
    invalidatesTags:['roles'],
    providesTags:['roles']
  })

  })
})

export const {useGetRolQuery} = rolesSlice