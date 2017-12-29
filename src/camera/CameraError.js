import React from 'react';
import { errorTypes } from './errorTypes';

const wrapperStyles = {
  padding: '30px 15px',
};

const textStyles = {
  fontSize: '16px',
  margin: 0,
  textAlign: 'center',
};

const CameraError = ({ errorType = '' }) => (
  <div style={wrapperStyles}>
    <p style={textStyles}>
      {errorTypes[errorType].details || 'Oops, something broke.'}
    </p>
  </div>
);

export default CameraError;
