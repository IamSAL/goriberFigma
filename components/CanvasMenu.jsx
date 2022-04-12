import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
  theme,
} from "react-contexify";
import { useEffect } from "react";
import { useEditorStateModifier } from "../common/contexts/EditorProvider";

function CanvasMenu(props) {
  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const { show } = useContextMenu({
    id: "canvas-menu",
  });

  const {
    setActiveObject,
    setSelectedObjects,
    removeObject,
    renameObject,
    isSelected,
  } = useEditorStateModifier();

  function handleItemClick({ event, props, triggerEvent, data }) {
    const { object } = props;
    switch (event.currentTarget.id) {
      case "copy":
        break;
      case "copy_as_svg":
        break;
      case "copy_as_json":
        break;
      case "delete":
        removeObject(object);
        break;
    }
  }

  return (
    <>
      <Menu id="canvas-menu" animation="fade" theme={theme.dark}>
        <Item onClick={handleItemClick} id="paste">
          Paste here
        </Item>
        <Item disabled>Show/Hide UI</Item>
        <Separator />
        <Submenu label="Quick actions">
          <Item onClick={handleItemClick}>Export Canvas</Item>
          <Item onClick={handleItemClick}>Reset zoom</Item>
        </Submenu>
      </Menu>
    </>
  );
}

export default CanvasMenu;
