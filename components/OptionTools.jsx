import React, { useEffect, useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  useEditor,
  useEditorState,
  useEditorStateModifier,
} from "../common/contexts/EditorProvider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DropMenuZoom from "./DropMenuZoom";
import { FiMove } from "react-icons/fi";
export default function OptionTools() {
  const { setDrawingMode, undo, redo,cloneSelection,getActiveObject} = useEditorStateModifier();
  const [elementTool, setElementTool] = React.useState(() => [""]);
  const [EditorState, setEditorState] = useEditorState();
  const undoBtnRef = useRef();
  const redoBtnRef = useRef();
  const [zoomvalue, setzoomvalue] = useState(100);
  const { canvas, editor } = EditorState;
  const [panMode, setpanMode] = useState();

  useEffect(() => {
    // if (panMode != editor.panMode) {
    //   setpanMode(editor.panMode);
    // }
    const { historyRedo, historyUndo } = editor;
    if (historyRedo.length == 0) {
      redoBtnRef.current?.disabled = true;
    } else {
      redoBtnRef.current?.disabled = false;
    }
    if (historyUndo.length == 0) {
      undoBtnRef.current?.disabled = true;
    } else {
      undoBtnRef.current?.disabled = false;
    }

    // if(canvas?.getActiveObjects()){

    // }else{

    // }
    return () => {};
  }, [editor]);

  useEffect(() => {
    setpanMode(canvas?.dragMode);
    return () => {};
  }, [canvas]);

  useEffect(() => {
    setEditorState((prev) => {
      canvas?.toggleDragMode(panMode);
      return {
        ...prev,
        editor: {
          ...prev.editor,
          drawingMode: { ...prev.editor.drawingMode, status: false },
          panMode,
        },
      };
    });
    return () => {};
  }, [panMode, canvas]);


  useEffect(() => {


    const setDragShortCut=({  key,code, ctrlKey,shiftKey,altKey,metaKey } = event)=>{
     const objects=canvas.getActiveObjects()
      if (code === "Space" && objects.length==0) {
        setpanMode(true)
      }

    }
    const unsetDragShortCut=({  key,code, ctrlKey,shiftKey,altKey,metaKey } = event)=>{
      const objects=canvas.getActiveObjects()
      if (code === "Space" && objects.length==0) {
        setpanMode(false)
      }
    }
    document.addEventListener('keydown',setDragShortCut)
    document.addEventListener('keyup',unsetDragShortCut)

    return () => {
      document.removeEventListener('keydown',setDragShortCut)
      document.removeEventListener('keyup',unsetDragShortCut)
     
    }
  }, [canvas])
  

  const handleElementTool = (event, newTool) => {
    setElementTool(newTool || "move");
  };
  const togglePan = () => {
    setpanMode(!panMode);
  };

  return (
    <div>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexWrap: "wrap",

          "&.MuiPaper-root": {
            backgroundColor: "unset",
          },
          "& .MuiSvgIcon-root": {
            color: "#d1d1d1 !important",
          },
          "& .Mui-selected": {
            backgroundColor: "#5d03bf !important",
            "& .MuiSvgIcon-root": {
              color: "#fff !important",
            },
            "&:hover": {
              backgroundColor: "#501293 !important",
            },
          },
        }}
      >
        <IconButton aria-label="left aligned" id="undo" onClick={cloneSelection} disabled={editor.activeObject?false:true}>
          <ContentCopyIcon color={"white"} />
        </IconButton>
        <IconButton aria-label="left aligned" id="undo" onClick={togglePan}>
          <FiMove color={panMode ? "rgb(167 86 255)" : "grey"} />
        </IconButton>
        <IconButton
          aria-label="left aligned"
          id="undo"
          ref={undoBtnRef}
          onClick={undo}
        >
          <UndoIcon />
        </IconButton>
        <IconButton
          aria-label="left aligned"
          id="redo"
          ref={redoBtnRef}
          onClick={redo}
        >
          <RedoIcon />
        </IconButton>

        <IconButton aria-label="color">
          <span className="text-white">{zoomvalue}%</span>
          <DropMenuZoom
            onChange={(val) => {
              setzoomvalue(val);
            }}
            zoomvalue={zoomvalue}
          />
        </IconButton>
      </Paper>
    </div>
  );
}
