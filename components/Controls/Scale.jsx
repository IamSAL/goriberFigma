import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `${value}%`;
}

export default function Scale({ EditorState }) {
  const {
    editor: { activeObject, allObjects },
    canvas,
  } = EditorState;
  const [value, setvalue] = useState(10);

  useEffect(() => {
    setvalue(activeObject?.scaleY * 100 || 100);
    return () => {};
  }, [activeObject]);

  useEffect(() => {
    const val = value / 100;
    activeObject?.set({ scaleY: val, scaleX: val });
    canvas?.renderAll();
    return () => {};
  }, [value, canvas, activeObject]);

  const onChange = (e) => {
    if (e.target.value) {
      setvalue(e.target.value);
    }
  };
  return (
    <Box sx={{ width: "100%" }}>
      {activeObject ? (
        <Slider
          aria-label="Temperature"
          value={value}
          min={1}
          max={800}
          getAriaValueText={valuetext}
          valueLabelFormat={(val) => val + "%"}
          valueLabelDisplay="auto"
          color="secondary"
          onChange={onChange}
        />
      ) : (
        <p className="text-center text-muted">No object selected</p>
      )}
    </Box>
  );
}
