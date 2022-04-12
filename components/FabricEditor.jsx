import React, { useState, useEffect, useCallback } from "react";
import { CanvasFabric } from "./CanvasFabric";
import { fabric } from "fabric";
import {
  useEditorState,
  useEditorStateModifier,

} from "./../common/contexts/EditorProvider";
import { getSvgParts } from "./../common/getSvgParts";
import { useUiStateModifier } from "../common/contexts/UiContextProvider";
import ContextMenu from './ContextMenu';
import {
  useContextMenu,
} from "react-contexify";
import CanvasMenu from "./CanvasMenu";


const FabricEditor = () => {
  const [EditorState, setEditorState] = useEditorState();
  const [contextMenuStatus, setcontextMenuStatus] = useState(false);
  const { canvas,editor } = EditorState;
const {setContextMenu}=useUiStateModifier()
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

  const { show:showLayerMenu } = useContextMenu({
    id: "layer-item-menu",
  });


  const { show:showCanvasMenu } = useContextMenu({
    id: "canvas-menu",
  });

 

  function handleContextMenu(e,props) {
    e.preventDefault();

    let objectFound = false;
    let clickPoint = new fabric.Point(e.offsetX, e.offsetY);
    let currentObj=null
    canvas?.getObjects().forEach(obj=>{
      if (!objectFound && obj.containsPoint(clickPoint)) {
        objectFound = true;
        console.log("context",obj)
        currentObj=obj
        //TODO: whatever you want with the object
      
        
        
    }
    })

    if(objectFound && currentObj){
    
      showLayerMenu(e, {
        props: {
          object: currentObj,
        },
      });
   
    }else{
     
      showCanvasMenu(e, {
        props: {
          postion:{x:0,y:0}
        }
      });
    }

    

  
   
  }


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



  //   document.querySelector('.upper-canvas').addEventListener('contextmenu', function (e) {
  //     var objectFound = false;
  //     var clickPoint = new fabric.Point(e.offsetX, e.offsetY);
  //     setContextMenu(true,"editor",{x:e.clientX, y:e.clientY})
  //     console.log("context clicked")
  //     e.preventDefault();
  //     canvas.forEachObject(function (obj) {
  //         if (!objectFound && obj.containsPoint(clickPoint)) {
  //             objectFound = true;
  //             console.log("context",obj)
  //             //TODO: whatever you want with the object
  //         }
  //     });
  // });

  
    document.querySelector('.upper-canvas').addEventListener('contextmenu', (e)=>{
      handleContextMenu(e,{})
    });


    }
    console.log("canvas changed");
    return () => {
      canvas?.__eventListeners = {};

    };
  }, [canvas]);






  return (
  <>
    <CanvasFabric
    onContextMenu={(e) => handleContextMenu(e, object)}
    />
  </>
  );
};

export default FabricEditor;
