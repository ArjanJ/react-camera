'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _possibleConstructorReturn = _interopDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));
var _getPrototypeOf = _interopDefault(require('@babel/runtime/helpers/getPrototypeOf'));
var _assertThisInitialized = _interopDefault(require('@babel/runtime/helpers/assertThisInitialized'));
var _inherits = _interopDefault(require('@babel/runtime/helpers/inherits'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));
var debounce = _interopDefault(require('throttle-debounce/debounce'));

if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
} // Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.


if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function (constraints) {
    // First get ahold of the legacy getUserMedia, if present
    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia; // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface

    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    } // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise


    return new Promise(function (resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  };
}

var errorTypes = {
  INVALID_FACING_MODE: {
    details: 'Facing mode not recognized',
    type: 'INVALID_FACING_MODE'
  },
  NO_STREAM: {
    details: 'Your browser does not support this feature',
    type: 'NO_STREAM'
  },
  TAKE_PHOTO_FAILURE: {
    details: 'Could not take a photo',
    type: 'TAKE_PHOTO_FAILURE'
  },
  UNSUPPORTED: {
    details: 'Your browser does not support this feature',
    type: 'UNSUPPORTED'
  }
};

var wrapperStyles = {
  padding: '30px 15px'
};
var textStyles = {
  fontSize: '16px',
  margin: 0,
  textAlign: 'center'
};

var CameraError = function CameraError(_ref) {
  var _ref$errorType = _ref.errorType,
      errorType = _ref$errorType === void 0 ? '' : _ref$errorType;
  return React__default.createElement("div", {
    style: wrapperStyles
  }, React__default.createElement("p", {
    style: textStyles
  }, errorTypes[errorType].details || 'Oops, something broke.'));
};

var captureButtonStyle = {
  background: 'white',
  border: '6px solid white',
  borderRadius: '50%',
  boxShadow: '0 2px 7px rgba(0, 0, 0, 0.25), inset 0 0 0 2px rgba(0, 0, 0, 0.75)',
  cursor: 'pointer',
  height: '60px',
  width: '60px'
};

var CaptureButton = function CaptureButton(_ref) {
  var onCapture = _ref.onCapture;
  return React__default.createElement("button", {
    onClick: onCapture,
    style: captureButtonStyle,
    title: "Take photo",
    type: "button"
  });
};

CaptureButton.propTypes = {
  onCapture: PropTypes.func.isRequired
};

var wrapperStyle = {
  position: 'relative'
};

var CameraWrapper = function CameraWrapper(_ref) {
  var children = _ref.children;
  return React__default.createElement("div", {
    style: wrapperStyle
  }, children);
};

var cameraControlsStyle = {
  alignItems: 'center',
  bottom: '30px',
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
  padding: '0 30px',
  position: 'absolute',
  width: '100%'
};

var CameraControls = function CameraControls(_ref) {
  var children = _ref.children;
  return React__default.createElement("div", {
    style: cameraControlsStyle
  }, children);
};

var facingModes = {
  ENVIRONMENT: 'ENVIRONMENT',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  USER: 'USER'
};

var SwitchIcon = function SwitchIcon() {
  return React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    x: "0px",
    y: "0px",
    width: "24px",
    height: "24px",
    viewBox: "0 0 24 24",
    strokeWidth: "2"
  }, React__default.createElement("g", {
    strokeWidth: "2",
    transform: "translate(0, 0)"
  }, React__default.createElement("polygon", {
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "square",
    strokeMiterlimit: "10",
    points: "1,22 23,22 23,5 19,5 17,2 11,2 9,5 1,5 ",
    strokeLinejoin: "miter"
  }), ' ', React__default.createElement("circle", {
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "square",
    strokeMiterlimit: "10",
    cx: "14",
    cy: "13",
    r: "5",
    strokeLinejoin: "miter"
  }), ' ', React__default.createElement("circle", {
    fill: "#fff",
    cx: "5",
    cy: "9",
    r: "1",
    strokeLinejoin: "miter",
    strokeLinecap: "square"
  })));
};

var switchButtonStyle = {
  alignItems: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  height: '40px',
  justifyContent: 'center',
  position: 'absolute',
  right: '5vw',
  top: '5vh',
  width: '40px'
};

