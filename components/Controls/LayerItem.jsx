import React, { useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { TextField } from "@mui/material";
import DropdMenu from "../DropMenu";

const LayerItem = ({
  object,
  handleListItemClick,
  removeObject,
  isSelected,
  renameObject,
}) => {
  const [isEditing, setisEditing] = useState(false);

  return (
    <ListItem
      sx={{
        cursor: "pointer",
        width: "100%",
      }}
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

export default LayerItem;
