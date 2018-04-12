# WIP - Does not work properly, yet.
Use at your own caution.

# React Camera

A flexible camera component for React DOM; take photos using the latest WebRTC API's.

## Installation

React Camera is designed to be installed through NPM and imported as an ES6 module.

```
npm install react-dom-camera
```

Then import it into your project.

```javascript
import Camera from 'react-dom-camera';
```

## Usage

Here is a basic example of how to use React Camera in a React app. This will render the Camera component "out of the box".

```javascript
import React from 'react';
import Camera from 'react-dom-camera';

const App = () => <Camera />;
```

### Taking a photo 📸

React Camera is setup to take an image of the current frame when the capture button is clicked, however, to access the image you must use the `onTakePhoto` prop which passes you the image. The `image` can be set as the `src` value on an `<img>` element for example.

```javascript
import React from 'react';
import Camera from 'react-dom-camera';

const App = () => (
  <Camera
    onTakePhoto={image =>
      console.log(image, 'do whatever you want with the image')
    }
  />
);
```

### Custom capture button

If you're not a fan of the default capture button you can easily use your own component(s) instead. Use the `captureButtonRenderer` prop and pass in a stateless component.

```javascript
import React from 'react';
import Camera from 'react-dom-camera';

const CoolButton = ({ onClick }) => (
  <button onClick={onClick} type="button">
    Take photo
  </button>
);

const App = () => (
  <Camera
    captureButtonRenderer={onClick => <CoolButton onClick={onClick} />}
    onTakePhoto={image =>
      console.log(image, 'do whatever you want with the image')
    }
  />
);
```

## Props

| Property              | Type     | Default     | Description                                                                                                     |
| --------------------- | -------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| captureButtonRenderer | function | undefined   | Renders a custom capture button that is used to take the photo.                                                 |
| facingMode            | string   | ENVIRONMENT | The default facing mode to use, E.g. Environment or User.                                                       |
| height                | number   | undefined   | The ideal height of the video.                                                                                  |
| onStopMediaStream     | function | undefined   | This function is called when the video stops streaming.                                                         |
| onTakePhoto           | function | undefined   | This function is called when the capture button is pressed. The captured `image` is passed as an argument here. |
| responsive            | boolean  | true        | Applies `width: 100%` to the `video` element so it fills the container it's in.                                 |
| width                 | number   | undefined   | The ideal width of the video.                                                                                   |

## Browser support

[🔗 caniuse.com](https://caniuse.com/#feat=stream)
