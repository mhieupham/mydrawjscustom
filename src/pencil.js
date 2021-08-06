
import FabricCanvasTool from './fabrictool'
import './eraser_brush';
const fabric = require('fabric').fabric;


class Pencil extends FabricCanvasTool {
  configureCanvas(props) {
    this._canvas.isDrawingMode = true;
    if (props.isErase) {
      this._canvas.freeDrawingBrush = new fabric.EraserBrush(this._canvas);
      this._canvas.freeDrawingBrush.width = props.lineWidth;
    } else {
      this._canvas.freeDrawingBrush = new fabric.PencilBrush(this._canvas);
      this._canvas.freeDrawingBrush.width = props.lineWidth;
      this._canvas.freeDrawingBrush.color = props.lineColor;
    }
  }
}

export default Pencil;