import React from 'react';
import styled, { injectGlobal, keyframes } from 'styled-components';
import Camera from '../camera/Camera';

injectGlobal`
  * {
    box-sizing: border-box;
  }

  body {
    background: #9870FC;
    font-family: 'adelle-sans';
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3 {
    line-height: 1.1;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.87); }
  to { opacity: 1; transform: none; }
`;

const settings = {
  colors: {
    headings: '#DFFCB5',
    highlight: '#B7F5DE',
    text: '#FAFAFA',
  },
  space: 24,
};

const Wrapper = styled.div`
  margin: auto;
  max-width: 800px;
  padding: ${settings.space * 2}px ${settings.space / 2}px;
`;

const Title = styled.h1`
  color: ${settings.colors.headings};
  font-size: 43px;
  font-weight: 700;
  margin-bottom: ${settings.space / 3}px;
  text-transform: lowercase;
`;

const Subtitle = styled.h2`
  color: ${settings.colors.text};
  font-size: 16px;
`;

const Header = styled.header`
  margin-bottom: ${settings.space * 3}px;
  text-align: center;
`;

const CameraWrapper = styled.div`
  border-radius: 2px;
  box-shadow: 0 5px 22px rgba(0, 0, 0, 0.35);
  margin-bottom: ${settings.space * 1.5}px;
  overflow: hidden;
`;

const Images = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
`;

const Image = styled.img`
  animation: ${fadeIn} 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  height: auto;
  margin-bottom: ${settings.space / 3}px;
  margin-right: ${settings.space / 3}px;
  width: calc(33.333% - ${settings.space / 4}px);

  &:nth-child(3n) {
    margin-right: 0;
  }
`;

class Docs extends React.PureComponent {
  state = {
    images: [],
  };

  handleTakePhoto = img => {
    this.setState({
      images: [...this.state.images, img],
    });
  };

  render() {
    return (
      <Wrapper>
        <Header>
          <Title>React Camera</Title>
          <Subtitle>Take photos with your device camera</Subtitle>
        </Header>
        <section>
          <CameraWrapper>
            <Camera onTakePhoto={this.handleTakePhoto} />
          </CameraWrapper>
          <Images>
            {this.state.images.map(img => <Image key={img} src={img} />)}
          </Images>
        </section>
      </Wrapper>
    );
  }
}

export default Docs;
