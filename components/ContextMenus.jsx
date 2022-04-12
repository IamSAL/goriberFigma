import React from "react";
import CanvasMenu from "./CanvasMenu";
import LayerItemMenu from "./LayerItemMenu";

const ContextMenus = () => {
  return (
    <div className="context-menus">
      <CanvasMenu />
      <LayerItemMenu />
    </div>
  );
};

export default ContextMenus;
