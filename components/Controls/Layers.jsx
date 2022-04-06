import * as React from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Collapse from "@mui/material/Collapse";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import clsx from "clsx";
import { useEditorStateModifier } from "../../common/contexts/EditorProvider";
import DropdMenu from "../DropMenu";

export default function Layers({ EditorState }) {
  const {
    editor: { activeObject, selectedObjects, allObjects },
    canvas,
  } = EditorState;

  const { setActiveObject, setSelectedObjects, removeObject } =
    useEditorStateModifier();
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index, object) => {
    setSelectedIndex(index);
    setActiveObject(object);
    setSelectedObjects([]);
    console.log(canvas.getActiveObject());
  };

  const isSelected = (object) => {
    if (activeObject?.obId == object.obId) {
      return true;
    } else if (selectedObjects.some((ob) => ob.obId == object.obId)) {
      return true;
    } else if (canvas.getActiveObject()?.obId == object.obId) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <List
        dense={dense}
        sx={{
          "& .Mui-selected": {
            backgroundColor: "rgb(217, 217, 217) !important",
          },
        }}
      >
        {allObjects.map((object, idx) => {
          return (
            <ListItem
              key={idx}
              secondaryAction={
                <DropdMenu
                  onDelete={() => {
                    removeObject(object);
                  }}
                />
              }
              selected={isSelected(object)}
            >
              <ListItemIcon
                onClick={(event) => handleListItemClick(event, 0, object)}
              >
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText
                primary={object.name || "Untitled object"}
                secondary={secondary ? "layer" : null}
                onClick={(event) => handleListItemClick(event, 0, object)}
              />
            </ListItem>
          );
        })}

        {/* <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="Group" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              selected={selectedIndex === 2}
              onClick={(event) => handleListItemClick(event, 2)}
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText
                primary="Single-line item"
                secondary={secondary ? "Secondary text" : null}
              />
            </ListItem>
          </List>
        </Collapse> */}
      </List>
    </Box>
  );
}
