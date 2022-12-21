import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//define a service user a base UR:

const appAPi = createApi({
  reducerPath: "apApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5001" }),
  endpoints: (build) => ({
    //endpoint to register
    signupUser: build.mutation({
      query: (user) => ({
        url: "/api/user/register",
        method: "POST",
        body: user,
      }),
    }),

    //endpoint to login
    loginUser: build.mutation({
      query: (user) => ({
        url: "/api/user/login",
        method: "POST",
        body: user,
      }),
    }),

    //logout
    logoutUser: build.mutation({
      query: (payload) => ({
        url: "/api/user/logout",
        method: "DELETE",
        body: payload,
      }),
    }),
  }),
});
export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = appAPi;

export default appAPi;