var SwitchModeButton = function SwitchModeButton(_ref) {
  var _ref$currentFacingMod = _ref.currentFacingMode,
      currentFacingMode = _ref$currentFacingMod === void 0 ? '' : _ref$currentFacingMod,
      onSwitch = _ref.onSwitch;
  return React__default.createElement("button", {
    onClick: function onClick() {
      return onSwitch(currentFacingMode === facingModes.ENVIRONMENT ? facingModes.USER : facingModes.ENVIRONMENT);
    },
    style: switchButtonStyle,
    type: "button"
  }, React__default.createElement(SwitchIcon, null));
};

SwitchModeButton.propTypes = {
  currentFacingMode: PropTypes.string.isRequired,
  onSwitch: PropTypes.func.isRequired
};

/**
 * getAvailableDevices
 * Returns a list of available hardware audio and or video devices.
 *
 * @param {string} type Either 'video' or 'audio'. If not specified, all
 * devices will be returned.
 */
var getAvailableDevices =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee() {
    var type,
        devices,
        _args = arguments;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            type = _args.length > 0 && _args[0] !== undefined ? _args[0] : '';
            _context.next = 3;
            return navigator.mediaDevices.enumerateDevices();

          case 3:
            devices = _context.sent;

            if (!(devices.length > 0)) {
              _context.next = 11;
              break;
            }

            if (type) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", devices);

          case 7:
            if (!(type === 'video')) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return", devices.filter(function (d) {
              return d.kind === 'videoinput';
            }));

          case 9:
            if (!(type === 'audio')) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", devices.filter(function (d) {
              return d.kind === 'audioinput';
            }));

          case 11:
            return _context.abrupt("return", null);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getAvailableDevices() {
    return _ref.apply(this, arguments);
  };
}();
var buildConstraints = function buildConstraints(facingMode, height, width) {
  var constraints = {
    video: {}
  };
  if (facingMode) constraints.video.facingMode = facingMode.toLowerCase();
  if (height) constraints.video.height = {
    ideal: height
  };
  if (width) constraints.video.width = {
    ideal: width
  };
  return constraints;
};

