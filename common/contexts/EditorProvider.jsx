import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useAuth } from "./AuthProvider";

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

export const useEditorStateModifier = () => {
  const [EditorState, setEditorState] = useContext(EditorContext);

  const {
    editor: { activeObject, allObjects },
    canvas,
  } = EditorState;

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
    canvas.renderAll();
  };

  const setSelectedObjects = (objects) => {
    setEditorState((prev) => {
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

  const getActiveObject = (options) => {
    return EditorState.editor.activeObject;
  };

  const removeObject = (object) => {
    canvas?.remove(object);
    return EditorState.editor.activeObject;
  };

  const clearActiveObject = () => {
    setEditorState((prev) => {
      return {
        ...prev,
        editor: { ...prev.editor, activeObject: null },
      };
    });
  };

  const refreshEditorUI = useCallback(
    (e) => {
      const allNewObjects = canvas?.getObjects();
      setEditorState((prev) => {
        return {
          ...prev,
          editor: { ...prev.editor, allObjects: allNewObjects || [] },
        };
      });
    },
    [canvas]
  );

  return {
    setFullScreenMenuOpen,
    setHeaderFooterVisibility,
    setCanvas,
    setActiveObject,
    getActiveObject,
    removeObject,
    clearActiveObject,
    setSelectedObjects,
    refreshEditorUI,
  };
};
