import React from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import Camera from "../camera/Camera";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    background: #7A08FA;
    color: #FAFAFA;
    font-family: SF Pro Text, Arial, sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3 {
    font-family: SF Pro Display, Arial, sans-serif;
    line-height: 1.1;
  }

  a {
    text-decoration: none;
  }

  p {
    margin: 0;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.87); }
  to { opacity: 1; transform: none; }
`;

const upDown = keyframes`
  0% { transform: translateY(-8px); }
  50% { transform: translateY(8px); }
  100% { transform: translateY(-8px); }
`;

const settings = {
  colors: {
    headings: "#7A08FA",
    text: "#A82FFC"
  },
  space: 24
};

const Wrapper = styled.div`
  margin: auto;
  max-width: 800px;
  padding: 0 ${settings.space / 1.5}px;
`;

const Title = styled.h1`
  color: #342d3b;
  font-size: 40px;
  font-weight: 700;
  margin-bottom: ${settings.space / 2}px;
`;

const Subtitle = styled.h2`
  color: ${settings.colors.headings};
  font-size: 20px;
  margin-bottom: ${settings.space * 1.75}px;
`;

const Header = styled.header`
  background: #fafafa;
  border-bottom: 1px solid ${settings.colors.headings};
  margin-bottom: ${settings.space * 3}px;
  padding: ${settings.space * 2}px 0;
`;

const Heading = styled.h2`
  color: #fafafa;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: ${settings.space / 3}px;
`;

const HeadingGroup = styled.div`
  margin-bottom: ${settings.space}px;

  a {
    color: white;
  }
`;

const CameraWrapper = styled.div`
  border: 1px solid #fafafa;
  border-radius: 2px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  margin-bottom: ${settings.space * 1.5}px;
  position: relative;
`;

const Images = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
`;

const Image = styled.img`
  animation: ${fadeIn} 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  border: 1px solid #fafafa;
  border-radius: 1px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  height: auto;
  margin-bottom: ${settings.space / 3}px;
  margin-right: ${settings.space / 3}px;
  width: calc(33.333% - ${settings.space / 4}px);

  &:nth-child(3n) {
    margin-right: 0;
  }
`;

const Link = styled.a`
  background: white;
  border: 1px solid ${settings.colors.text};
  border-radius: 2px;
  color: ${settings.colors.headings};
  display: inline-block;
  padding: ${settings.space / 3}px ${settings.space / 1.5}px;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    background: ${settings.colors.text};
    color: white;
  }
`;

const CustomCaptureButton = styled(Link)`
  border: none;
  cursor: pointer;
  font-size: 16px;
`;

const Main = styled.section`
  padding-bottom: ${settings.space * 2}px;
`;

const EmojiButton = styled.button`
  animation: ${upDown} 1.2s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
  background: none;
  border: none;
  bottom: -42px;
  left: 0;
  opacity: ${props => (props.show ? 1 : 0)};
  position: absolute;
  text-align: center;
  transition: opacity 0.5s 0.17s ease-out;
  width: 100%;

  [role="img"] {
    font-size: 42px;
    vertical-align: middle;
  }
`;

const Footer = styled.footer`
  background: #fafafa;
  color: #878787;
  padding: ${settings.space}px ${settings.space / 1.5}px;
  text-align: center;

  a {
    color: ${settings.colors.headings};
  }
`;

const Section = styled.section`
  border-bottom: 2px dashed rgba(255, 255, 255, 0.8);
  margin-bottom: ${settings.space * 3}px;
  padding-bottom: ${settings.space * 2}px;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

class Docs extends React.PureComponent {
  state = {
    basicImages: [],
    clickedCapture: false,
    customImages: []
  };

  handleTakePhotoBasic = img => {
    this.setState({
      basicImages: [...this.state.basicImages, img],
      clickedCapture: true
    });
  };

  handleTakePhotoCustomRenderer = img => {
    this.setState({
      customImages: [...this.state.customImages, img]
    });
  };

  render() {
    return [
      <GlobalStyle />,
      <Header key="header">
        <Wrapper>
          <Title>React Camera</Title>
          <Subtitle>A flexible camera component for React DOM</Subtitle>
          <Link href="https://github.com/arjanj/react-camera">
            Code and documentation on GitHub
          </Link>
        </Wrapper>
      </Header>,
      <Main key="section">
        <Wrapper>
          <Section>
            <HeadingGroup>
              <Heading>Basic usage</Heading>
            </HeadingGroup>
            <CameraWrapper>
              <Camera onTakePhoto={this.handleTakePhotoBasic} />
              <EmojiButton show={!this.state.clickedCapture}>
                <span aria-label="Point up" role="img">
                  ☝️
                </span>
              </EmojiButton>
            </CameraWrapper>
            <Images>
              {this.state.basicImages.map(img => (
                <Image key={img} src={img} />
              ))}
            </Images>
          </Section>
          <Section>
            <HeadingGroup>
              <Heading>Custom capture button</Heading>
              <p>
                This example demonstrates a custom render method for the capture
                button.
              </p>
            </HeadingGroup>
            <CameraWrapper>
              <Camera
                captureButtonRenderer={onClick => (
                  <CustomCaptureButton
                    as="button"
                    onClick={onClick}
                    type="button"
                  >
                    Take Photo
                  </CustomCaptureButton>
                )}
                onTakePhoto={this.handleTakePhotoCustomRenderer}
              />
            </CameraWrapper>
            <Images>
              {this.state.customImages.map(img => (
                <Image key={img} src={img} />
              ))}
            </Images>
          </Section>
          <Section>
            <HeadingGroup>
              <Heading>Browser support</Heading>
              <a
                href="https://caniuse.com/#feat=stream"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span aria-label="chain link" role="img">
                  🔗
                </span>{" "}
                caniuse.com
              </a>
            </HeadingGroup>
          </Section>
        </Wrapper>
      </Main>,
      <Footer>
        Copyright ©{" "}
        <a
          href="https://twitter.com/ArjanJassal"
          target="_blank"
          rel="noopener noreferrer"
        >
          Arjan Jassal
        </a>{" "}
        2017. MIT Licensed.
      </Footer>
    ];
  }
}

export default Docs;
