import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import { useEditorStateModifier } from "../common/contexts/EditorProvider";

export function CanvasFabric({ onContextMenu }) {
  const canvasRef = useRef(null);
  const { setCanvas, clearActiveObject, setSelectedObjects, refreshEditorUI } =
    useEditorStateModifier();

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: document.querySelector("#canvas_wrapper")?.offsetWidth || 500,
      height: document.querySelector("#canvas_wrapper")?.offsetHeight || 500,
      backgroundColor: "rgba(232, 232, 232,1)",
    });
    setCanvas(canvas);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} onContextMenu={onContextMenu}></canvas>
    </>
  );
}
