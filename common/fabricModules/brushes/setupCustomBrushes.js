import CrayonBrush from "./CrayonBrush";
import DripBrush from "./DripBrush";
import InkBrush from "./InkBrush";
import MarkerBrush from "./MarkerBrush";
import SprayBrush from "./SprayBrush";
import Stroke from "./Stroke";
export const setupCustomBrushes = (fabric, options) => {
fabric.Point.prototype.angleBetween = function(that){
    return Math.atan2( this.x - that.x, this.y - that.y);
  };

fabric.Point.prototype.normalize = function(thickness) {
  if (null === thickness || undefined === thickness) {
    thickness = 1;
  }

    var length = this.distanceFrom({ x: 0, y: 0 });

    if (length > 0) {
      this.x = this.x / length * thickness;
      this.y = this.y / length * thickness;
    }

    return this;
  };

fabric.util.getRandom = function(max, min){
  min = min ? min : 0;
  return Math.random() * ((max ? max : 1) - min) + min;
};
fabric.util.clamp = function (n, max, min) {
  if (typeof min !== 'number') min = 0;
  return n > max ? max : n < min ? min : n;
};

fabric.Stroke=Stroke
fabric.Drip=DripBrush
fabric.CrayonBrush=CrayonBrush
fabric.InkBrush=InkBrush
fabric.MarkerBrush=MarkerBrush
fabric.SprayBrush=SprayBrush


};

export default setupCustomBrushes;
