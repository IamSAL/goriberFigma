import React, { useEffect, useState, useRef } from "react";
import { fabric } from "fabric";

const HistoryPreview = ({ activeHistory }) => {
  const canvasPreviewRef = useRef();
  const [canvas, setcanvas] = useState(null);
  const [activeSnapshot, setactiveSnapshot] = useState("");
  useEffect(() => {
    const canvasInstance = new fabric.Canvas(canvasPreviewRef.current, {
      width: document.querySelector("#canvas_wrapper")?.offsetWidth || 500,
      height: document.querySelector("#canvas_wrapper")?.offsetHeight || 500,
      backgroundColor: "rgba(232, 232, 232,1)",
    });
    setcanvas(canvasInstance);
    return () => {};
  }, []);

  useEffect(() => {
    if (canvas) {
      canvas.loadFromJSON(JSON.stringify(activeHistory), function (data) {
        const img = canvas.toDataURL({
          format: "jpeg",
          quality: 0.8,
        });

        setactiveSnapshot(img);
      });
    }

    return () => {};
  }, [canvas, activeHistory]);

  return (
    <>
      {/* <h6>{new Date(activeHistory.time).toLocaleTimeString()}</h6> */}
      <img src={activeSnapshot} alt="" className="w-100" />
    </>
  );
};

export default HistoryPreview;
