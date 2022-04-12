import { useRef, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";

import LayerItem from "./LayerItem.jsx";

import { useEditorStateModifier } from "../../common/contexts/EditorProvider";
import HistoryItem from "./HistoryItem.jsx";
import HistoryPreview from "../HistoryPreview.jsx";
export default function HistoryPanel({ EditorState }) {
  const { canvas } = EditorState;

  const [dense, setDense] = useState(true);
  const [activeHistory, setactiveHistory] = useState(null);
  const listRef = useRef();
  const previewRef = useRef();
  const handleListItemClick = (event, index, object) => {
    canvas?.goToHistory(object);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <List
        dense={dense}
        sx={{
          "& .Mui-selected": {
            backgroundColor: "rgb(217, 217, 217) !important",
          },
          maxHeight: "75vh",
          overflowY: "scroll",
          height: "100vh",
          width: "100%",
        }}
        onMouseLeave={(e) => {
          setactiveHistory(null);
        }}
        onMouseMove={(e) => {
          if (previewRef.current) {
            previewRef.current.style.top = e.clientY + "px";
          }
        }}
        ref={listRef}
      >
        {canvas?.historyUndo?.map((object, idx) => {
          return (
            <HistoryItem
              object={object}
              key={idx}
              handleListItemClick={handleListItemClick}
              setactiveHistory={setactiveHistory}
            />
          );
        })}
      </List>

      {activeHistory && (
        <>
          <div className="history-preview" ref={previewRef}>
            {/* <h6>{new Date(activeHistory.time).toLocaleTimeString()}</h6> */}
            <HistoryPreview activeHistory={activeHistory} />
          </div>
        </>
      )}
    </Box>
  );
}
