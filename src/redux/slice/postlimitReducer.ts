import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callFetchPostLimits } from '@/config/api';
import { IPostLimit } from '@/types/backend';

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: IPostLimit[]
}

export const fetchPostLimits = createAsyncThunk(
    'postLimit/fetchPostLimits',
    async ({ query }: { query: string }) => {
        const response = await callFetchPostLimits(query);
        return response; // Trả về toàn bộ response
    }
)


const initialState: IState = {
    isFetching: false,
    meta: {
        page: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    },
    result: []
};

export const postLimitSlice = createSlice({
    name: 'postLimit',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPostLimits.pending, (state) => {
            state.isFetching = true;
        })

        builder.addCase(fetchPostLimits.rejected, (state) => {
            state.isFetching = false;
        })

        builder.addCase(fetchPostLimits.fulfilled, (state, action) => {
            if (action.payload?.data) {  // action.payload là response.data từ API
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        })
    },
});

export default postLimitSlice.reducer;