import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeObject: null,
    selectedObjects: [],
    allObjects: [],
    panMode: false,
}
export const editorSlice = createSlice({
    name: "editor",
    initialState: initialState,
    reducers: {

    }
})

const { } = editorSlice.actions

export const editorActionType = {}

export default editorSlice.reducer;