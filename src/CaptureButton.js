import React from 'react';

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

export default CaptureButton;
