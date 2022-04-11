import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useAuth } from "./AuthProvider";
import { fabric } from "fabric";
import { getRandBetween, randomColor } from "./../helpers";
import { nanoid } from "nanoid";

export const EditorContext = createContext();
export const defaultEditorState = {
  headerVisibility: true,
  footerVisibility: true,
  toolBarVisibility: false,
  fullScreenMenuOpen: false,
  editor: {
    activeObject: null,
    selectedObjects: [],
    allObjects: [],
    drawingMode: {
      status: false,
      tool: "",
      config: {
        strokeWidth: 1,
        strokeColor: "#000",
        radius: 0,
      },
    },
    historyRedo: [],
    historyUndo: [],
    panMode: false,
  },
  canvas: null,
};

export const EditorProvider = ({ children }) => {
  const [EditorState, setEditorState] = useState(defaultEditorState);

  useEffect(() => {
    if (localStorage.getItem(`editorData`)) {
      setEditorState(JSON.parse(localStorage.getItem(`editorData`)));
    }
    return () => {};
  }, []);

  return (
    <EditorContext.Provider value={[EditorState, setEditorState]}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorState = () => {
  const [EditorState, setEditorState] = useContext(EditorContext);
  return [EditorState, setEditorState];
};

export const useEditorData = () => {
  const [EditorState, setEditorState] = useContext(EditorContext);
  return EditorState;
};

export const useEditor = () => {
  const [EditorState, setEditorState] = useContext(EditorContext);

  return EditorState.editor;
};

export const useEditorStateModifier = () => {
  const [EditorState, setEditorState] = useContext(EditorContext);

  const { editor, canvas } = EditorState;

  const setFullScreenMenuOpen = (show) => {
    setEditorState((prev) => {
      return { ...prev, fullScreenMenuOpen: show };
    });
  };
  const setHeaderFooterVisibility = (isVisibleHeader, isVisibleFooter) => {
    setEditorState((prev) => {
      return {
        ...prev,
        headerVisibility: isVisibleHeader,
        footerVisibility: isVisibleFooter,
      };
    });
  };
  const setCanvas = (canvas) => {
    setEditorState((prev) => {
      return {
        ...prev,
        canvas: canvas,
      };
    });
  };

  const setActiveObject = (object, options) => {
    canvas?.setActiveObject(object);
    setEditorState((prev) => {
      return {
        ...prev,
        editor: { ...prev.editor, activeObject: object },
      };
    });

    canvas?.renderAll();
  };

  const setSelectedObjects = (objects) => {
    setEditorState((prev) => {
      if (objects.length == 1) {
        canvas?.setActiveObject(objects[0] || null);
      }
      return {
        ...prev,
        editor: {
          ...prev.editor,
          selectedObjects: objects || [],
          activeObject: objects[0] || null,
        },
      };
    });
  };
  const setDrawingMode = (drawingOptions) => {
    if (canvas) {
      setEditorState((prev) => {
        canvas.isDrawingMode = drawingOptions.status;
        if (drawingOptions.tool == "move") {
          canvas.selection = true;
        } else {
          canvas.selection = false;
        }
        return {
          ...prev,
          editor: {
            ...prev.editor,
            drawingMode: { ...prev.editor.drawingMode, ...drawingOptions },
            panMode: drawingOptions.tool ? false : prev.editor.panMode,
          },
        };
      });
    }
  };

  const getDrawingMode = (drawingOptions) => {
    const {
      canvas,
      editor: { drawingMode },
    } = EditorState;

    return drawingMode;
  };

  const getActiveObject = (options) => {
    return EditorState.editor.activeObject;
  };

  const removeObject = (object) => {
    canvas?.remove(object);
  };

  const renameObject = (object, newName) => {
    object.set({ name: newName });
    setActiveObject(object);
  };

  const clearActiveObject = () => {
    setEditorState((prev) => {
      return {
        ...prev,
        editor: { ...prev.editor, activeObject: null },
      };
    });
  };

  const updateCanvasState = function () {
    setEditorState((prev) => {
      let editor = { ...prev.editor };
      const allNewObjects = canvas?.getObjects();

      return {
        ...prev,
        editor: { ...editor, allObjects: allNewObjects || [] },
      };
    });
  };

  const undo = function () {
    console.log("undo called");
    canvas?.undo();
  };

  const redo = function () {
    console.log("redo called");
    canvas?.redo();
  };

  const addRect = function () {
    let rect = new fabric.Rect({
      left: getRandBetween(10, 700),
      top: getRandBetween(10, 700),
      fill: randomColor(),
      width: 200,
      height: 200,
      name: "rectangle",
    });
    canvas.add(rect);
    setActiveObject(rect);
  };

  const addCircle = function () {
    let circle = new fabric.Circle({
      left: getRandBetween(10, 700),
      top: getRandBetween(10, 700),
      radius: 150,
      stroke: randomColor(),
      strokeWidth: 3,
      name: "circle",
      fill: "",
    });
    canvas.add(circle);
    setActiveObject(circle);
  };

  const addText = function () {
    let text = new fabric.Textbox("Text", {
      fontFamily: "Delicious_500",
      left: getRandBetween(10, 700),
      top: getRandBetween(10, 700),
      name: "text",
      editable: true,
    });
    canvas.add(text);
    setActiveObject(text);
  };

  const deleteImage = function () {
    if (canvas) {
      const activeObjects = canvas.getActiveObjects();
      // remove objects
      if (activeObjects.length > 0) {
        canvas.offHistory();

        for (var i = 0; i < activeObjects.length; i++) {
          if (!activeObjects[i].isEditing) {
            canvas.remove(activeObjects[i]);
          }
        }
        canvas.onHistory();
        canvas.discardActiveObject().renderAll();
        clearActiveObject();
      }
    }
  };

  const cloneSelection = () => {
    if (canvas) {
      let _clipboard = null;
      canvas.getActiveObject().clone(function (cloned) {
        _clipboard = cloned;
        _clipboard.clone(function (clonedObj) {
          canvas.discardActiveObject();
          clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            evented: true,
          });
          if (clonedObj.type === "activeSelection") {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = canvas;
            clonedObj.forEachObject(function (obj) {
              canvas.add(obj);
            });
            // this should solve the unselectability
            clonedObj.setCoords();
          } else {
            canvas.add(clonedObj);
          }
          _clipboard.top += 10;
          _clipboard.left += 10;
          setActiveObject(clonedObj);
          canvas.requestRenderAll();
        });
      });
    } else {
      console.log("canvas not ready");
    }
  };

  const onObjectMove = (e) => {
    console.log("move", e);
  };
  const onObjectAdded = ({ target }) => {
    target.set({
      scaleY: target.scaleY || 1,
      scaleX: target.scaleX || 1,
      name: target.name || editor.drawingMode.tool || "untitled",
      obId: nanoid(10),
    });
    updateCanvasState();
  };
  const onObjectRemoved = ({ target }) => {
    updateCanvasState();
  };

  const onSelectedCreated = ({ e, selected }) => {
    setSelectedObjects(selected);
  };
  const onSelectedCleared = ({ e, selected }) => {
    clearActiveObject();
    setSelectedObjects([]);
  };

  const onObjectModified = (e) => {
    // updateCanvasState();
  };

  const onHistoryModified = (e) => {
    const { historyRedo, historyUndo } = canvas;
    setEditorState((prev) => {
      return {
        ...prev,
        editor: {
          ...prev.editor,
          historyRedo: historyRedo || [],
          historyUndo: historyUndo || [],
        },
      };
    });
  };

  return {
    setFullScreenMenuOpen,
    setHeaderFooterVisibility,
    setCanvas,
    setActiveObject,
    getActiveObject,
    removeObject,
    renameObject,
    clearActiveObject,
    setSelectedObjects,
    setDrawingMode,
    getDrawingMode,
    addRect,
    addCircle,
    addText,
    undo,
    redo,
    updateCanvasState,
    deleteImage,
    onObjectMove,
    onObjectAdded,
    onObjectModified,
    onObjectRemoved,
    onSelectedCreated,
    onSelectedCleared,
    onHistoryModified,
    cloneSelection,
  };
};
