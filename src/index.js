import React from "react";
import ReactDOM from "react-dom";
import anime from "animejs";
import { saveAs } from "file-saver";
import { createBlobString, getPathData, getPoints } from "./blob";

class App extends React.Component {
  state = {
    numOfPoints: 4
  };
  componentDidMount() {
    this.setupAnimeJS();
  }

  componentDidUpdate() {
    this.setupAnimeJS();
  }

  handlePoints = e => {
    this.setState({ numOfPoints: e.target.value });
  };

  refresh = () => {
    const { numOfPoints } = this.state;
    this.setState({ numOfPoints: numOfPoints });
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
        value: getPathData(getPoints(numOfPoints, angle), angle).join(","),
        duration: 400
      });
    }

    anime({
      targets: morphing,
      d: paths,
      loop: true,
      direction: "alternate",
      easing: "easeInSine",
      duration: 1500
    });
  };

  render() {
    const { numOfPoints } = this.state;

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
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
