import { createSlice } from "@reduxjs/toolkit";


export const UiControllerSlice = createSlice({
    name: "UiController",
    initialState: {
        setting: {},
        loading: false,
        FullScreenModal: {
            show: false,
            title: "Setting",
            children: null,
        }
    },
    reducers: {
        showFullScreenModal: (state, action) => {
            const { title, children } = action.payload || {}
            state.FullScreenModal.show = true
            state.FullScreenModal.title = title || ""
            state.FullScreenModal.children = children || null
            return state;
        },
        hideFullScreenModal: (state) => {
            state.FullScreenModal.show = false
            return state;
        },
        setLoading: (state, action) => {
            state.loading = action.payload || false;
            return state;
        }
    }
})

const { showFullScreenModal: show, hideFullScreenModal: hide, setLoading } = UiControllerSlice.actions

export const UiControllerActionType = { show, hide, setLoading }

export default UiControllerSlice.reducer;