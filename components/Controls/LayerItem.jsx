import React, { useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { TextField } from "@mui/material";
import DropdMenu from "../DropMenu";
import LayerItemMenu from "../LayerItemMenu";
import {
  useContextMenu,
} from "react-contexify";

const LayerItem = ({
  object,
  handleListItemClick,
  removeObject,
  isSelected,
  renameObject,
  drawingMode,
}) => {
  const [isEditing, setisEditing] = useState(false);

  const { show } = useContextMenu({
    id: "layer-item-menu",
  });

  function handleContextMenu(event, object) {
    event.preventDefault();
    show(event, {
      props: {
        object: object,
      },
    });
  }

  return (
    <ListItem
      sx={{
        cursor: "pointer",
        width: "100%",
      }}
      selected={isSelected(object)}
      onContextMenu={(e) => handleContextMenu(e, object)}
    >
      <ListItemIcon
        onClick={(event) => handleListItemClick(event, 0, object)}
        sx={{
          minWidth: "25px",
        }}
      >
        <InsertDriveFileIcon />
      </ListItemIcon>
      {isEditing ? (
        <>
          <TextField
            name="name"
            sx={{
              width: "100%",
            }}
            defaultValue={object.name || "Untitled"}
            onBlur={(e) => {
              renameObject(object, e.target.value || "Unnamed");
              setisEditing(false);
            }}
            placeholder="Name"
            inputProps={{ "aria-label": "name" }}
            variant="standard"
          />
        </>
      ) : (
        <ListItemText
          primary={object.name || "Untitled"}
          secondary={null}
          onClick={(event) => handleListItemClick(event, 0, object)}
          onDoubleClick={() => setisEditing(true)}
        />
      )}
    </ListItem>
  );
};

export default React.memo(LayerItem);
