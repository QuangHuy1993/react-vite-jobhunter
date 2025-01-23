import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callFetchJob, callFetchJobsByHRUserId } from '@/config/api';
import { IJob } from '@/types/backend';

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: IJob[]
}

// Thunk cho HR
export const fetchJobsByHR = createAsyncThunk(
    'job/fetchJobsByHR',
    async (userId: string) => {
        const response = await callFetchJobsByHRUserId(userId);
        return response;
    }
);

// Thunk cho ADMIN
export const fetchJob = createAsyncThunk(
    'job/fetchJob',
    async ({ query }: { query: string }) => {
        const response = await callFetchJob(query);
        return response;
    }
);

const initialState: IState = {
    isFetching: true,
    meta: {
        page: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    },
    result: []
};

export const jobSlide = createSlice({
    name: 'job',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Cases cho ADMIN
        builder
            .addCase(fetchJob.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchJob.fulfilled, (state, action) => {
                if (action.payload && action.payload.data) {
                    state.isFetching = false;
                    state.meta = action.payload.data.meta;
                    state.result = action.payload.data.result;
                }
            })
            .addCase(fetchJob.rejected, (state) => {
                state.isFetching = false;
            })
            // Cases cho HR
            .addCase(fetchJobsByHR.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchJobsByHR.fulfilled, (state, action) => {
                if (action.payload && action.payload.data) {
                    state.isFetching = false;
                    state.result = action.payload.data;
                    state.meta = {
                        ...state.meta,
                        total: action.payload.data.length
                    };
                }
            })
            .addCase(fetchJobsByHR.rejected, (state) => {
                state.isFetching = false;
            });
    },
});

export default jobSlide.reducer;