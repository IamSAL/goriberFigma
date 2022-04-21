import { hexToRGB } from './../../helpers';
import { fabric } from "fabric";
import { nanoid } from "nanoid";
export default fabric.util.createClass(fabric.BaseBrush, {
    
    color: "#000000",
    opacity: 1,
    width: 30,

    _baseWidth: 20,
    _dripCount: 0,
    _drips: [],
    _inkAmount: 7,
    _lastPoint: null,
    _point: null,
    _range: 10,
    _strokeCount: 0,
    _strokeId: null,
    _strokeNum: 40,
    _strokes: null,
    decimate: 0.4,
    initialize: function(canvas, opt) {
      opt = opt || {};
      this._points = [];

      this.canvas = canvas;
      this.width = opt.width || canvas.freeDrawingBrush.width;
      this.color = opt.color || canvas.freeDrawingBrush.color;
      this.opacity = opt.opacity || canvas.contextTop.globalAlpha;

      this._point = new fabric.Point();
    },

    changeColor: function(color){
      this.color = color;
    },

    changeOpacity: function(value){
      this.opacity = value;
      this.canvas.contextTop.globalAlpha = value;
    },

    _render: function(pointer){
      var subtractPoint, distance, point, i, len, strokes, stroke;
      this._strokeCount++;
      if (this._strokeCount % 120 === 0 && this._dripCount < 10) {
        this._dripCount++;
      }

      point = this.setPointer(pointer);
      subtractPoint = point.subtract(this._lastPoint);
      distance = point.distanceFrom(this._lastPoint);
      strokes = this._strokes;

      for (i = 0, len = strokes.length; i < len; i++) {
        stroke = strokes[i];
        stroke.update(point, subtractPoint, distance);
        stroke.draw();
        console.log({stroke})
      }

      if (distance > 30) {
        this.drawSplash(point, this._inkAmount);
      } else if (distance < 10 && fabric.util.getRandom() < 0.085 && this._dripCount) {
        this._drips.push(new fabric.Drip(this.canvas.contextTop, point, fabric.util.getRandom(this.size * 0.25, this.size * 0.1), this.color, this._strokeId));
        this._dripCount--;
      }
      this._points.push(point);
    },

    onMouseDown: function(pointer){
      this._resetTip(pointer);
      this._strokeId = +new Date();
      this._dripCount = fabric.util.getRandom(6, 3) | 0;
    },

    onMouseMove: function(pointer){
      if(this.canvas._isCurrentlyDrawing){
        this._render(pointer);
      }
    },

    onMouseUp: function(){
     
      this._strokeCount = 0;
      this._dripCount = 0;
      this._strokeId = null;
      //this._finalizeAndAddPath();
    },

    drawSplash: function(pointer, maxSize) {
      var c, r, i, point,
          ctx = this.canvas.contextTop,
          num = fabric.util.getRandom(12),
          range = maxSize * 10,
          color = this.color;

      ctx.save();
      for (i = 0; i < num; i++) {
        r = fabric.util.getRandom(range, 1);
        c = fabric.util.getRandom(Math.PI * 2);
        point = new fabric.Point(pointer.x + r * Math.sin(c), pointer.y + r * Math.cos(c));

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, fabric.util.getRandom(maxSize) / 2, 0, Math.PI * 2, false);
        ctx.fill();
      }
      ctx.restore();
    },

    setPointer: function(pointer) {
      var point = new fabric.Point(pointer.x, pointer.y);

      this._lastPoint = fabric.util.object.clone(this._point);
      this._point = point;

      return point;
    },

    _resetTip: function(pointer){
      var strokes, point, len, i;

      point = this.setPointer(pointer);
      strokes = this._strokes = [];
      this.size = this.width / 5 + this._baseWidth;
      this._strokeNum = this.size;
      this._range = this.size / 2;

      for (i = 0, len = this._strokeNum; i < len; i++) {
        strokes[i] = new fabric.Stroke(this.canvas.contextTop, point, this._range, this.color, this.width, this._inkAmount);
      }
    },



    decimatePoints: function(points, distance) {
      if (points.length <= 2) {
        return points;
      }
      var zoom = this.canvas.getZoom(), adjustedDistance = Math.pow(distance / zoom, 2),
          i, l = points.length - 1, lastPoint = points[0], newPoints = [lastPoint],
          cDistance;
      for (i = 1; i < l - 1; i++) {
        cDistance = Math.pow(lastPoint.x - points[i].x, 2) + Math.pow(lastPoint.y - points[i].y, 2);
        if (cDistance >= adjustedDistance) {
          lastPoint = points[i];
          newPoints.push(lastPoint);
        }
      }
      /**
       * Add the last point from the original line to the end of the array.
       * This ensures decimate doesn't delete the last point on the line, and ensures the line is > 1 point.
       */
      newPoints.push(points[l]);
      return newPoints;
    },


    createPath: function(pathData) {
      var path = new fabric.Path(pathData, {
        fill: null,
        stroke: hexToRGB(this.color,this.opacity),
        strokeWidth: this.width,
        strokeLineCap: this.strokeLineCap,
        strokeMiterLimit: this.strokeMiterLimit,
        strokeLineJoin: this.strokeLineJoin,
        strokeDashArray: this.strokeDashArray,
      });
      if (this.shadow) {
        this.shadow.affectStroke = true;
        path.shadow = new fabric.Shadow(this.shadow);
      }
      return path;
    },

    _isEmptySVGPath: function (pathData) {
      var pathString = fabric.util.joinPath(pathData);
      return pathString === 'M 0 0 Q 0 0 0 0 L 0 0';
    },

    convertPointsToSVGPath: function (points) {
      var correction = this.width / 1000;
      return fabric.util.getSmoothPathFromPoints(points, correction);
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
        name: "Inkbrush",
        obId: nanoid(10),
      })
      this.canvas.clearContext(this.canvas.contextTop);
      this.canvas.fire('before:path:created', { path: path });
      this.canvas.add(path);
      this.canvas.requestRenderAll();
      path.setCoords();
      this._resetShadow();
      this._points=[]
      // fire event 'path' created
      this.canvas.fire('path:created', { path: path });
    }
  });