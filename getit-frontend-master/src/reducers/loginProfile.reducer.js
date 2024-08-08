import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

import { ApiUrl, AgentName, token, APIKEY, AccessControlOrigin } from "../utils/Constant";

function setCookie(name, value) {
  document.cookie = `${name}=${value};path=/`;
}
export const profileLogin = createAsyncThunk("users/", async ({ userName, email }, { dispatch, rejectWithValue }) => {
  try {
    const commonHeaders = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": AccessControlOrigin,
      "X-APIKEY": APIKEY,
      AgentName: AgentName,
    };
    const payloadData = {
      userName,
      email,
    };

    const response = await axios.post(`${ApiUrl}/users/`, payloadData, {
      headers: commonHeaders,
    });
    const token = `Bearer ` + response.data.response;
    setCookie("GetItToken", token);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.responseData);
  }
});

const initialState = {
  profileData: [],
  loading: false,
  error: undefined,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    profileData: (state, action) => {
      return { ...state, profileData: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(profileLogin.fulfilled, (state, action) => {
        if (action.payload) {
          toast.success(action.payload.message);
          // if (action.payload.message.toLowerCase() == "User Already exist") {
          //   toast.success("Welcome");
          // } else {
          //   toast.success("Welcome ");
          // }
          return { ...state, loading: false, profileData: action.payload };
        } else {
          toast.error("Something went wrong");
          return { ...state, loading: false, profileData: initialState.profileData };
        }
      })
      .addCase(profileLogin.pending, (state) => {
        return { ...state, loading: true };
      });
  },
});
export const profileReducer = profileSlice.reducer;
export const profileSelector = (state) => state.profile;
export const { profileData } = profileSlice.actions;
