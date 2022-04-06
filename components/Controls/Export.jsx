import { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import ExportOptions from "./../ExportOptions";

export default function Export({ EditorState }) {
  const {
    editor: { activeObject, allObjects },
    canvas,
  } = EditorState;

  return (
    <Box sx={{ width: "100%" }}>
      {activeObject ? (
        <>
         
          <ExportOptions EditorState={EditorState} />
        </>
      ) : (
        <p className="text-center text-muted">No object selected</p>
      )}
    </Box>
  );
}
