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
import { randomColor } from "../../common/helpers";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ShuffleIcon from '@mui/icons-material/Shuffle';

function valuetext(value) {
  return `${value}%`;
}

const defaultPalette = {
  aqua: "#00ffff",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  black: "#000000",
  blue: "#0000ff",
  brown: "#a52a2a",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgrey: "#a9a9a9",
  darkgreen: "#006400",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkviolet: "#9400d3",
  fuchsia: "#ff00ff",
  gold: "#ffd700",
  green: "#008000",
  indigo: "#4b0082",
  khaki: "#f0e68c",
  lightblue: "#add8e6",
  lightcyan: "#e0ffff",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  magenta: "#ff00ff",
  maroon: "#800000",
  navy: "#000080",
  olive: "#808000",
  orange: "#ffa500",
  pink: "#ffc0cb",
  purple: "#800080",
  violet: "#800080",
  red: "#ff0000",
  silver: "#c0c0c0",
  white: "#ffffff",
  yellow: "#ffff00"
};

export default function Fill({ EditorState }) {
  const {
    editor: { activeObject, allObjects },
    canvas,
  } = EditorState;
  const [value, setvalue] = useState("");

  const [palette, setpalette] = useState(defaultPalette);

  function randomizeColors() {
    let colors = { ...defaultPalette };
    for (let key of Object.keys(colors)) {
      colors[key] = randomColor();
    }
    setpalette(colors);
  }

  

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
         
          <IconButton
            onClick={randomizeColors}
            color="primary"
            aria-label="Shuffle Colors"
            component="button"
          >
          <ShuffleIcon/>
          </IconButton>
          <IconButton
            onClick={() => {
              setpalette(defaultPalette);
            }}
            color="primary"
            aria-label="Reset to original"
            component="button"
          >
            <RestartAltIcon />
          </IconButton>
        </div>
      ) : (
        <p className="text-center text-muted">No object selected</p>
      )}
    </Box>
  );
}
