import { useState,useEffect} from "react";
import Box from "@mui/material/Box";
import DatGui, { DatBoolean, DatColor, DatNumber, DatString,DatSelect } from 'react-dat-gui';



let initialBrushOptions={
        brushType : "Pencil",
        brushWidth : 1,
        brushOpacity : 1,
        inkAmount : 7,
        brushColor : "#000000"
}

export default function DrawingBrushControl({ EditorState }) {
  const {
    editor: { activeObject, allObjects,drawingMode },
    canvas,
  } = EditorState;
  
const [brushOptions, setBrushOptions] = useState(initialBrushOptions)

const handleBrushOptionUpdate=(updatedOptions)=>{
setBrushOptions(updatedOptions)
}

function setupBrush(canvas,brushName, opt) {
  canvas.freeDrawingBrush = new fabric[brushName](canvas, opt || {});
}

useEffect(() => {
 if(canvas){
  setupBrush(canvas,brushOptions.brushType, {
    width: brushOptions.brushWidth,
    opacity: brushOptions.brushOpacity,
    inkAmount: brushOptions.inkAmount,
    color: brushOptions.brushColor
  });
 }
  return () => {}
}, [canvas,brushOptions])


  return (
    <Box sx={{ width: "100%" }}>
      {drawingMode.tool=="brush" ? (
        <>
        <DatGui data={brushOptions} onUpdate={handleBrushOptionUpdate}>
        <DatSelect path='brushType' label="Brush" options={['Pencil','CrayonBrush','InkBrush','MarkerBrush','SprayBrush']} />
        <DatNumber path='brushWidth' label='Width' min={1} max={100} step={1} />
        <DatColor path='brushColor' label='Color' />
        <DatNumber path='brushOpacity' label='Opacity' min={0.05} max={1} step={0.05} />
        <DatNumber path='inkAmount' label='Ink amount' min={1} max={10} step={1} />
        {/* <DatBoolean path='isAwesome' label='Awesome?' /> */}
 
      </DatGui>
        </>
      ) : (
        <p className="text-center text-muted">Select brush 🖌 for controls.</p>
      )}
    </Box>
  );
}
