import React,{useState} from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import FullScreenDialog from './FullScreenDialogue';
import { useDispatch,useSelector } from 'react-redux';
import { UiControllerActionType } from '../store/slices/UiControllerSlice';

export default function FloatingControls() {
  
    const dispatch=useDispatch();

  return (
      <div className="floating_controls"> <div className="floating_controls_tools">
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      <Fab color="secondary" aria-label="edit">
        <EditIcon />
      </Fab>
      <Fab variant="extended">
        <SimCardDownloadIcon sx={{ mr: 1 }} />
        Export
      </Fab>
      <Fab aria-label="settings" onClick={()=>{
          dispatch(UiControllerActionType.show())
      }} >
        <SettingsIcon />
      
      </Fab>
      <FullScreenDialog />
    </div></div>
    
  );
}
