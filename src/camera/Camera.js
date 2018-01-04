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
import { buildConstraints, getAvailableDevices } from './cameraUtils';

if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {
    // First get ahold of the legacy getUserMedia, if present
    var getUserMedia =
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(
        new Error('getUserMedia is not implemented in this browser'),
      );
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  };
}

class Camera extends PureComponent {
  constructor(props) {
    super(props);
    const { facingMode, height, width } = this.props;
    const constraints = buildConstraints(facingMode, height, width);
    const supportsIntersectionObserver = window.IntersectionObserver;

    this.state = {
      constraints,
      devices: null,
      error: false,
      isIntersecting: false,
      mediaStream: null,
    };
    this.changeFacingMode = this.changeFacingMode.bind(this);

    if (supportsIntersectionObserver) {
      this.io = new IntersectionObserver(this.handleIntersectionObserver);
    }
  }

  async componentWillMount() {
    const devices = await getAvailableDevices('video');
    if (devices) {
      this.setState({
        devices,
      });
    }
  }

  async componentDidMount() {
    const supportsIntersectionObserver = window.IntersectionObserver;
    await this.getMediaStream(this.state.constraints);
    if (!supportsIntersectionObserver) this.setVideoStream();
    window.addEventListener('resize', this.handleResize);

    if (supportsIntersectionObserver) {
      this.io.observe(this.video);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const { isIntersecting } = this.state;
    if (isIntersecting !== prevState.isIntersecting) {
      if (isIntersecting) {
        const { facingMode, height, width } = this.state.constraints.video;
        const constraints = buildConstraints(facingMode, height, width);
        await this.getMediaStream(constraints);
        return this.setVideoStream();
      } else {
        return this.stopMediaStream();
      }
    }
  }

  componentWillUnmount() {
    this.stopMediaStream();
    this.io.disconnect();
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
    const { height, width } = this.state.constraints.video;
    const constraints = buildConstraints(facingMode, height, width);
    await this.getMediaStream(constraints);
    this.setVideoStream();
  }

  async getMediaStream(constraints = {}) {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints,
      );
      this.setState({ mediaStream });
    } catch (error) {
      console.log(error);
      this.setState({ error: errorTypes.UNSUPPORTED.type });
    }
  }

  handleIntersectionObserver = ([entry]) => {
    if (entry) {
      return this.setState({ isIntersecting: entry.isIntersecting });
    }
  };

  handleResize = debounce(150, async () => {
    const { facingMode, height, width } = this.state.constraints.video;
    await this.getMediaStream(buildConstraints(facingMode, height, width));
    this.setVideoStream();
  });

  async takePhoto(imageCapture) {
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
