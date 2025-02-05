import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { callGetPaymentPlanSales } from '@/config/api';
import { IPlanSalesDTO, IBackendRes, IPlanSalesResponse } from '@/types/backend';

interface RevenueStatisticsState {
    result: IPlanSalesDTO[];
    isFetching: boolean;
    error: any;
}

const initialState: RevenueStatisticsState = {
    result: [],
    isFetching: false,
    error: null
};

export const fetchRevenueStatistics = createAsyncThunk(
    'revenueStatistics/fetchRevenueStatistics',
    async (year: number) => {
        const res = await callGetPaymentPlanSales(year);
        if (!res.data?.data) {
            throw new Error('Data not found');
        }
        return res.data.data;
    }
);

const revenueStatisticsSlice = createSlice({
    name: 'revenueStatistics',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRevenueStatistics.pending, (state) => {
                state.isFetching = true;
                state.error = null;
            })
            .addCase(fetchRevenueStatistics.fulfilled, (state, action: PayloadAction<IPlanSalesDTO[]>) => {
                state.isFetching = false;
                state.result = action.payload;
            })
            .addCase(fetchRevenueStatistics.rejected, (state, action) => {
                state.isFetching = false;
                state.error = action.error;
            });
    }
});

export default revenueStatisticsSlice.reducer;