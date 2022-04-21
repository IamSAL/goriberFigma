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
import { useUiState } from "./UiContextProvider";

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
  const [UiState, setUiState] = useUiState();
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
        editor: { ...prev.editor, activeObject: canvas?.getActiveObject() },
      };
    });

    canvas?.renderAll();
  };

  const setSelectedObjects = (objects) => {
    if (objects.length == 1) {
      canvas?.setActiveObject(objects[0] || null);
      canvas?.renderAll();
    }

    setEditorState((prev) => {
      const newState = { ...prev };
      newState.editor.selectedObjects = objects || [];
      newState.editor.activeObject = objects[0] || null;
      return newState;
    });
    //setActiveObject(objects[0] || null);
  };
  const setDrawingMode = (drawingOptions) => {
    if (canvas) {
      setEditorState((prev) => {
        canvas.isDrawingMode = drawingOptions.status;
        if (drawingOptions.tool == "move") {
          canvas.selection = true;
        } else if(drawingOptions.tool=="pencil"){
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas,"PencilBrush", {});
        }
        else {
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

  const lockObject = (object) => {
    object?.set({
      lockSkewingY: true,
      lockSkewingX: true,
      lockMovementY: true,
      lockMovementX: true,
      hasControls: false,
      selectable: false,
    });
  };

  const unlockObject = (object) => {
    object?.set({
      lockSkewingY: false,
      lockSkewingX: false,
      lockMovementY: false,
      lockMovementX: false,
      hasControls: true,
      selectable: true,
    });
  };

  const hideObject = (object) => {
    object?.set({
      visible: false,
    });
    canvas?.requestRenderAll();
  };

  const showObject = (object) => {
    object?.set({
      visible: true,
    });
    canvas?.requestRenderAll();
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
    canvas?.requestRenderAll();
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
      setUiState((prev) => {
        return { ...prev, loading: true };
      });

      setTimeout(() => {
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
        setUiState((prev) => {
          return { ...prev, loading: false };
        });
      }, 100);
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
        });
      });
    } else {
      console.log("canvas not ready");
    }
  };

  const onObjectMove = (e) => {};
  const onObjectAdded = ({ target }) => {
    target.set({
      scaleY: target.scaleY || 1,
      scaleX: target.scaleX || 1,
      name: target.name || editor.drawingMode.tool || target.type,
      obId: target.obId || nanoid(10),
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
    // console.log("obj modifired called");
    // updateCanvasState();
  };

  const isSelected = (object) => {
    if (editor.activeObject?.obId == object.obId) {
      return true;
    } else if (editor.selectedObjects.some((ob) => ob.obId == object.obId)) {
      return true;
    } else if (canvas.getActiveObject()?.obId == object.obId) {
      return true;
    } else if (canvas.getActiveObjects().some((ob) => ob.obId == object.obId)) {
      return true;
    } else {
      return false;
    }
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
    unlockObject,
    hideObject,
    showObject,
    lockObject,
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
    cloneSelection,
    isSelected,
    onHistoryModified,
  };
};
