import React, { useState, useEffect, useCallback } from "react";
import { CanvasFabric } from "./CanvasFabric";
import { fabric } from "fabric";
import {
  useEditorState,
  useEditorStateModifier,
  useEditor,
} from "./../common/contexts/EditorProvider";
import { getSvgParts } from "./../common/getSvgParts";
import { nanoid } from "nanoid";
let circle, rect, isDown, origX, origY;

const FabricEditor = () => {
  const [EditorState, setEditorState] = useEditorState();
  const [contextMenuStatus, setcontextMenuStatus] = useState(false);
  const [drawingMode, setdrawingMode] = useState(false);
  const { canvas } = EditorState;
  const editor = useEditor();
  const {
    setCanvas,
    setActiveObject,
    clearActiveObject,
    setSelectedObjects,
    refreshEditorUI,
  } = useEditorStateModifier();

  useEffect(() => {
    setdrawingMode(editor.drawingMode);
    return () => {};
  }, [editor]);

  const onObjectMove = (e) => {
    console.log("move", e);
  };
  const onObjectAdded = ({ target }) => {
    console.log("added", target);
    target.set({
      scaleY: target.scaleY || 1,
      scaleX: target.scaleX || 1,

      obId: nanoid(10),
    });

    refreshEditorUI();
  };
  const onObjectRemoved = ({ target }) => {
    console.log("removed", target);
    refreshEditorUI();
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

      var center = new fabric.Path(getSvgParts("center"));
      var rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: "purple",
        width: 20,
        height: 20,
        name: "rect",
      });

      center.set({
        left: canvas.width / 2 - center.width,
        top: canvas.height / 2 - center.height,
        originX: "center",
        originY: "center",
        fill: "#2b2b2b",
        name: "center",
        scaleY: 5,
        scaleX: 5,
      });
      window.center = center;
      window.canvas = canvas;
      // const group = new fabric.Group([center]);
      canvas.add(rect);
      canvas.add(center);
      canvas.renderAll();
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
