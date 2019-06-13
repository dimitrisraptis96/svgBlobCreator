import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import anime from "animejs";
import { saveAs } from "file-saver";
import { createBlobString, getPathData, getPoints } from "./blob";

const DIMS = [500, 500];
const OFFSET = 100;
const COLORS = ["ea5959", "f98b60", "ffc057", "ffe084"];

const Wrapper = styled.div`
  position: relative;
  width: ${DIMS[0]}px;
  height: ${DIMS[1]}px;

  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    position: absolute;
    /* top: 50%;
    left: 50%; */
  }
  ${Array(0, 1, 2, 3).map(
    n => `
    && > div:nth-child(${n + 1}) > svg {
    width: ${DIMS[0] - OFFSET * n}px;
    height: ${DIMS[1] - OFFSET * n}px;
    path {
      fill: #${COLORS[n]};
    }
  }
    `
  )}
`;
class App extends React.Component {
  state = {
    numOfPoints: 4,
    isPlaying: false
  };
  componentDidMount() {
    // this.setupAnimeJS();
  }

  componentDidUpdate() {
    this.setupAnimeJS();
  }

  handlePoints = e => {
    this.setState({ numOfPoints: e.target.value });
  };

  refresh = () => {
    const { numOfPoints } = this.state;
    this.setState({ numOfPoints });
  };

  download = blobSVG => {
    var content = blobSVG;
    var filename = "blob.svg";
    var blob = new Blob([content], {
      type: "text/plain;charset=utf-8"
    });

    saveAs(blob, filename);
  };

  setupAnimeJS = () => {
    // const el = this.blob.querySelector("svg");
    const morphings = document.querySelectorAll("path");

    // anime({
    //   targets: el,
    //   scaleX: [1, 0.9, 1.1, 0.95],
    //   scaleY: [1, 1.1, 0.9, 1.05],
    //   loop: 2,
    //   direction: "alternate",
    //   easing: "easeInSine",
    //   duration: 1200
    // });
    const { numOfPoints } = this.state;
    const angle = 360 / numOfPoints;
    const MAX = 10;

    const paths = [];
    for (let i = 0; i < MAX; i++) {
      paths.push({
        value: getPathData(getPoints(numOfPoints, angle), angle),
        duration: 200
      });
    }

    this.animation = anime({
      targets: morphings,
      d: paths,
      // loop: true,
      direction: "alternate",
      easing: "easeInSine",
      // translateX: [0, 40, 100],
      scale: [1, 1.2, 0.7, 0.9, 1],
      // autoplay: false,
      duration: 1500
    });
  };

  toggleIsPlaying = () => {
    const { isPlaying } = this.state;
    this.setState({ isPlaying: !isPlaying });

    if (isPlaying) {
      this.animation.pause();
    } else {
      this.animation.play();
    }
  };

  render() {
    const { numOfPoints, isPlaying } = this.state;

    // const controlButtonText = isPlaying ? "Stop" : "Play"};
    const blobString = createBlobString(numOfPoints);

    return (
      <div>
        <div>
          <label htmlFor="points">Complexity: </label>
          <input
            onChange={this.handlePoints}
            type="range"
            value={numOfPoints}
            id="points"
            name="Points"
            min="4"
            step="2"
            max="14"
          />
        </div>
        {/* <div
          ref={ref => (this.blob = ref)}
          dangerouslySetInnerHTML={{ __html: blobString }}
        /> */}

        <Wrapper>
          <div
            ref={ref => (this.morphing1 = ref)}
            dangerouslySetInnerHTML={{ __html: blobString }}
          />
          <div
            ref={ref => (this.morphing2 = ref)}
            dangerouslySetInnerHTML={{ __html: blobString }}
          />
          <div
            ref={ref => (this.morphing3 = ref)}
            dangerouslySetInnerHTML={{ __html: blobString }}
          />
          <div
            ref={ref => (this.morphing4 = ref)}
            dangerouslySetInnerHTML={{ __html: blobString }}
          />
        </Wrapper>
        <div>
          <button onClick={this.refresh}>Refresh</button>
          <button onClick={() => this.download(blobString)}>Download</button>
          <button onClick={this.toggleIsPlaying}>
            {isPlaying ? "Stop" : "Play"}
          </button>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
