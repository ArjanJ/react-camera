import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'throttle-debounce/debounce';
import CameraError from './CameraError';
import CaptureButton from './CaptureButton';
import CameraWrapper from './CameraWrapper';
import CameraControls from './CameraControls';
import SwitchModeButton from './SwitchModeButton';
import { errorTypes } from './errorTypes';
import { facingModes } from './facingModeTypes';

const buildConstraints = (facingMode, height, width) => {
  const constraints = { video: {} };
  if (facingMode) constraints.video.facingMode = facingMode.toLowerCase();
  if (height) constraints.video.height = height;
  if (width) constraints.video.width = width;
  return constraints;
};

class Camera extends PureComponent {
  constructor(props) {
    super(props);
    const { facingMode, height, width } = this.props;
    const constraints = buildConstraints(facingMode, height, width);
    this.state = {
      constraints,
      devices: null,
      error: false,
      mediaStream: null,
    };
    this.changeFacingMode = this.changeFacingMode.bind(this);
  }

  async componentDidMount() {
    await this.getMediaStream(this.state.constraints);
    this.setVideoStream();
    this.getAvailableDevices();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    this.stopMediaStream();
    window.removeEventListener('resize', this.handleResize);
  }

  captureMediaStream = (event, mediaStream) => {
    const ms = mediaStream || this.state.mediaStream;
    if (!ms) this.setState({ error: errorTypes.NO_STREAM.type });
    const mediaStreamTrack = ms.getVideoTracks()[0];
    const imageCapture = new window.ImageCapture(mediaStreamTrack);
    if (imageCapture) {
      this.takePhoto(imageCapture);
    }
  };

  async changeFacingMode(facingMode = '') {
    if (!facingModes[facingMode]) {
      return this.setState({ error: errorTypes.INVALID_FACING_MODE.type });
    }
    this.stopMediaStream();
    const newConstraints = Object.assign({}, this.state.constraints, {
      video: {
        facingMode: facingModes[facingMode].toLowerCase(),
        height: this.state.constraints.video.height,
        width: this.state.constraints.video.width,
      },
    });
    await this.getMediaStream(newConstraints);
    this.setVideoStream();
  }

  async getAvailableDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    if (devices.length > 0) {
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      if (videoDevices.length > 0) {
        this.setState({ devices: videoDevices });
      }
    }
  }

  async getMediaStream(constraints = {}) {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints,
      );
      this.setState({ mediaStream });
    } catch (error) {
      this.setState({ error: errorTypes.UNSUPPORTED.type });
    }
  }

  handleResize = debounce(150, async () => {
    const { facingMode, height, width } = this.state.constraints.video;
    await this.getMediaStream(buildConstraints(facingMode, height, width));
    this.setVideoStream();
  });

  async takePhoto(imageCapture) {
    if (!imageCapture) {
      this.setState({ error: errorTypes.TAKE_PHOTO_FAILURE.type });
    }
    try {
      const { onTakePhoto } = this.props;
      const blob = await imageCapture.takePhoto();
      const capturedImg = URL.createObjectURL(blob);
      if (onTakePhoto) onTakePhoto(capturedImg);
    } catch (e) {
      this.setState({ error: errorTypes.TAKE_PHOTO_FAILURE.type });
    }
  }

  setVideoStream() {
    const { mediaStream } = this.state;
    if (this.video) {
      this.video.srcObject = mediaStream;
      this.video.onloadedmetadata = () => this.video.play();
    }
  }

  stopMediaStream() {
    if (this.video && this.video.srcObject) {
      const { onStopMediaStream } = this.props;
      this.video.srcObject.getTracks().forEach(t => t.stop());
      if (onStopMediaStream) {
        onStopMediaStream();
      }
    }
  }

  render() {
    const { captureButtonRenderer, responsive } = this.props;
    const { constraints = {}, devices, error } = this.state;
    const multipleDevices = devices && devices.length > 1;
    const { video: { facingMode } } = constraints;
    return error ? (
      <CameraError errorType={error} />
    ) : (
      <CameraWrapper>
        <video
          autoPlay
          playsInline
          ref={video => (this.video = video)}
          style={
            responsive
              ? { background: 'black', display: 'block', width: '100%' }
              : { background: 'black', display: 'block' }
          }
        />
        <CameraControls>
          {captureButtonRenderer ? (
            captureButtonRenderer(this.captureMediaStream)
          ) : (
            <CaptureButton onCapture={this.captureMediaStream} />
          )}
        </CameraControls>
        {multipleDevices && (
          <SwitchModeButton
            currentFacingMode={facingMode}
            onSwitch={this.changeFacingMode}
          />
        )}
      </CameraWrapper>
    );
  }
}

Camera.defaultProps = {
  facingMode: facingModes.ENVIRONMENT,
  responsive: true,
  width: window.innerWidth,
};

Camera.propTypes = {
  captureButtonRenderer: PropTypes.func,
  facingMode: PropTypes.string,
  height: PropTypes.number,
  onStopMediaStream: PropTypes.func,
  onTakePhoto: PropTypes.func,
  responsive: PropTypes.bool,
  width: PropTypes.number,
};

export default Camera;
