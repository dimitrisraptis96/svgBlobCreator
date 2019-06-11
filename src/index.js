import React from "react";
import ReactDOM from "react-dom";
import anime from "animejs";
import { saveAs } from "file-saver";
import { createBlobString, getPathData, getPoints } from "./blob";

class App extends React.Component {
  state = {
    numOfPoints: 4,
    isPlaying: false
  };
  componentDidMount() {
    this.setupAnimeJS();
  }

  componentDidUpdate() {
    // this.setupAnimeJS();
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
    const morphing = this.morphing.querySelector("path");

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
        duration: 400
      });
    }

    this.animation = anime({
      targets: morphing,
      d: paths,
      loop: true,
      direction: "alternate",
      easing: "easeInSine",
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

        <div
          ref={ref => (this.morphing = ref)}
          dangerouslySetInnerHTML={{ __html: blobString }}
        />
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
