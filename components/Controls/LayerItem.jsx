import React, { useState, useRef } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { TextField } from "@mui/material";
import DropdMenu from "../DropMenu";
import LayerItemMenu from "../LayerItemMenu";
import { useContextMenu } from "react-contexify";
import { useClickAway } from "react-use";
import HexagonOutlinedIcon from "@mui/icons-material/HexagonOutlined";
import FormatShapesOutlinedIcon from "@mui/icons-material/FormatShapesOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import SquareOutlinedIcon from "@mui/icons-material/SquareOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import GestureOutlinedIcon from "@mui/icons-material/GestureOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import { useEditorStateModifier } from "../../common/contexts/EditorProvider";

const LayerItem = ({
  object,
  handleListItemClick,
  drawingMode,
  isSelected,
  removeObject,
  renameObject,
}) => {
  const [isEditing, setisEditing] = useState(false);
  const editorRef = useRef(null);
  const [newName, setnewName] = useState(
    object.name || object.type || "Unnamed"
  );
  const [showLayer, setshowLayer] = useState(object.visibility || true);
  const [layerLocked, setLayerLocked] = useState(
    object.selectable ? false : true
  );

  const { unlockObject, lockObject, hideObject, showObject } =
    useEditorStateModifier();

  useClickAway(editorRef, () => {
    renameObject(object, newName || object.type || "Unnamed");
    setisEditing(false);
  });

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
        opacity: showLayer && layerLocked == false ? "1" : "0.5",
      }}
      className="layer_item"
      selected={isSelected(object)}
      onContextMenu={(e) => handleContextMenu(e, object)}
    >
      <ListItemIcon
        onClick={(event) => handleListItemClick(event, 0, object)}
        sx={{
          minWidth: "25px",
        }}
      >
        {_renderIcon(object.type)}
      </ListItemIcon>
      {isEditing ? (
        <>
          <TextField
            name="name"
            sx={{
              width: "100%",
            }}
            value={newName}
            ref={editorRef}
            onChange={(e) => {
              setnewName(e.target.value || "");
            }}
            placeholder="Name"
            inputProps={{ "aria-label": "name" }}
            variant="standard"
          />
        </>
      ) : (
        <>
          <ListItemText
            primary={object.name || object.type || "Untitled"}
            secondary={null}
            onClick={(event) => handleListItemClick(event, 0, object)}
            onDoubleClick={() => setisEditing(true)}
          />
          <div
            className="action-icons"
            style={{ display: !showLayer || layerLocked ? "block" : "none" }}
          >
            <ListItemIcon
              onClick={() => {
                if (object.visible) {
                  hideObject(object);
                  setshowLayer(false);
                } else {
                  showObject(object);
                  setshowLayer(true);
                }
              }}
              sx={{
                minWidth: "20px",
              }}
            >
              {showLayer ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </ListItemIcon>
            <ListItemIcon
              onClick={() => {
                if (layerLocked) {
                  unlockObject(object);
                  setLayerLocked(false);
                } else {
                  lockObject(object);
                  setLayerLocked(true);
                }
              }}
              sx={{
                minWidth: "20px",
              }}
            >
              {layerLocked ? <LockIcon /> : <LockOpenIcon />}
            </ListItemIcon>
          </div>
        </>
      )}
    </ListItem>
  );
};

function _renderIcon(type) {
  let icon = "";
  switch (type) {
    case "path":
      icon = <GestureOutlinedIcon />;
      break;
    case "textbox":
      icon = <FormatShapesOutlinedIcon />;
      break;
    case "circle":
      icon = <CircleOutlinedIcon />;
      break;
    case "rect":
      icon = <SquareOutlinedIcon />;
      break;
    default:
      icon = <LayersOutlinedIcon />;
      break;
  }

  return icon;
}

export default React.memo(LayerItem);
