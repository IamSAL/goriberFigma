import { useRef, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";

import LayerItem from "./LayerItem.jsx";

import { useEditorStateModifier } from "../../common/contexts/EditorProvider";
import HistoryItem from "./HistoryItem.jsx";
import HistoryPreview from "../HistoryPreview.jsx";
export default function HistoryPanel({ EditorState }) {
  const {
    editor: { historyRedo, historyUndo },
    canvas,
  } = EditorState;

  const { setActiveObject, setSelectedObjects, removeObject, renameObject } =
    useEditorStateModifier();
  const [dense, setDense] = useState(false);
  const [activeHistory, setactiveHistory] = useState(null);
  const listRef = useRef();
  const previewRef = useRef();
  const handleListItemClick = (event, index, object) => {
    canvas?.goToHistory(object);
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }

    return () => {};
  }, [EditorState]);

  return (
    <Box sx={{ width: "100%" }}>
      <List
        dense={true}
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
        {historyUndo.map((object, idx) => {
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
