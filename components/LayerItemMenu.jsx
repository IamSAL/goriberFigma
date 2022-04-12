import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
  theme,
} from "react-contexify";
import { useEffect } from "react";
import { useEditorStateModifier } from "./../common/contexts/EditorProvider";

function LayerItemMenu(props) {
  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const { show } = useContextMenu({
    id: "layer-item-menu",
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
    console.log(props);
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
        <Item onClick={handleItemClick}>Bring to front</Item>
        <Item onClick={handleItemClick}>Send to back</Item>
        <Item onClick={handleItemClick} id="delete">
          Delete
        </Item>
      </Menu>
    </>
  );
}

export default LayerItemMenu;
