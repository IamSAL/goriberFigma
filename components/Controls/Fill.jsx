import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import {
  ColorPicker,
  ColorBox,
  ColorInput,
  ColorPalette,
  ColorButton,
} from "mui-color";

function valuetext(value) {
  return `${value}%`;
}

const palette = {
  red: "#ff0000",
  blue: "#0000ff",
  green: "#00ff00",
  yellow: "yellow",
  cyan: "cyan",
  lime: "lime",
  gray: "gray",
  orange: "orange",
  purple: "purple",
  black: "black",
  white: "white",
  pink: "pink",
  darkblue: "darkblue",
};

export default function Fill({ EditorState }) {
  const {
    editor: { activeObject, allObjects },
    canvas,
  } = EditorState;
  const [value, setvalue] = useState("");

  useEffect(() => {
    setvalue(activeObject?.fill);
    return () => {};
  }, [activeObject]);

  useEffect(() => {
    activeObject?.set({ fill: value });
    canvas?.renderAll();
    return () => {};
  }, [value, canvas, activeObject]);

  const onChange = (e) => {
    if (e.rgb) {
      setvalue(`rgb(${e.rgb.join(",")})`);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {activeObject ? (
        // <Slider
        //   aria-label="Temperature"
        //   value={value}
        //   min={1}
        //   max={800}
        //   getAriaValueText={valuetext}
        //   valueLabelFormat={(val) => val + "%"}
        //   valueLabelDisplay="auto"
        //   color="secondary"
        //   onChange={onChange}
        // />
        <div className="control fill">
          <div className="current-color">
            <ColorPicker
              value={value}
              onChange={onChange}
              disableTextfield={true}
            />
          </div>
          <ColorPalette
            palette={palette}
            onSelect={(color) => {
              setvalue(palette[color]);
            }}
          />
        </div>
      ) : (
        <p className="text-center text-muted">No object selected</p>
      )}
    </Box>
  );
}
