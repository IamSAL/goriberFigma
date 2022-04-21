import { fabric } from "fabric";
import { nanoid } from "nanoid";
export default fabric.util.createClass(fabric.BaseBrush, {
    
    color: "#000000",
    opacity: 1,
    width: 30,

    _baseWidth: 10,
    _lastPoint: null,
    _lineWidth: 3,
    _point: null,
    _size: 0,

    initialize: function(canvas, opt) {
      opt = opt || {};

      this.canvas = canvas;
      this.width = opt.width || canvas.freeDrawingBrush.width;
      this.color = opt.color || canvas.freeDrawingBrush.color;
      this.opacity = opt.opacity || canvas.contextTop.globalAlpha;
      this._point = new fabric.Point();

      this.canvas.contextTop.lineJoin = 'round';
      this.canvas.contextTop.lineCap = 'round';
    },

    changeColor: function(color) {
      this.color = color;
    },

    changeOpacity: function(value) {
      this.opacity = value;
    },

    _render: function(pointer) {
      var ctx, lineWidthDiff, i;

      ctx = this.canvas.contextTop;

      ctx.beginPath();

      for(let i = 0, len = (this._size / this._lineWidth) / 2; i < len; i++) {
        lineWidthDiff = (this._lineWidth - 1) * i;

        ctx.globalAlpha = 0.8 * this.opacity;
        ctx.moveTo(this._lastPoint.x + lineWidthDiff, this._lastPoint.y + lineWidthDiff);
        ctx.lineTo(pointer.x + lineWidthDiff, pointer.y + lineWidthDiff);
        ctx.stroke();
      }

      this._lastPoint = new fabric.Point(pointer.x, pointer.y);
    },

    onMouseDown: function(pointer) {
      this._lastPoint = pointer;
      this.canvas.contextTop.strokeStyle = this.color;
      this.canvas.contextTop.lineWidth = this._lineWidth;
      this._size = this.width + this._baseWidth;
    },

    onMouseMove: function(pointer) {
      if (this.canvas._isCurrentlyDrawing) {
        this._render(pointer);
      }
    },

    onMouseUp: function() {
      
      this.canvas.contextTop.globalAlpha = this.opacity;
      //this._finalizeAndAddPath();
    },

    _finalizeAndAddPath: function() {
      var ctx = this.canvas.contextTop;
      ctx.closePath();
      if (this.decimate) {
        this._points = this.decimatePoints(this._points, this.decimate);
      }
      var pathData = this.convertPointsToSVGPath(this._points);
      if (this._isEmptySVGPath(pathData)) {
        // do not create 0 width/height paths, as they are
        // rendered inconsistently across browsers
        // Firefox 4, for example, renders a dot,
        // whereas Chrome 10 renders nothing
        this.canvas.requestRenderAll();
        return;
      }
      var path = this.createPath(pathData);
      path.set({
        name: "pencil",
        obId: nanoid(10),
      })
      this.canvas.clearContext(this.canvas.contextTop);
      this.canvas.fire('before:path:created', { path: path });
      this.canvas.add(path);
      this.canvas.requestRenderAll();
      path.setCoords();
      this._resetShadow();
      // fire event 'path' created
      this.canvas.fire('path:created', { path: path });
    }
  });