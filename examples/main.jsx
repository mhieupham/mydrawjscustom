/*eslint no-unused-vars: 0, no-console: 0*/

import React from 'react';
import {CompactPicker} from 'react-color';
import 'flexboxgrid';
import './main.css';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CardHeader from '@material-ui/core/CardHeader';
import GridListTile from '@material-ui/core/GridListTile';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/lab/Slider';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Collapse from '@material-ui/core/Collapse';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import color from '@material-ui/core/colors/blueGrey';

import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import CopyIcon from '@material-ui/icons/FileCopy';
import RemoveIcon from '@material-ui/icons/Remove';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import dataJson from './data.json';
import dataJsonControlled from './data.json.controlled';
import {SketchField, Tools} from '../src';
import dataUrl from './data.url';
import DropZone from 'react-dropzone';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';

const styles = {
  root: {
    padding: '3px',
    display: 'flex',
    flexWrap: 'wrap',
    margin: '10px 10px 5px 10px',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100%',
    overflowY: 'auto',
    marginBottom: '24px',
  },
  gridTile: {
    backgroundColor: '#fcfcfc',
  },
  appBar: {
    backgroundColor: '#333',
  },
  radioButton: {
    marginTop: '3px',
    marginBottom: '3px',
  },
  separator: {
    height: '42px',
    backgroundColor: 'white',
  },
  iconButton: {
    fill: 'white',
    width: '42px',
    height: '42px',
  },
  dropArea: {
    width: '100%',
    height: '64px',
    border: '2px dashed rgb(102, 102, 102)',
    borderStyle: 'dashed',
    borderRadius: '5px',
    textAlign: 'center',
    paddingTop: '20px',
  },
  activeStyle: {
    borderStyle: 'solid',
    backgroundColor: '#eee',
  },
  rejectStyle: {
    borderStyle: 'solid',
    backgroundColor: '#ffdddd',
  },
  card: {
    margin: '10px 10px 5px 0'
  }
};

/**
 * Helper function to manually fire an event
 *
 * @param el the element
 * @param etype the event type
 */
