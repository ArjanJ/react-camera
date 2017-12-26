import React from 'react';
import PropTypes from 'prop-types';
import { facingModes } from './facingModeTypes';

const SwitchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <g strokeWidth="2" transform="translate(0, 0)">
      <path
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeMiterlimit="10"
        d="M2.2,10C3.127,5.435,7.162,2,12,2 c2.726,0,5.198,1.091,7.002,2.86"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />{' '}
      <polygon
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="square"
        strokeMiterlimit="10"
        points="16,7 21,2 22,8 "
        strokeLinejoin="miter"
      />{' '}
      <polygon
        fill="#ffffff"
        points="16,7 21,2 22,8 "
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />{' '}
      <path
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeMiterlimit="10"
        d="M21.8,14c-0.927,4.564-4.962,8-9.8,8 c-2.726,0-5.198-1.091-7.002-2.86"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />{' '}
      <polygon
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="square"
        strokeMiterlimit="10"
        points="8,17 3,22 2,16 "
        strokeLinejoin="miter"
      />{' '}
      <polygon
        fill="#ffffff"
        points="8,17 3,22 2,16 "
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />{' '}
    </g>
  </svg>
);

const switchButtonStyle = {
  alignItems: 'center',
  background: 'none',
  border: '2px solid white',
  borderRadius: '50%',
  cursor: 'pointer',
  display: 'flex',
  height: '40px',
  justifyContent: 'center',
  width: '40px',
};

const SwitchModeButton = ({ currentFacingMode = '', onSwitch }) => (
  <button
    onClick={() =>
      onSwitch(
        currentFacingMode === facingModes.ENVIRONMENT
          ? facingModes.USER
          : facingModes.ENVIRONMENT,
      )}
    style={switchButtonStyle}
    type="button"
  >
    <SwitchIcon />
  </button>
);

SwitchModeButton.propTypes = {
  currentFacingMode: PropTypes.string.isRequired,
  onSwitch: PropTypes.func.isRequired,
};

export default SwitchModeButton;
