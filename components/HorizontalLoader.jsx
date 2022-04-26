import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useSelector } from 'react-redux';
export default function HorizontalLoader() {
  const loading = useSelector(state => state.UiController.loading)
  return (
    <Box
      sx={{
        width: "100%",
        position: "absolute",
        top: "0",
        zIndex: "100",
        display: loading ? "block" : "none",
      }}
    >
      <LinearProgress />
      <img id="load" src="/images/spinner.gif" />
    </Box>
  );
}
