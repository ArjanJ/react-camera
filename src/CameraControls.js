import React from 'react';

const cameraControlsStyle = {
  alignItems: 'center',
  bottom: '10vh',
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'space-evenly',
  padding: '0 5vw',
  position: 'absolute',
  width: '100%',
};

const CameraControls = ({ children }) => (
  <div style={cameraControlsStyle}>{children}</div>
);

export default CameraControls;
