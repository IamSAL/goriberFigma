import { configureStore, } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk'
import UiControllerReducer from './slices/UiControllerSlice';
import historyReducer from './slices/historySlice';
import canvasReducer from './slices/canvasSlice';
import editorReducer from './slices/editorSlice';
import drawingReducer from './slices/drawingSlice';

export default configureStore({
  reducer: {
    UiController: UiControllerReducer,
    editor: editorReducer,
    history: historyReducer,
    drawing: drawingReducer,
    canvas: canvasReducer
  },
  middleware: [thunkMiddleware],
  devTools: process.env.NODE_ENV !== "production"
})