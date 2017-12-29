import React from 'react';

const cameraControlsStyle = {
  alignItems: 'center',
  bottom: '30px',
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
  padding: '0 30px',
  position: 'absolute',
  width: '100%',
};

const CameraControls = ({ children }) => (
  <div style={cameraControlsStyle}>{children}</div>
);

export default CameraControls;
