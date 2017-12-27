import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CameraError from './CameraError';
import CaptureButton from './CaptureButton';
import CameraWrapper from './CameraWrapper';
import CameraControls from './CameraControls';
import SwitchModeButton from './SwitchModeButton';
import { errorTypes } from './errorTypes';
import { facingModes } from './facingModeTypes';

class Camera extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      constraints: {
        video: {
          facingMode: this.props.facingMode,
          height: { ideal: this.props.height },
          width: { ideal: this.props.width },
        },
      },
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
  }

  componentWillUnmount() {
    return this.stopMediaStream();
  }

  captureMediaStream = (event, mediaStream) => {
    const ms = mediaStream || this.state.mediaStream;
    if (!ms) this.setState({ error: errorTypes.NO_STREAM.type });
    const mediaStreamTrack = ms.getVideoTracks()[0];
    const imageCapture = new ImageCapture(mediaStreamTrack);
    if (imageCapture) this.takePhoto(imageCapture);
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
    if (this.video) {
      const { onStopMediaStream } = this.props;
      this.video.srcObject.getTracks().forEach(t => t.stop());
      if (onStopMediaStream) {
        onStopMediaStream();
      }
    }
  }

  render() {
    const { constraints = {}, devices, error } = this.state;
    const multipleDevices = devices && devices.length > 1;
    const { video: { facingMode } } = constraints;
    return error ? (
      <CameraError errorType={error} />
    ) : (
      <CameraWrapper>
        <video autoPlay playsInline ref={video => (this.video = video)} />
        <CameraControls>
          {multipleDevices && (
            <SwitchModeButton
              currentFacingMode={facingMode}
              onSwitch={this.changeFacingMode}
            />
          )}
          <CaptureButton onCapture={this.captureMediaStream} />
          {multipleDevices && (
            <SwitchModeButton
              currentFacingMode={facingMode}
              onSwitch={this.changeFacingMode}
            />
          )}
        </CameraControls>
      </CameraWrapper>
    );
  }
}

Camera.defaultProps = {
  facingMode: facingModes.ENVIRONMENT,
  height: window.innerHeight,
  width: window.innerWidth,
};

Camera.propTypes = {
  facingMode: PropTypes.string,
  height: PropTypes.number,
  onStopMediaStream: PropTypes.func,
  onTakePhoto: PropTypes.func,
  width: PropTypes.number,
};

export default Camera;
