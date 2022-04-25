import { createSlice } from "@reduxjs/toolkit";


export const UiControllerSlice=createSlice({
    name:"UiController",
    initialState:{
        showFullScreenModal:false,
        title:"Setting",
        children:null,
    },
    reducers:{
        show:(state,action)=>{       
            const {title,children}=action.payload||{}
            state.showFullScreenModal=true
            state.title=title||""
            state.children=children||null
            return state;
        },
        hide:(state)=>{
            state.showFullScreenModal=false
            return state;
        },
    }
})

const {show,hide}=UiControllerSlice.actions

export const UiControllerActionType={show,hide}

export default UiControllerSlice.reducer;