import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
  theme,
} from "react-contexify";
import { useEffect } from "react";
import {
  useEditorState,
  useEditorStateModifier,
} from "./../common/contexts/EditorProvider";

function LayerItemMenu(props) {
  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const { show } = useContextMenu({
    id: "layer-item-menu",
  });

  const [EditorState, setEditorState] = useEditorState();
  const { canvas, editor } = EditorState;

  const {
    setActiveObject,
    setSelectedObjects,
    removeObject,
    renameObject,
    isSelected,
    updateCanvasState,
  } = useEditorStateModifier();

  function handleItemClick({ event, props, triggerEvent, data }) {
    const { object } = props;
    switch (event.currentTarget.id) {
      case "copy":
        canvas?.copyToClipboard(object || "");
        updateCanvasState();
        break;
      case "bring_forward":
        object?.bringForward();
        break;
      case "send_backward":
        object?.sendBackwards();
        break;
      case "bring_to_front":
        object?.bringToFront();
        break;
      case "send_to_back":
        object?.sendToBack();
        break;
      case "copy_as_svg":
        break;
      case "copy_as_json":
        break;
      case "delete":
        removeObject(object);
        break;
    }
    updateCanvasState();
  }

  return (
    <>
      <Menu id="layer-item-menu" animation="fade" theme={theme.dark}>
        <Item onClick={handleItemClick} id="copy">
          Copy
        </Item>
        <Submenu label="Copy/paste as">
          <Item onClick={handleItemClick}>Copy as SVG</Item>
          <Item onClick={handleItemClick}>Copy as JSON</Item>
        </Submenu>
        <Separator />
        <Item disabled>Lock/Unlock</Item>
        <Item disabled>Show/Hide</Item>
        <Separator />
        <Item onClick={handleItemClick} id="bring_to_front">
          Bring to front
        </Item>
        <Item onClick={handleItemClick} id="bring_forward">
          Bring forward
        </Item>
        <Item onClick={handleItemClick} id="send_backward">
          Send backward
        </Item>
        <Item onClick={handleItemClick} id="send_to_back">
          Send to back
        </Item>
        <Item onClick={handleItemClick} id="delete">
          Delete
        </Item>
      </Menu>
    </>
  );
}

export default LayerItemMenu;