function eventFire(el, etype) {
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

class SketchFieldDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tool: Tools.Pencil,
      lineWidth: 10,
      lineColor: "black",
      fillColor: "#68CCCA",
      backgroundColor: "transparent",
      shadowWidth: 0,
      shadowOffset: 0,
      enableRemoveSelected: false,
      fillWithColor: false,
      fillWithBackgroundColor: false,
      drawings: [],
      canUndo: false,
      canRedo: false,
      controlledSize: false,
      sketchWidth: 600,
      sketchHeight: 600,
      stretched: true,
      stretchedX: false,
      stretchedY: false,
      originX: "left",
      originY: "top",
      imageUrl: "https://files.gamebanana.com/img/ico/sprays/4ea2f4dad8d6f.png",
      expandTools: false,
      expandControls: false,
      expandColors: false,
      expandBack: false,
      expandImages: false,
      expandControlled: false,
      text: "text",
      enableCopyPaste: false,
      fontSizeText: 20,
      fontStyleText: 'inherit',
      fontWeightText: '100',
      textUnderline: false,
      imageProtractor: 'https://i.ibb.co/WPwJmjx/kisspng-equilateral-triangle-drawing-protractor-protractor-5a70771fd4e5d8-6174176115173199678721.png',
      imageTriangle: 'https://i.ibb.co/mJ7dRcd/pngegg.png',
      rememberText: '',
      backgroundColorText: '',
      fontFamilyType:'',
      isTextDirection:false,
      isErase:false
    }
  }

  _undo = () => {
    this._sketch.undo();
    this.setState({
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
    });
  };

  _redo = () => {
    this._sketch.redo();
    this.setState({
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
    });
  };

  _onBackgroundImageDrop = (accepted /*, rejected*/) => {
    if (accepted && accepted.length > 0) {
      let sketch = this._sketch;
      let reader = new FileReader();
      let { stretched, stretchedX, stretchedY, originX, originY } = this.state;
      reader.addEventListener(
          'load',
          () =>
              sketch.setBackgroundFromDataUrl(reader.result, {
                stretched: stretched,
                stretchedX: stretchedX,
                stretchedY: stretchedY,
                originX: originX,
                originY: originY,
              }),
          false,
      );
      reader.readAsDataURL(accepted[0]);
    }
  };

  _clear = () => {
    this._sketch.clear();
    this._sketch.setBackgroundFromDataUrl("");
    this.setState({
      controlledValue: null,
      backgroundColor: "transparent",
      fillWithBackgroundColor: false,
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
    });
  };

  _save = () => {
    let drawings = this.state.drawings;
    let Link = document.createElement("a");
    console.log(this._sketch.toDataURL());
    // drawings.push(this._sketch.toDataURL());
    // Link.setAttribute("href", this._sketch.toDataURL());
    // Link.setAttribute("download", 'abc.png');
    // Link.click()
    // drawings.push(this._sketch.toDataURL());
    // this.setState({drawings: drawings});
  };

  _eraser = () => {
    this._sketch._fc._objects[0].canvas.freeDrawingBrush._points = this._sketch._fc._objects[0].canvas.freeDrawingBrush._points.filter((path, key) => {
      return key == 0;
    })
    //
    // this._sketch._fc._objects[0].path = this._sketch._fc._objects[0].path.filter((path,key) => {
    //     return key == 0 ;
    // })
    // this._sketch._fc._objects[0].oCoords = this._sketch._fc._objects[0].oCoords.filter((path,key) => {
    //     return key == 'tr' ;
    // })

    // this._sketch._fc._objects = this._sketch._fc._objects.filter((path,key) => {
    //     return key == 0 ;
    // })
    console.log(this._sketch._fc._objects[0].canvas.freeDrawingBrush._points);
  };

  handleChangeTool = (tool) => {

    switch (tool) {
      case 'Pencil':
        tool = Tools.Pencil
        this.setState({isErase:false})
        break;
      case 'Erase':
        tool = Tools.Pencil
        this.setState({isErase:true})
        break;
      case 'Line':
        tool = Tools.Line
        break;
      case 'Rectangle':
        tool = Tools.Rectangle
        break;
      case 'Circle':
        tool = Tools.Circle
        break;
      case 'Rectangle':
        tool = Tools.Rectangle
        break;
      case 'Select':
        tool = Tools.Select
        break;
      case 'Pan':
        tool = Tools.Pan
        break;
      default:
        tool = Tools.Pencil
    }

    this.setState({tool: tool})
  }

  _removeSelected = () => {
    this._sketch.removeSelected();
  };

  _addText = () => {
    let backgroundColor = this.state.rememberText != 'transparent' ? this.state.rememberText : this.state.backgroundColorText
    let textContent = this.state.text;
    if (this.state.isTextDirection) {
      let textArr = this.state.text.toString().split('');
      textContent = textArr.join('\n');
    }
    let text = this._sketch.addText(textContent, {
      fill: this.state.lineColor,
      editable: true,
      fontSize: this.state.fontSizeText,
      fontWeight: this.state.fontWeightText,
      underline: this.state.textUnderline,
      backgroundColor: backgroundColor,
      fontFamily:this.state.fontFamilyType
    });
  };

  componentDidMount() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  };

  render() {
    const {
      tool,
      lineColor,
      lineWidth,
      backgroundColor,
      text,
      fontSizeText,
      fontWeightText,
      textUnderline,
      canUndo,
      canRedo,
      imageUrl,
      imagerProtractor,
      isTextDirection,
      isErase
    } = this.state
    return (
        <>
          <div className='d-flex w-100'>
            <div className='border'>
              <SketchField width='1024px'
                           height='768px'
                           tool={tool}
                           lineColor={lineColor}
                           lineWidth={lineWidth}
                           isErase={isErase}
                           ref={(c) => {
                             this._sketch = c;
                           }}
                  // onChange={(c) => {
                  //     console.log(this._sketch._fc._objects);
                  // }}
                           onContextMenu={(e)=> e.preventDefault()}

              />
            </div>
            <div>
              <div className="border-bottom">
                <div className='form-group'>
                  <label htmlFor="">Tool</label>
                  <select
                      className='form-control'
                      onChange={(e) => this.handleChangeTool(e.target.value)}
                  >
                    <option value="Pencil">Pencil</option>
                    <option value="Erase">Erase</option>
                    <option value="Line">Line</option>
                    <option value="Rectangle">Rectangle</option>
                    <option value="Circle">Circle</option>
                    <option value="Select">Select</option>
                    <option value="Pan">Pan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="">Line Width</label>
                  <select
                      className='form-control'
                      onChange={(e) => {
                        this.setState({lineWidth: e.target.value})
                      }}
                  >
                    <option value="5">Default</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="">Zoom</label>
                  <div>
                    <a href="#" onClick={(e) => this._sketch.zoom(1.25)}
                       className="btn btn-primary mr-2"><i className="fas fa-search-plus"></i></a>
                    <a href="#" onClick={(e) => this._sketch.zoom(0.8)} className="btn btn-primary"><i
                        className="fas fa-search-minus"></i></a>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="">Text</label>
                  <div className="d-flex ">
                    <input placeholder="Input text" className="form-control mr-2" value={text}
                           onChange={(e) => this.setState({text: e.target.value})} type="text"/>
                    <input placeholder="Font size" className="form-control mr-2" value={fontSizeText}
                           onChange={(e) => this.setState({fontSizeText: e.target.value})} type="text"/>

                  </div>
                  <div className="form-group">
                    <label htmlFor="">Font Style</label>
                    <select name="" id="" className="form-control" onChange={(e) => this.setState({fontFamilyType:e.target.value})}>
                      <option value="">Default</option>
                      <option value="arial">Arial</option>
                      <option value="auto">Auto</option>
                      <option value="cursive">Cursive</option>
                      <option value="sans-serif">Sans-serif</option>
                      <option value="monospace">Monospace</option>
                    </select>
                  </div>
                  <div>
                    <div className="form-check">
                      <input onChange={(e) => {
                        if (e.target.checked) {
                          this.setState({fontWeightText: 'bold'})
                        } else {
                          this.setState({fontWeightText: '100'})
                        }
                      }} className="form-check-input" type="checkbox" value=""
                             id="fontStyle1">
                      </input>
                      <label className="form-check-label" htmlFor="fontStyle1">
                        Blod
                      </label>
                    </div>
                    <div className="form-check">
                      <input onChange={(e) => {
                        if (e.target.checked) {
                          this.setState({textUnderline: true})
                        } else {
                          this.setState({textUnderline: false})
                        }
                      }} className="form-check-input" type="checkbox" value=""
                             id="underLine">
                      </input>
                      <label className="form-check-label" htmlFor="underLine">
                        Underline
                      </label>
                    </div>
                    <div className="form-check">
                      <input onChange={(e) => {
                        if (e.target.checked) {
                          this.setState({rememberText: '#85ff00'})
                        } else {
                          this.setState({rememberText: 'transparent'})
                        }
                      }} className="form-check-input" type="checkbox" value=""
                             id="RememberText">
                      </input>
                      <label className="form-check-label" htmlFor="RememberText">
                        Remember Text
                      </label>
                    </div>
                    <div className="form-check">
                      <input onChange={(e) => {
                        if (e.target.checked) {
                          this.setState({isTextDirection: true})
                        } else {
                          this.setState({isTextDirection: false})
                        }
                      }} className="form-check-input" type="checkbox" value=""
                             id="TextDirection">
                      </input>
                      <label className="form-check-label" htmlFor="TextDirection">
                        Text Direction
                      </label>
                    </div>
                  </div>

                  <a href="#" onClick={(e) => this._addText()} className="btn btn-primary">+</a>
                </div>
              </div>

              <div className="border-bottom mt-3">
                <label htmlFor="">Color Text & Line</label>
                <input type="color" id="favcolor"
                       className="form-control"
                       onChange={(e) => this.setState({lineColor: e.target.value})}
                >
                </input>
                <label htmlFor="">Background Color Text</label>
                <input type="color" id="favColorBackground"
                       className="form-control"
                       onChange={(e) => this.setState({backgroundColorText: e.target.value})}
                />

              </div>


              <div className='d-flex mt-3'>
                <a href="#" className="btn btn-default btn-outline-dark d-block mr-3" onClick={(e) => {
                  this._undo();
                }}><i className="fas fa-undo"></i></a>

                <a href="#" className="btn btn-default btn-outline-dark d-block mr-3" onClick={(e) => {
                  this._redo();
                }}><i className="fas fa-redo"></i></a>

                <a href="#" className="btn btn-default btn-outline-dark d-block mr-3"
                   disabled={!this.state.enableCopyPaste} onClick={(e) => {
                  this._sketch.copy();
                }}><i className="fas fa-copy"></i></a>

                <a href="#" className="btn btn-default btn-outline-dark d-block mr-3"
                   disabled={!this.state.enableCopyPaste} onClick={(e) => {
                  this._sketch.paste();
                }}><i className="fas fa-paste"></i></a>

                <a href="#" className="btn btn-default btn-outline-dark d-block mr-3" onClick={(e) => {
                  this._removeSelected();
                }}>Delete</a>

                <a href="#" className="btn btn-default btn-outline-dark d-block mr-3" onClick={(e) => {
                  this._clear();
                }}>Clear</a>

                <a href="#" className="btn btn-default btn-outline-dark d-block mr-3" onClick={(e) => {
                  this._save();
                }}>Save</a>

              </div>
              <div className="form-group mt-3">
                <input type="text" className="form-control" placeholder="Enter Url"
                       onChange={(e) => this.setState({imageUrl: e.target.value})} value={imageUrl}/>
                <a href="#" className="btn btn-primary mt-2"
                   onClick={(e) => this._sketch.addImg(this.state.imageUrl)}>>Load Image from URL</a>
              </div>
              <div className="border-top">
                <label htmlFor="">Tool digital</label>
                <div>
                  <a href="#" className="btn btn-primary mt-2"
                     onClick={(e) => this._sketch.addImg(this.state.imageProtractor)}>Get
                    Protractor</a>
                  <a href="#" className="btn btn-primary mt-2"
                     onClick={(e) => this._sketch.addImg(this.state.imageTriangle)}>Get Triangle</a>
                </div>
              </div>
              <div>
                <DropZone
                    accept='image/*'
                    multiple={false}
                    style={styles.dropArea}
                    activeStyle={styles.activeStyle}
                    rejectStyle={styles.rejectStyle}
                    onDrop={this._onBackgroundImageDrop}>
                  Try dropping an image here,<br/>
                  or click<br/>
                  to select image as background.
                </DropZone>
              </div>
              <a href="#" onClick={(e) => this._eraser()}>sss</a>
            </div>
          </div>
        </>
    )
  }
}

export default SketchFieldDemo;
