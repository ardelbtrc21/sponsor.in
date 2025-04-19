import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
};

export const LoginUser = createAsyncThunk("user/LoginUser", async (user, thunkAPI) => {
    try {
        const response =await axios({
            method:"post",
            url:"/api/login",
            timeout:5000,
            data:{
                udomain: user.udomain,
                password: user.password
            }
        });
        return response.data;
    } catch (error) {
        if(error.response.status===500){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response.statusText??"Something went wrong",
            });
        }
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
    try {
        const response = await axios.get("/api/me");
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg ?? null;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const Logout = createAsyncThunk("user/Logout", async () => {
    try {
        const res = await axios.delete("/api/logout");
        Swal.fire({
            icon: "success",
            title: "Logout Success !",
            text: res.data.msg,
        });
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.msg,
        });
    }
});


export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(LoginUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.user = action.payload;
        });
        builder.addCase(LoginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        // Get User Login
        builder.addCase(getMe.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(getMe.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;