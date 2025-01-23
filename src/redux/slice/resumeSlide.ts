import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {callFetchResume, callFetchResumesByHRUserId} from '@/config/api';
import { IResume } from '@/types/backend';

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: IResume[]
}

export const fetchResume = createAsyncThunk(
    'resume/fetchResume',
    async ({ userId }: { userId: string }) => {
        try {
            const response = await callFetchResumesByHRUserId(userId);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
)
// Thunk cho ADMIN
export const fetchAllResumes = createAsyncThunk(
    'resume/fetchAllResumes',
    async ({ query }: { query: string }) => {
        const response = await callFetchResume(query);
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

export const resumeSlide = createSlice({
    name: 'resume',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Cases cho HR
            .addCase(fetchResume.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchResume.fulfilled, (state, action) => {
                if (action.payload) {
                    state.isFetching = false;
                    state.meta = action.payload.meta;
                    state.result = action.payload.result;
                }
            })
            .addCase(fetchResume.rejected, (state) => {
                state.isFetching = false;
            })
            // Cases cho ADMIN
            .addCase(fetchAllResumes.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchAllResumes.fulfilled, (state, action) => {
                if (action.payload?.data) {
                    state.isFetching = false;
                    state.meta = action.payload.data.meta;
                    state.result = action.payload.data.result;
                }
            })
            .addCase(fetchAllResumes.rejected, (state) => {
                state.isFetching = false;
            });
    },
});

export default resumeSlide.reducer;