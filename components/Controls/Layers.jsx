import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import LayerItem from "./LayerItem.jsx";

import { useEditorStateModifier } from "../../common/contexts/EditorProvider";
export default function Layers({ EditorState }) {
  const {
    editor: { activeObject, selectedObjects, allObjects, drawingMode },
    canvas,
  } = EditorState;

  const {
    setActiveObject,
    setSelectedObjects,
    removeObject,
    renameObject,
    isSelected,
  } = useEditorStateModifier();
  const [dense, setDense] = React.useState(true);
  const [secondary, setSecondary] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [editing, setediting] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleListItemClick = (event, index, object) => {
    setSelectedObjects([object]);
    // canvas?.setActiveObject(object);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <List
        dense={dense}
        sx={{
          "& .Mui-selected": {
            backgroundColor: "rgb(217, 217, 217) !important",
          },

          overflowY: "scroll",
          maxHeight: "80vh",
          width: "100%",
        }}
      >
        {allObjects.map((object, idx) => {
          return (
            <LayerItem
              object={object}
              key={idx}
              removeObject={removeObject}
              renameObject={renameObject}
              handleListItemClick={handleListItemClick}
              isSelected={isSelected}
              drawingMode={drawingMode}
            />
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