var Camera =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(Camera, _PureComponent);

  function Camera(props) {
    var _this;

    _classCallCheck(this, Camera);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Camera).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "captureMediaStream", function (event, mediaStream) {
      var ms = mediaStream || _this.state.mediaStream;
      if (!ms) _this.setState({
        error: errorTypes.NO_STREAM.type
      });
      var mediaStreamTrack = ms.getVideoTracks()[0];
      var imageCapture = new window.ImageCapture(mediaStreamTrack);

      if (imageCapture) {
        _this.takePhoto(imageCapture);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "changeFacingMode",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee() {
      var facingMode,
          _this$state$constrain,
          height,
          width,
          constraints,
          _args = arguments;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              facingMode = _args.length > 0 && _args[0] !== undefined ? _args[0] : '';

              if (facingModes[facingMode]) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", _this.setState({
                error: errorTypes.INVALID_FACING_MODE.type
              }));

            case 3:
              _this.stopMediaStream();

              _this$state$constrain = _this.state.constraints.video, height = _this$state$constrain.height, width = _this$state$constrain.width;
              constraints = buildConstraints(facingMode, height, width);
              _context.next = 8;
              return _this.getMediaStream(constraints);

            case 8:
              _this.setVideoStream();

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));

    _defineProperty(_assertThisInitialized(_this), "handleResize", debounce(150,
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee2() {
      var _this$state$constrain2, facingMode, height, width;

      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _this$state$constrain2 = _this.state.constraints.video, facingMode = _this$state$constrain2.facingMode, height = _this$state$constrain2.height, width = _this$state$constrain2.width;
              _context2.next = 3;
              return _this.getMediaStream(buildConstraints(facingMode, height, width));

            case 3:
              _this.setVideoStream();

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))));

    var _this$props = _this.props,
        _facingMode = _this$props.facingMode,
        _height = _this$props.height,
        _width = _this$props.width;

    var _constraints = buildConstraints(_facingMode, _height, _width);

    _this.state = {
      constraints: _constraints,
      devices: null,
      error: false,
      isIntersecting: false,
      mediaStream: null
    };
    return _this;
  }

  _createClass(Camera, [{
    key: "componentWillMount",
    value: function () {
      var _componentWillMount = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3() {
        var devices;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return getAvailableDevices('video');

              case 2:
                devices = _context3.sent;

                if (devices) {
                  this.setState({
                    devices: devices
                  });
                }

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function componentWillMount() {
        return _componentWillMount.apply(this, arguments);
      }

      return componentWillMount;
    }()
  }, {
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee4() {
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.getMediaStream(this.state.constraints);

              case 2:
                this.setVideoStream();
                window.addEventListener('resize', this.handleResize);

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.stopMediaStream();
      window.removeEventListener('resize', this.handleResize);
    }
  }, {
    key: "getMediaStream",
    value: function () {
      var _getMediaStream = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee5() {
        var constraints,
            mediaStream,
            _args5 = arguments;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                constraints = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : {};
                _context5.prev = 1;
                _context5.next = 4;
                return navigator.mediaDevices.getUserMedia(constraints);

              case 4:
                mediaStream = _context5.sent;
                this.setState({
                  mediaStream: mediaStream
                });
                _context5.next = 12;
                break;

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](1);
                console.log(_context5.t0);
                this.setState({
                  error: errorTypes.UNSUPPORTED.type
                });

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[1, 8]]);
      }));

      function getMediaStream() {
        return _getMediaStream.apply(this, arguments);
      }

      return getMediaStream;
    }()
  }, {
    key: "takePhoto",
    value: function () {
      var _takePhoto = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee6(imageCapture) {
        var onTakePhoto, blob, capturedImg;
        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                onTakePhoto = this.props.onTakePhoto;
                _context6.next = 4;
                return imageCapture.takePhoto();

              case 4:
                blob = _context6.sent;
                capturedImg = URL.createObjectURL(blob);

                if (onTakePhoto) {
                  onTakePhoto(capturedImg);
                }

                _context6.next = 12;
                break;

              case 9:
                _context6.prev = 9;
                _context6.t0 = _context6["catch"](0);
                this.setState({
                  error: errorTypes.TAKE_PHOTO_FAILURE.type
                });

              case 12:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 9]]);
      }));

      function takePhoto(_x) {
        return _takePhoto.apply(this, arguments);
      }

      return takePhoto;
    }()
  }, {
    key: "setVideoStream",
    value: function setVideoStream() {
      var _this2 = this;

      var mediaStream = this.state.mediaStream;

      if (this.video) {
        this.video.srcObject = mediaStream;

        this.video.onloadedmetadata = function () {
          return _this2.video.play();
        };
      }
    }
  }, {
    key: "stopMediaStream",
    value: function stopMediaStream() {
      if (this.video && this.video.srcObject) {
        var onStopMediaStream = this.props.onStopMediaStream;
        this.video.srcObject.getTracks().forEach(function (t) {
          return t.stop();
        });

        if (onStopMediaStream) {
          onStopMediaStream();
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props2 = this.props,
          captureButtonRenderer = _this$props2.captureButtonRenderer,
          responsive = _this$props2.responsive;
      var _this$state = this.state,
          _this$state$constrain3 = _this$state.constraints,
          constraints = _this$state$constrain3 === void 0 ? {} : _this$state$constrain3,
          devices = _this$state.devices,
          error = _this$state.error;
      var multipleDevices = devices && devices.length > 1;
      var facingMode = constraints.video.facingMode;

      if (error) {
        return React__default.createElement(CameraError, {
          errorType: error
        });
      }

      return React__default.createElement(CameraWrapper, null, React__default.createElement("video", {
        autoPlay: true,
        playsInline: true,
        ref: function ref(video) {
          return _this3.video = video;
        },
        style: responsive ? {
          background: 'black',
          display: 'block',
          width: '100%'
        } : {
          background: 'black',
          display: 'block'
        }
      }), React__default.createElement(CameraControls, null, captureButtonRenderer ? captureButtonRenderer(this.captureMediaStream) : React__default.createElement(CaptureButton, {
        onCapture: this.captureMediaStream
      })), multipleDevices && React__default.createElement(SwitchModeButton, {
        currentFacingMode: facingMode,
        onSwitch: this.changeFacingMode
      }));
    }
  }]);

  return Camera;
}(React.PureComponent);

Camera.defaultProps = {
  facingMode: facingModes.ENVIRONMENT,
  responsive: true
};
Camera.propTypes = {
  captureButtonRenderer: PropTypes.func,
  facingMode: PropTypes.string,
  height: PropTypes.number,
  onStopMediaStream: PropTypes.func,
  onTakePhoto: PropTypes.func,
  responsive: PropTypes.bool,
  width: PropTypes.number
};

module.exports = Camera;
