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
import ShuffleIcon from "@mui/icons-material/Shuffle";
import { useDebounce } from "react-use";

function valuetext(value) {
  return `${value}%`;
}

const defaultPalette = {
  black: "#000000",
  blue: "#0000ff",
  brown: "#a52a2a",
  cyan: "#00ffff",
  fuchsia: "#ff00ff",
  gold: "#ffd700",
  green: "#008000",
  lime: "#00ff00",
  magenta: "#ff00ff",
  navy: "#000080",
  orange: "#ffa500",
  pink: "#ffc0cb",
  purple: "#800080",
  violet: "#800080",
  red: "#ff0000",
  silver: "#c0c0c0",
  white: "#ffffff",
  yellow: "#ffff00",
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

  useDebounce(
    () => {
      activeObject?.set({ fill: value });
      canvas?.requestRenderAll();
    },
    200,
    [value, canvas, activeObject]
  );

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
            <ShuffleIcon />
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
