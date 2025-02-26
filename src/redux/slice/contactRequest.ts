import {
    callFetchAllContactRequests,
    callFetchContactRequestById,
    callUpdateContactRequestStatus,
} from "@/config/api";
import { IContactRequest } from "@/types/backend";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ContactRequestState {
    contactRequests: IContactRequest[];
    currentContactRequest: IContactRequest | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ContactRequestState = {
    contactRequests: [],
    currentContactRequest: null,
    isLoading: false,
    error: null,
};

// Async thunks
export const fetchAllContactRequests = createAsyncThunk(
    "contactRequest/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await callFetchAllContactRequests();
            return response.data as IContactRequest[];
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Failed to fetch contact requests"
            );
        }
    }
);

export const fetchContactRequestById = createAsyncThunk(
    "contactRequest/fetchById",
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await callFetchContactRequestById(id);
            return response.data as IContactRequest;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Failed to fetch contact request"
            );
        }
    }
);

export const updateContactRequestStatus = createAsyncThunk(
    "contactRequest/updateStatus",
    async (
        { id, status }: { id: number; status: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await callUpdateContactRequestStatus(id, status);
            // Extract the contact request from the response data
            return response.data as IContactRequest;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Failed to update contact request status"
            );
        }
    }
);

const contactRequestSlice = createSlice({
    name: "contactRequest",
    initialState,
    reducers: {
        clearCurrentContactRequest: (state) => {
            state.currentContactRequest = null;
        },
        clearErrors: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all contact requests
            .addCase(fetchAllContactRequests.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                fetchAllContactRequests.fulfilled,
                (state, action: PayloadAction<IContactRequest[]>) => {
                    state.isLoading = false;
                    state.contactRequests = action.payload || [];
                }
            )
            .addCase(fetchAllContactRequests.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    (action.payload as string) ||
                    "Failed to fetch contact requests";
            })

            // Fetch contact request by ID
            .addCase(fetchContactRequestById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                fetchContactRequestById.fulfilled,
                (state, action: PayloadAction<IContactRequest>) => {
                    state.isLoading = false;
                    state.currentContactRequest = action.payload;
                }
            )
            .addCase(fetchContactRequestById.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    (action.payload as string) ||
                    "Failed to fetch contact request";
            })

            // Update contact request status
            .addCase(updateContactRequestStatus.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                updateContactRequestStatus.fulfilled,
                (state, action: PayloadAction<IContactRequest>) => {
                    state.isLoading = false;
                    // Safely update the contact request in the list
                    const updatedRequest = action.payload;
                    if (updatedRequest && updatedRequest.id) {
                        state.contactRequests = state.contactRequests.map(
                            (request) =>
                                request.id === updatedRequest.id
                                    ? updatedRequest
                                    : request
                        );
                        // Update current contact request if it's the same one
                        if (
                            state.currentContactRequest?.id ===
                            updatedRequest.id
                        ) {
                            state.currentContactRequest = updatedRequest;
                        }
                    }
                }
            )
            .addCase(updateContactRequestStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    (action.payload as string) ||
                    "Failed to update contact request status";
            });
    },
});

export const { clearCurrentContactRequest, clearErrors } =
    contactRequestSlice.actions;
export default contactRequestSlice.reducer;
