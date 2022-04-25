import {configureStore,} from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk'
import UiControllerReducer  from './slices/UiControllerSlice';

  export default configureStore({
      reducer:{
        UiController:UiControllerReducer
      },
      middleware:[thunkMiddleware],
      devTools:process.env.NODE_ENV !== "production"
})