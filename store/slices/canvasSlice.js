import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    canvas: null,
}

export const canvasSlice = createSlice({
    name: "canvas",
    initialState: initialState,
    reducers: {
        set: (state, action) => {
            state.canvas = action.payload || null
            return state;
        }
    }
})

const { set } = canvasSlice.actions

export const canvasActionType = { set }

export default canvasSlice.reducer;