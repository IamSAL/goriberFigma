import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { useUiState } from "../common/contexts/UiContextProvider";
export default function HorizontalLoader() {
  const [UiState, setUiState] = useUiState();
  return (
    <Box
      sx={{
        width: "100%",
        position: "absolute",
        top: "0",
        zIndex: "100",
        display: UiState.loading ? "block" : "none",
      }}
    >
      <LinearProgress />
      <img id="load" src="/images/spinner.gif" />
    </Box>
  );
}
