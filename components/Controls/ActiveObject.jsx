import { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

export default function ActiveObject({ EditorState }) {
  const {
    editor: { activeObject, allObjects },
    canvas,
  } = EditorState;

  return (
    <Box sx={{ width: "100%" }}>
      {activeObject ? (
        <>
          {activeObject.obId}:{activeObject.name}
        </>
      ) : (
        <p className="text-center text-muted">No object selected</p>
      )}
    </Box>
  );
}
