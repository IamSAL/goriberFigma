import { nanoid } from "nanoid";
import { getRandBetween } from "./../helpers";
export const setupClipboardModule = (fabric, options) => {
  /**
   * Initialization of the plugin
   */
  fabric.Canvas.prototype._clipboardInit = function () {
    this.clipboard = "";
  };

  /**
   * Remove the custom event listeners
   */
  fabric.Canvas.prototype._clipboardDispose = function () {
    this.clipboard = "";
  };

  /**
   * copy
   */
  fabric.Canvas.prototype.copyToClipboard = function (content, callback) {
    this.clipboardProcessing = true;
    const canvas = this;
    if (typeof content == "object") {
      content.clone(function (cloned) {
        canvas.clipboard = cloned;
        canvas.clipboardProcessing = false;
        if (callback) {
          callback();
        }
      });
    } else {
      canvas.clipboard = content;
      canvas.clipboardProcessing = false;
      if (callback) {
        callback();
      }
    }
  };

  /**
   * paste
   */
  fabric.Canvas.prototype.pasteClipboard = function (
    type = "object",
    position
  ) {
    this.clipboardProcessing = true;
    const canvas = this;
    console.log({ position });
    if (type == "object") {
      canvas.clipboard.clone(function (clonedObj) {
        canvas.discardActiveObject();
        clonedObj.set({
          left: position?.left || clonedObj?.left + getRandBetween(-50, 50),
          top: position?.top || clonedObj?.top + getRandBetween(-50, 50),
          evented: true,
          obId: nanoid(10),
        });
        if (clonedObj.type === "activeSelection") {
          // active selection needs a reference to the canvas.
          clonedObj.canvas = canvas;
          clonedObj.forEachObject(function (obj) {
            obj.obId = nanoid(10);
            canvas.add(obj);
          });
          // this should solve the unselectability
          clonedObj.setCoords();
        } else {
          canvas.add(clonedObj);
        }
        canvas.clipboard.top += getRandBetween(-50, 50);
        canvas.clipboard.left += getRandBetween(-50, 50);

        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
      });
    } else if (type == "json") {
      this.loadFromJSON(
        this.clipboard,
        this.renderAll.bind(this),
        function (o, object) {
          // `o` = json object
          // `object` = fabric.Object instance
          // ... do some stuff ...
          object.set({
            top: position?.top || 0,
            left: position?.left || 0,
          });
        }
      );
    } else if (type == "svg") {
    }

    this.clipboardProcessing = false;
  };

  /**
   * Clear undo and redo clipboard stacks
   */
  fabric.Canvas.prototype.clearClipboard = function () {
    this.clipboard = "";
    this.fire("clipboard:clear");
  };

  /**
   * Off the clipboard
   */
  fabric.Canvas.prototype.offClipboard = function () {
    this.clipboardProcessing = true;
  };

  /**
   * On the clipboard
   */
  fabric.Canvas.prototype.onClipboard = function () {
    this.clipboardProcessing = false;
    this._clipboardSaveAction();
  };
};

export default setupClipboardModule;
