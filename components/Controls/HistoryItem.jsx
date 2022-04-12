import React, { useState, useEffect } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HistoryIcon from "@mui/icons-material/History";
import { TextField } from "@mui/material";
import DropdMenu from "../DropMenu";

const HistoryItem = ({ object, handleListItemClick, setactiveHistory }) => {
  return (
    <ListItem
      sx={{
        cursor: "pointer",
        width: "100%",
      }}
      onMouseEnter={(e) => {
        setactiveHistory(object);
      }}
    >
      <ListItemIcon
        onClick={(event) => handleListItemClick(event, 0, object)}
        sx={{
          minWidth: "25px",
        }}
      >
        <HistoryIcon />
      </ListItemIcon>
      <ListItemText
        primary={new Date(object.time).toLocaleTimeString()}
        secondary={null}
        onClick={(event) => handleListItemClick(event, 0, object)}
      />
    </ListItem>
  );
};

export default React.memo(HistoryItem);
