import React from "react";
import ReactDOM from "react-dom";
import anime from "animejs";
import { saveAs } from "file-saver";
import { createBlobString, getPathData, getPointsArray } from "./blob";

class App extends React.Component {
  state = {
    points: 4
  };
  componentDidMount() {
    this.setupAnimeJS();
  }

  componentDidUpdate() {
    this.setupAnimeJS();
  }

  handlePoints = e => {
    this.setState({ points: e.target.value });
  };

  refresh = () => {
    const { points } = this.state;
    this.setState({ points: points });
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
    const paths = [
      getPathData(
        getPointsArray(this.state.points, 360 / this.state.points),
        360 / this.state.points
      ).join(","),
      getPathData(
        getPointsArray(this.state.points, 360 / this.state.points),
        360 / this.state.points
      ).join(","),
      getPathData(
        getPointsArray(this.state.points, 360 / this.state.points),
        360 / this.state.points
      ).join(","),
      getPathData(
        getPointsArray(this.state.points, 360 / this.state.points),
        360 / this.state.points
      ).join(","),
      getPathData(
        getPointsArray(this.state.points, 360 / this.state.points),
        360 / this.state.points
      ).join(","),
      getPathData(
        getPointsArray(this.state.points, 360 / this.state.points),
        360 / this.state.points
      ).join(","),
      getPathData(
        getPointsArray(this.state.points, 360 / this.state.points),
        360 / this.state.points
      ).join(","),
      getPathData(
        getPointsArray(this.state.points, 360 / this.state.points),
        360 / this.state.points
      ).join(","),
      getPathData(
        getPointsArray(this.state.points, 360 / this.state.points),
        360 / this.state.points
      ).join(","),
      getPathData(
        getPointsArray(this.state.points, 360 / this.state.points),
        360 / this.state.points
      ).join(",")
    ];

    anime({
      targets: morphing,
      d: paths.map(path => ({ value: [path], duration: 400 })),
      loop: true,
      direction: "alternate",
      easing: "easeInSine",
      duration: 1500
    });
  };

  render() {
    const { points } = this.state;

    const blobString = createBlobString(points);

    return (
      <div>
        <div>
          <label htmlFor="points">Complexity: </label>
          <input
            onChange={this.handlePoints}
            type="range"
            value={points}
            id="points"
            name="points"
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
