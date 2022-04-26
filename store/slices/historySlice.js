import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    historyRedo: [],
    historyUndo: [],
}

export const historySlice = createSlice({
    name: "history",
    initialState: initialState,
    reducers: {
        update: (state, action) => {
            console.log("State=>", state)
            console.log("State spread=>", { ...state })
            console.log("State canvas=>", state.canvas)
            return state;
        },

    }
})

const { update } = historySlice.actions

export const historyActionType = { update }

export default historySlice.reducer;