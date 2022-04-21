import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from "react-contexify";
import LayerItem from "./LayerItem.jsx";
import { useEditorStateModifier } from "../../common/contexts/EditorProvider";
import LayerItemMenu from "../LayerItemMenu.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {reorderLayers } from "../../common/helpers.js";

export default function Layers({ EditorState }) {
  const {
    editor: { activeObject, selectedObjects, allObjects, drawingMode },
    canvas,
  } = EditorState;

  const {
    setSelectedObjects,
    removeObject,
    renameObject,
    isSelected,
    updateCanvasState,
  } = useEditorStateModifier();
  const [dense, setDense] = React.useState(true);

  const handleListItemClick = (event, index, object) => {
    setSelectedObjects([object]);
    // canvas?.setActiveObject(object);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (canvas) {
      const items = reorderLayers(
        canvas.getObjects().reverse(),
        result.source.index,
        result.destination.index
      );

      canvas._objects = items.reverse();
      updateCanvasState();
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              dense={dense}
              sx={{
                "& .Mui-selected": {
                  backgroundColor: "rgb(217, 217, 217) !important",
                },

                overflowY: "scroll",
                maxHeight: "80vh",
                minHeight: "80vh",
                width: "100%",
              }}
            >
              {canvas
                ?.getObjects()
                ?.reverse()
                ?.map((object, idx) => (
                  <Draggable
                    key={object.obId || idx}
                    draggableId={object.obId || idx||"dsd"}
                    index={idx}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <LayerItem
                          object={object}
                          removeObject={removeObject}
                          renameObject={renameObject}
                          handleListItemClick={handleListItemClick}
                          isSelected={isSelected}
                          drawingMode={drawingMode}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
}
