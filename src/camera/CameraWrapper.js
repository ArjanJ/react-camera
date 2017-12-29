import React from 'react';

const wrapperStyle = {
  position: 'relative',
};

const CameraWrapper = ({ children }) => (
  <div style={wrapperStyle}>{children}</div>
);

export default CameraWrapper;
