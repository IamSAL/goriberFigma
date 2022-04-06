import React, { useState, useEffect } from "react";
import { CanvasFabric } from "./CanvasFabric";
import { fabric } from "fabric";
import {
  useEditorState,
  useEditorStateModifier,
} from "./../common/contexts/EditorProvider";
import { getSvgParts } from "./../common/getSvgParts";
import { nanoid } from "nanoid";

const FabricEditor = () => {
  const [EditorState, setEditorState] = useEditorState();
  const [contextMenuStatus, setcontextMenuStatus] = useState(false);
  const { canvas } = EditorState;
  const {
    setCanvas,
    setActiveObject,
    clearActiveObject,
    setSelectedObjects,
    refreshEditorUI,
  } = useEditorStateModifier();

  const onObjectMove = (e) => {
    console.log("move", e);
  };
  const onObjectAdded = ({ target }) => {
    console.log("added", target);
    target.set({ scaleY: 1, scaleX: 1, obId: nanoid(10) });

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
  const onCanvasRenderUpdate = (e) => {};
  const onObjectModified = (e) => {
    console.log("modified", e);
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
      canvas.on("after:render", onCanvasRenderUpdate);
      // canvas.on("object:modified", onCanvasRenderUpdate);

      var center = new fabric.Path(getSvgParts("center"));
      var rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: "red",
        width: 20,
        height: 20,
        name: "rect",
      });

      center.set({
        left: canvas.width / 2 - center.width,
        top: canvas.height / 2 - center.height,
        fill: "orange",
        name: "center",
      });
      window.center = center;
      window.canvas = canvas;
      // const group = new fabric.Group([center]);
      canvas.add(rect);
      canvas.add(center);
      canvas.renderAll();
    }
    console.log("canvas changed");
    return () => {};
  }, [canvas]);

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
