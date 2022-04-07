import React, { useState, useEffect, useCallback } from "react";
import { CanvasFabric } from "./CanvasFabric";
import { fabric } from "fabric";
import {
  useEditorState,
  useEditorStateModifier,

} from "./../common/contexts/EditorProvider";
import { getSvgParts } from "./../common/getSvgParts";
import { nanoid } from "nanoid";
let circle, rect, isDown, origX, origY;

const FabricEditor = () => {
  const [EditorState, setEditorState] = useEditorState();
  const [contextMenuStatus, setcontextMenuStatus] = useState(false);
  const { canvas,editor } = EditorState;

  const {
    setCanvas,
    setActiveObject,
    clearActiveObject,
    setSelectedObjects,
    updateCanvasState,
    deleteImage
  } = useEditorStateModifier();

;

  const onObjectMove = (e) => {
    console.log("move", e);
  };
  const onObjectAdded = ({ target }) => {
    console.log("added", target);
    target.set({
      scaleY: target.scaleY || 1,
      scaleX: target.scaleX || 1,
      name:target.name||editor.drawingMode.tool||"untitled",
      obId: nanoid(10),
    });
    updateCanvasState();
  
  };
  const onObjectRemoved = ({ target }) => {
    console.log("removed", target);
    updateCanvasState();
  };

  const onSelectedCreated = ({ e, selected }) => {
    console.log("selection", e);
    setSelectedObjects(selected);
  };
  const onSelectedCleared = ({ e, selected }) => {
    console.log("selection cleared", e);
    clearActiveObject();
    setSelectedObjects([]);
  };

  const onObjectModified = (e) => {
    console.log("modified", e);
    updateCanvasState();
  };

  const onCanvasMouseDown = (o, editor, canvas) => {
    isDown = true;
    var pointer = canvas.getPointer(o.e);
    origX = pointer.x;
    origY = pointer.y;

    console.log(editor.drawingMode);

    if (editor.drawingMode.tool == "circle") {
      circle = new fabric.Circle({
        left: origX,
        top: origY,
        originX: "left",
        originY: "top",
        radius: pointer.x - origX,
        angle: 0,
        fill: "",
        stroke: "red",
        strokeWidth: 3,
      });
      canvas?.add(circle);
    }
  };

  const onCanvasMouseMove = (o, editor, canvas) => {
    if (!isDown) return;
    var pointer = canvas?.getPointer(o.e);

    if (editor.drawingMode.tool == "circle") {
      var radius =
        Math.max(Math.abs(origY - pointer.y), Math.abs(origX - pointer.x)) / 2;
      if (radius > circle.strokeWidth) {
        radius -= circle.strokeWidth / 2;
      }
      circle.set({ radius: radius });

      if (origX > pointer.x) {
        circle.set({ originX: "right" });
      } else {
        circle.set({ originX: "left" });
      }
      if (origY > pointer.y) {
        circle.set({ originY: "bottom" });
      } else {
        circle.set({ originY: "top" });
      }
      canvas.renderAll();
    }
  };
  const onCanvasMouseUp = (o) => {
    isDown = false;
  };

  useEffect(() => {
    if (canvas) {
      canvas.on("object:moving", onObjectMove);
      canvas.on("object:added", onObjectAdded);
      canvas.on("object:modified", onObjectModified);
      canvas.on("object:removed", onObjectRemoved);
      canvas.on("selection:created", onSelectedCreated);
      canvas.on("selection:updated", onSelectedCreated);
      canvas.on("selection:cleared", onSelectedCleared);

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

      document.body.onkeydown = function (e) {
        switch (e.keyCode) {
          case 46: // delete
            deleteImage();
            break;
        }
      };

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
