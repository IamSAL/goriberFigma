import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useAuth } from "./AuthProvider";
import { fabric } from "fabric";
import { getRandBetween, randomColor } from './../helpers';

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
    panMode:false,
    canvasState: [],
    currentStateIndex: -1,
    undoStatus: false,
    redoStatus: false,
    undoFinishedStatus: 1,
    redoFinishedStatus: 1,
    undoButton: null,
    redoButton: null,
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
            panMode:drawingOptions.tool?false:prev.editor.panMode
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
      if (editor.undoStatus == false && editor.redoStatus == false) {
        var jsonData = canvas.toJSON();
        var canvasAsJson = JSON.stringify(jsonData);
        if (editor.currentStateIndex < editor.canvasState.length - 1) {
          var indexToBeInserted = editor.currentStateIndex + 1;
          editor.canvasState[indexToBeInserted] = canvasAsJson;
          var numberOfElementsToRetain = indexToBeInserted + 1;
          editor.canvasState = editor.canvasState.splice(
            0,
            numberOfElementsToRetain
          );
        } else {
          editor.canvasState.push(canvasAsJson);
        }
        editor.currentStateIndex = editor.canvasState.length - 1;
        if (
          editor.currentStateIndex == editor.canvasState.length - 1 &&
          editor.currentStateIndex != -1
        ) {
          editor.redoButton?.disabled = "disabled";
        }
      }

      return {
        ...prev,
        editor: { ...editor, allObjects: allNewObjects || [] },
      };
    });
  };

  const undo = function () {
    console.log("undo called")
    setEditorState((prev) => {
      let editor = { ...prev.editor };
      if (editor.undoFinishedStatus) {
        if (editor.currentStateIndex == -1) {
          editor.undoStatus = false;
        } else {
          if (editor.canvasState.length >= 1) {
            editor.undoFinishedStatus = 0;
            if (editor.currentStateIndex != 0) {
              editor.undoStatus = true;
              canvas.loadFromJSON(
                editor.canvasState[editor.currentStateIndex - 1],
                function () {
                  var jsonData = JSON.parse(
                    editor.canvasState[editor.currentStateIndex - 1]
                  );
                  canvas.renderAll();
                  editor.undoStatus = false;
                  editor.currentStateIndex -= 1;
                  editor.undoButton?.removeAttribute("disabled");
                  if (
                    editor.currentStateIndex !==
                    editor.canvasState.length - 1
                  ) {
                    editor.redoButton?.removeAttribute("disabled");
                  }
                  editor.undoFinishedStatus = 1;
                }
              );
            } else if (editor.currentStateIndex == 0) {
              canvas.clear();
              editor.undoFinishedStatus = 1;
              editor.undoButton?.disabled = "disabled";
              editor.redoButton?.removeAttribute("disabled");
              editor.currentStateIndex -= 1;
            }
          }
        }
        return {
          ...prev,
          editor: editor,
        };
      } else {
        return prev;
      }
    });
  };

  const redo = function () {
    console.log("redo called")
    setEditorState((prev) => {
      let editor = { ...prev.editor };

      if (editor.redoFinishedStatus) {
        if (
          editor.currentStateIndex == editor.canvasState.length - 1 &&
          editor.currentStateIndex != -1
        ) {
          editor.redoButton?.disabled = "disabled";
        } else {
          if (
            editor.canvasState.length > editor.currentStateIndex &&
            editor.canvasState.length != 0
          ) {
            editor.redoFinishedStatus = 0;
            editor.redoStatus = true;
            canvas.loadFromJSON(
              editor.canvasState[editor.currentStateIndex + 1],
              function () {
                var jsonData = JSON.parse(
                  editor.canvasState[editor.currentStateIndex + 1]
                );
                canvas.renderAll();
                editor.redoStatus = false;
                editor.currentStateIndex += 1;
                if (editor.currentStateIndex != -1) {
                  editor.undoButton?.removeAttribute("disabled");
                }
                editor.redoFinishedStatus = 1;
                if (
                  editor.currentStateIndex == editor.canvasState.length - 1 &&
                  editor.currentStateIndex != -1
                ) {
                  editor.redoButton?.disabled = "disabled";
                }
              }
            );
          }
        }

        return {
          ...prev,
          editor: editor,
        };
      } else {
        return prev;
      }
    });
  };

  const addRect = function () {
    let rect = new fabric.Rect({
      left: getRandBetween(10,700),
      top: getRandBetween(10,700),           
      fill: randomColor(),
      width: 200,
      height: 200,
      name:"rectangle",
    });
    canvas.add(rect);
    setActiveObject(rect);
  };

  const addCircle = function () {
    let circle = new fabric.Circle({
            left: getRandBetween(10,700),
            top: getRandBetween(10,700),                
            radius:150,
            stroke:randomColor(),
            strokeWidth:3,
            name:"circle",
            fill:''
    });
    canvas.add(circle);
    setActiveObject(circle);
  };


  const addText = function () {
    let text = new fabric.Textbox('Text', { 
      fontFamily: 'Delicious_500', 
      left: getRandBetween(10,700),
      top: getRandBetween(10,700), 
      name:"text",
      editable: true,     
    })
    canvas.add(text);
    setActiveObject(text);
  };

  const deleteImage = function () {
  console.log("delete called")
   if(canvas){
    var selected = canvas.getActiveObjects(),
    selGroup = new fabric.ActiveSelection(selected, {
        canvas: canvas
    });
if (selGroup) {
  selGroup.forEachObject(function (obj) {
    canvas.remove(obj);
});
} else {
    return false;
}
// Use discardActiveObject to remove the selection border

canvas.discardActiveObject().renderAll();
clearActiveObject();
   }
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
    deleteImage
  };
};
