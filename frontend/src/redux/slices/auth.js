import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchUserData = createAsyncThunk("auth/fetchUserData", async (params, {rejectWithValue}) => {
    try {
        const {data} = await axios.post('/auth/login', params);
        return data;
    } catch (err) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
})

export const fetchAuth = createAsyncThunk("auth/fetchAuth", async () => {
    const {data} = await axios.get('/auth/me')
    return data;
})

export const fetchReg = createAsyncThunk("auth/fetchReg", async (params) => {
    const {data} = await axios.post('/auth/register', params);
    return data;
})

const initialState = {
    data: null,
    status: 'loading'
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        }
    },

    extraReducers: {
        [fetchUserData.pending]: (state) => {
            state.status = 'loading';
            state.data = null;
        },
        [fetchUserData.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.data = action.payload;
        },
        [fetchAuth.pending]: (state) => {
            state.status = 'loading';
            state.data = null;
        },
        [fetchAuth.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.data = action.payload;
        },
        [fetchReg.pending]: (state) => {
            state.status = 'loading';
            state.data = null;
        },
        [fetchReg.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.data = action.payload;
        },
        [fetchUserData.rejected]: (state, action) => {
            state.status = 'error';
            state.data = null;
            state.error = action.payload;
        },
        [fetchAuth.rejected]: (state, action) => {
            state.status = 'error';
            state.data = null;
            state.error = action.payload;
        },
        [fetchReg.rejected]: (state, action) => {
            state.status = 'error';
            state.data = null;
        }
    }
})

export const selectIsAuth = state => Boolean(state.auth.data);

export const selectUserId = state => state.auth.data?._id;

export const selectIsAdmin = state => state.auth.data?.isAdmin;

export const authReducer = authSlice.reducer;

export const {logout} = authSlice.actions;