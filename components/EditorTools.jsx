import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import TextFieldsOutlinedIcon from "@mui/icons-material/TextFieldsOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined";
import {
  useEditorState,
  useEditorStateModifier,
} from "../common/contexts/EditorProvider";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    border: 0,
    "&.Mui-disabled": {
      border: 0,
      color: "red !important",
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

export default function EditorTools() {
  const { setDrawingMode } = useEditorStateModifier();
  const [elementTool, setElementTool] = React.useState(() => [""]);

  useEffect(() => {
    if (["pencil", "brush"].includes(elementTool)) {
      setDrawingMode({ status: true, tool: elementTool });
    } else if (["rect", "circle", "text"].includes(elementTool)) {
      setDrawingMode({ status: false, tool: elementTool });
    } else if (["move"].includes(elementTool)) {
      setDrawingMode({ status: false, tool: elementTool });
    } else {
      setDrawingMode({ status: false, tool: "" });
    }

    return () => {};
  }, [elementTool]);

  const handleElementTool = (event, newTool) => {
    setElementTool(newTool || "move");
  };

  return (
    <div>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexWrap: "wrap",

          "&.MuiPaper-root": {
            backgroundColor: "unset",
          },
          "& .MuiSvgIcon-root": {
            color: "#d1d1d1 !important",
          },
          "& .Mui-selected": {
            backgroundColor: "#5d03bf !important",
            "& .MuiSvgIcon-root": {
              color: "#fff !important",
            },
            "&:hover": {
              backgroundColor: "#501293 !important",
            },
          },
        }}
      >
        <StyledToggleButtonGroup
          size="small"
          value={elementTool}
          exclusive
          onChange={handleElementTool}
          aria-label="text formatting"
        >
          <ToggleButton value="move" aria-label="left aligned">
            <PanToolOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="pencil" aria-label="left aligned">
            <CreateOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="brush" aria-label="centered">
            <BrushOutlinedIcon />
          </ToggleButton>

          <ToggleButton value="circle" aria-label="bold">
            <CircleOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="rect" aria-label="italic">
            <CheckBoxOutlineBlankOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="text" aria-label="underlined">
            <TextFieldsOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </StyledToggleButtonGroup>
      </Paper>
    </div>
  );
}
