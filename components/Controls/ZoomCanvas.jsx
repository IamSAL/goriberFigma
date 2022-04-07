import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useEditorState } from "../../common/contexts/EditorProvider";

function valuetext(value) {
  return `${value}%`;
}

export default function ZoomCanvas({ onChange: onParentChange, zoomvalue }) {
  const [EditorState, setEditorState] = useEditorState();
  const {
    editor: { activeObject, allObjects },
    canvas,
  } = EditorState;

  useEffect(() => {
    onParentChange(canvas?.getZoom() * 100 || 100);
    return () => {};
  }, [canvas]);

  useEffect(() => {
    const val = zoomvalue / 100;
    canvas?.setZoom(val);

    return () => {};
  }, [zoomvalue, canvas]);

  const onChange = (e) => {
    if (e.target.value) {
      onParentChange(e.target.value);
    }
  };

  return (
    <Box sx={{ width: "100%", marginTop: "30px" }}>
      {canvas ? (
        <Slider
          aria-label="Zoom"
          value={zoomvalue}
          min={1}
          max={500}
          getAriaValueText={valuetext}
          valueLabelFormat={(val) => val + "%"}
          valueLabelDisplay="on"
          color="primary"
          onChange={onChange}
        />
      ) : (
        <p className="text-center text-muted">canvas is not ready yet.</p>
      )}
    </Box>
  );
}
