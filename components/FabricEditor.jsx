import React, { useState, useEffect, useCallback } from "react";
import { CanvasFabric } from "./CanvasFabric";
import { fabric } from "fabric";
import {
  useEditorState,
  useEditorStateModifier,

} from "./../common/contexts/EditorProvider";
import { getSvgParts } from "./../common/getSvgParts";



const FabricEditor = () => {
  const [EditorState, setEditorState] = useEditorState();
  const [contextMenuStatus, setcontextMenuStatus] = useState(false);
  const { canvas,editor } = EditorState;

  const {
    deleteImage,
    undo, redo,
    onObjectMove,
    onObjectAdded,
    onObjectModified,
    onObjectRemoved,
    onSelectedCreated,
    onSelectedCleared,
    onHistoryModified,
  } = useEditorStateModifier();



 

  useEffect(() => {
    if (canvas) {
      canvas.on("object:moving", onObjectMove);
      canvas.on("object:added", onObjectAdded);
      canvas.on("object:modified", onObjectModified);
      canvas.on("object:removed", onObjectRemoved);
      canvas.on("selection:created", onSelectedCreated);
      canvas.on("selection:updated", onSelectedCreated);
      canvas.on("selection:cleared", onSelectedCleared);
      canvas.on("history:append",onHistoryModified);
      canvas.on("history:undo",onHistoryModified);
      canvas.on("history:redo",onHistoryModified);
      canvas.on("history:clear",onHistoryModified);


      var reactAtom = new fabric.Path(getSvgParts("center"));
     
      reactAtom.set({
        left: canvas.width / 2 - reactAtom.width,
        top: canvas.height / 2 - reactAtom.height,
        originX: "center",
        originY: "center",
        fill: "#2b2b2b",
        name: "center",
        scaleY: 5,
        scaleX: 5,
      });
      window.center = reactAtom;
      window.canvas = canvas;

  ;
      canvas.add(reactAtom);
      canvas.renderAll();



      document.addEventListener('keyup', ({  key,code, ctrlKey,shiftKey,altKey,metaKey } = event) => {

        console.log({key,code, ctrlKey,shiftKey,altKey,metaKey})

 
         // Check pressed button is Z - Ctrl+Shift+Z.
         if (ctrlKey && shiftKey  && code === "KeyZ") {
          redo()
          return;
      }

        if (code === "Backspace"||code === "Delete") {
          deleteImage();
          return;
        }
       
        // Check pressed button is Z - Ctrl+Z.
        if ( ctrlKey && code === "KeyZ") {
          
            undo()
            return;
        }

        // Check pressed button is Y - Ctrl+Y.
        if (ctrlKey && code === "KeyY") {
            redo()
            return;
        }

    });

    }
    console.log("canvas changed");
    return () => {
      canvas?.__eventListeners = {};

    };
  }, [canvas]);

  // useEffect(() => {
  //   if (canvas) {
  //     canvas.off("mouse:down", (o) => onCanvasMouseDown(o, editor, canvas));
  //     canvas.off("mouse:move", (o) => onCanvasMouseMove(o, editor, canvas));
  //     canvas.off("mouse:up", (o) => onCanvasMouseUp(o));
  //     canvas.on("mouse:down", (o) => onCanvasMouseDown(o, editor, canvas));
  //     canvas.on("mouse:move", (o) => onCanvasMouseMove(o, editor, canvas));
  //     canvas.on("mouse:up", (o) => onCanvasMouseUp(o));
  //   }
  
  //   return () => {};
  // }, [editor, canvas]);

  return (
    <CanvasFabric
      onContextMenu={(e) => {
        e.preventDefault();
        setcontextMenuStatus(true);
      }}
    />
  );
};

export default FabricEditor;
