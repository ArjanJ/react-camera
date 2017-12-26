import React from 'react';
import PropTypes from 'prop-types';

const captureButtonStyle = {
  border: '6px solid white',
  borderRadius: '50%',
  boxShadow:
    '0 2px 7px rgba(0, 0, 0, 0.25), inset 0 0 0 2px rgba(0, 0, 0, 0.75)',
  cursor: 'pointer',
  height: '70px',
  width: '70px',
};

const CaptureButton = ({ onCapture }) => (
  <button
    onClick={onCapture}
    style={captureButtonStyle}
    title="capture"
    type="button"
  />
);

CaptureButton.propTypes = {
  onCapture: PropTypes.func.isRequired,
};

export default CaptureButton;
