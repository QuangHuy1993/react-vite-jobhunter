import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {callGetAllPayments, callGetPaymentSuccess} from '@/config/api';
import { IPayment } from '@/types/backend';

interface PaymentState {
    result: IPayment[];
    isFetching: boolean;
    error: any;
}

const initialState: PaymentState = {
    result: [],
    isFetching: false,
    error: null
}

export const fetchPayments = createAsyncThunk(
    'payment/fetchPayments',
    async (params: {paymentRef?: string; paymentMethod?: string; paymentStatus?: string}) => {
        const queryString = Object.entries(params)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        const res = await callGetAllPayments(queryString);
        if (res.data?.data) return res.data.data;
        throw new Error('Data not found');
    }
);

const paymentSlide = createSlice({
    name: 'payment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayments.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.isFetching = false;
                state.result = action.payload;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.isFetching = false;
                state.error = action.error;
            })
    }
});

export default paymentSlide.reducer;