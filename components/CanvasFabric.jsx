import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import { useEditorStateModifier } from "../common/contexts/EditorProvider";
import { setupPanModeModule } from "./../common/fabricModules/panning";
import { setupHistoryModule } from "./../common/fabricModules/history";
import { setupClipboardModule } from "./../common/fabricModules/clipboard";
import setupCustomBrushes from "../common/fabricModules/brushes/setupCustomBrushes";

export function CanvasFabric({ onContextMenu }) {
  const canvasRef = useRef(null);
  const { setCanvas, clearActiveObject, setSelectedObjects } =
    useEditorStateModifier();

  useEffect(() => {

    setupPanModeModule(fabric);
    setupHistoryModule(fabric);
    setupClipboardModule(fabric);
    setupCustomBrushes(fabric);
    /**
     * Override the initialize function to include modules
     */
    fabric.Canvas.prototype.initialize = (function (originalFn) {
      return function (...args) {
        originalFn.call(this, ...args);
        this._historyInit();
        this._clipboardInit();
        return this;
      };
    })(fabric.Canvas.prototype.initialize);

    /**
     * Override the dispose function to cleanup modules
     */
    fabric.Canvas.prototype.dispose = (function (originalFn) {
      return function (...args) {
        originalFn.call(this, ...args);
        this._historyDispose();
        this._clipboardDispose();
        return this;
      };
    })(fabric.Canvas.prototype.dispose);

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: document.querySelector("#canvas_wrapper")?.offsetWidth || 500,
      height: document.querySelector("#canvas_wrapper")?.offsetHeight || 500,
      backgroundColor: "rgba(232, 232, 232,1)",
      renderOnAddRemove: true,
      preserveObjectStacking: true,
    });

    setCanvas(canvas);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} onContextMenu={onContextMenu}></canvas>
    </div>
  );
}
