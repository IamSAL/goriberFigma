import { fabric } from "fabric";
import { nanoid } from "nanoid";
export default fabric.util.createClass(fabric.BaseBrush, { 
  color: "#000000",
  opacity: 0.6,
  width: 30,
  _baseWidth: 20,
  _inkAmount: 10,
  _latestStrokeLength: 0,
  _point: null,
  _sep: 5,
  _size: 0,

  initialize: function(canvas, opt) {
    opt = opt || {};

    this.canvas = canvas;
    this.width = opt.width || canvas.freeDrawingBrush.width;
    this.color = opt.color || canvas.freeDrawingBrush.color;
    this.opacity = opt.opacity || canvas.contextTop.globalAlpha;
    this._point = new fabric.Point(0, 0);
  },

  changeColor: function(color){
    this.color = color;
  },

  changeOpacity: function(value){
    this.opacity = value;
  },

  onMouseDown: function(pointer){
    this.canvas.contextTop.globalAlpha = this.opacity;
    this._size = this.width / 2 + this._baseWidth;
    this.set(pointer);
  },

  onMouseMove: function(pointer){
    this.update(pointer);
    this.draw(this.canvas.contextTop);
  },

  onMouseUp: function(pointer){
    //this._finalizeAndAddPath();
  },

  set: function(p) {
    if (this._latest) {
      this._latest.setFromPoint(this._point);
    } else {
      this._latest = new fabric.Point(p.x, p.y);
    }
    fabric.Point.prototype.setFromPoint.call(this._point, p);
  },

  update: function(p) {
    this.set(p);
    this._latestStrokeLength = this._point.subtract(this._latest).distanceFrom({ x: 0, y: 0 });
  },

  draw: function(ctx) {
    var i, j, p, r, c, x, y, w, h, v, s, stepNum, dotSize, dotNum, range;

    v = this._point.subtract(this._latest);
    s = Math.ceil(this._size / 2);
    stepNum = Math.floor(v.distanceFrom({ x: 0, y: 0 }) / s) + 1;
    v.normalize(s);

    dotSize = this._sep * fabric.util.clamp(this._inkAmount / this._latestStrokeLength * 3, 1, 0.5);
    dotNum = Math.ceil(this._size * this._sep);

    range = this._size / 2;

    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    for (i = 0; i < dotNum; i++) {
      for (j = 0; j < stepNum; j++) {
        p = this._latest.add(v.multiply(j));
        r = fabric.util.getRandom(range);
        c = fabric.util.getRandom(Math.PI * 2);
        w = fabric.util.getRandom(dotSize, dotSize / 2);
        h = fabric.util.getRandom(dotSize, dotSize / 2);
        x = p.x + r * Math.sin(c) - w / 2;
        y = p.y + r * Math.cos(c) - h / 2;
        ctx.rect(x, y, w, h);
      }
    }
    ctx.fill();
    ctx.restore();
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

