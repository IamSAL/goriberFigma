import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `${value}px`;
}

export default function Scale() {
  return (
    <Box sx={{ width: "100%" }}>
      <Slider
        aria-label="Temperature"
        defaultValue={30}
        getAriaValueText={valuetext}
        valueLabelFormat={(val) => val + "px"}
        valueLabelDisplay="auto"
        color="secondary"
      />
    </Box>
  );
}
