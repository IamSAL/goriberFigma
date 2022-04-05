import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";

export function CanvasFabric({ setCanvas }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    setCanvas(
      new fabric.Canvas(canvasRef.current, {
        width: Math.min(screen.width, 1440),
        height: screen.height || 1200,
        selection: false,
      })
    );
  }, [setCanvas]);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
}
