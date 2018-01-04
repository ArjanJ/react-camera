/**
 * getAvailableDevices
 * Returns a list of available hardware audio and or video devices.
 *
 * @param {string} type Either 'video' or 'audio'. If not specified, all
 * devices will be returned.
 */
export const getAvailableDevices = async (type = '') => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  if (devices.length > 0) {
    if (!type) return devices;
    if (type === 'video') {
      return devices.filter(d => d.kind === 'videoinput');
    }
    if (type === 'audio') {
      return devices.filter(d => d.kind === 'audioinput');
    }
  }
  return null;
};

export const buildConstraints = (facingMode, height, width) => {
  const constraints = { video: {} };
  if (facingMode) constraints.video.facingMode = facingMode.toLowerCase();
  if (height) constraints.video.height = { ideal: height };
  if (width) constraints.video.width = { ideal: width };
  return constraints;
};
