import React from "react";
import ReactDOM from "react-dom";
import { saveAs } from "file-saver";
import anime from "animejs";

import "./styles.css";
import { array } from "prop-types";

const CENTER_X = 300;
const CENTER_Y = 300;
const RADIUS = 200;
const OFFSET = 10;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getPointOnCircle(angle) {
  const randomInt = getRandomInt(OFFSET);
  var x = CENTER_X + (RADIUS - randomInt) * Math.cos((angle * Math.PI) / 180);
  var y = CENTER_Y + (RADIUS - randomInt) * Math.sin((angle * Math.PI) / 180);
  return { x, y, angle };
}

function findAngleRad(points) {
  return 360 / points;
}

class App extends React.Component {
  state = {
    points: 4
  };

  componentDidMount() {
    this.setupAnimeJS();
  }

  handlePoints = e => {
    this.setState({ points: e.target.value });
  };

  refresh = () => {
    const { points } = this.setState;
    this.setState({ points: points });
  };

  download = (points, angle) => {
    const transform = `skewX(${getRandomInt(10)}) skewY(${getRandomInt(
      10
    )}) rotate(${getRandomInt(360)} ${CENTER_X} ${CENTER_Y})`;

    const dataPath = points.map((point, index) => {
      const nextIndex = index + 1 === points.length ? 0 : index + 1;
      const nextPoint = points[nextIndex];
      const mediumPoint = getPointOnCircle(point.angle + angle / 2);

      if (index === 0) {
        return `
                  M  ${point.x} ${point.y}
                  Q  ${mediumPoint.x} ${mediumPoint.y} ${nextPoint.x} ${
          nextPoint.y
        } 
                `;
      } else {
        return `T ${nextPoint.x} ${nextPoint.y}`;
      }
    });
    var content = `
    <svg
    width="300"
    height="300"
    viewBox="0 0 600 600"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="${dataPath}"
        transform="${transform}"
        fill="salmon"
      />
    </g>
  </svg>
    `;
    var filename = "blob.svg";

    var blob = new Blob([content], {
      type: "text/plain;charset=utf-8"
    });
    saveAs(blob, filename);
  };

  setupAnimeJS = () => {
    anime({
      targets: this.blob,
      points: [
        {
          value: [
            "70 24 119.574 60.369 100.145 117.631 50.855 101.631 3.426 54.369",
            "70 41 118.574 59.369 111.145 132.631 60.855 84.631 20.426 60.369"
          ]
        },
        {
          value:
            "70 6 119.574 60.369 100.145 117.631 39.855 117.631 55.426 68.369"
        },
        {
          value:
            "70 57 136.574 54.369 89.145 100.631 28.855 132.631 38.426 64.369"
        },
        {
          value:
            "70 24 119.574 60.369 100.145 117.631 50.855 101.631 3.426 54.369"
        }
      ],
      easing: "easeOutQuad",
      duration: 2000,
      loop: true
    });
  };

  getPathTransform() {
    const skewX = `skewX(${getRandomInt(10)})`;
    const skewY = `skewY(${getRandomInt(10)})`;
    const rotate = `rotate(${getRandomInt(360)} ${CENTER_X} ${CENTER_Y})`;
    return `${skewX} ${skewY} ${rotate}`;
  }

  getPathData(pointsArray, angle) {
    const numOfPoints = pointsArray.length;

    return pointsArray.map((point, index) => {
      const nextIndex = index + 1 === numOfPoints ? 0 : index + 1;
      const nextPoint = pointsArray[nextIndex];
      const mediumPoint = getPointOnCircle(point.angle + angle / 2);

      if (index === 0) {
        return `
              M  ${point.x} ${point.y}
              Q  ${mediumPoint.x} ${mediumPoint.y} ${nextPoint.x} ${
          nextPoint.y
        } 
            `;
      } else {
        return `T ${nextPoint.x} ${nextPoint.y}`;
      }
    });
  }

  getPath(points) {
    const angle = findAngleRad(points);
    const pointsArray = this.calculatePoints(points, angle);

    return (
      <path
        transform={this.getPathTransform()}
        d={this.getPathData(pointsArray, angle)}
        fill="url(#linear-gradient)"
      />
    );
  }

  calculatePoints(points, angle) {
    const pointsArray = [];
    for (let i = 0; i < points; i++) {
      pointsArray.push(getPointOnCircle((i + 1) * angle));
    }
    return pointsArray;
  }

  getRandomGradientColors() {
    return ["#43E97B", "#38F9D7"];
  }

  getLinearGradient() {
    const colors = this.getRandomGradientColors();
    const numOfColors = colors.length;
    const factor = 1 / (numOfColors - 1);
    return (
      <linearGradient id="linear-gradient">
        {colors.map((color, index) => (
          <stop offset={factor * index} stop-color={color} />
        ))}
      </linearGradient>
    );
  }

  render() {
    const { points } = this.state;
    const angle = findAngleRad(points);

    const pointsArray = [];
    for (let i = 0; i < points; i++) {
      pointsArray.push(getPointOnCircle((i + 1) * angle));
    }

    return (
      <div className="App">
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
            max="20"
          />
        </div>
        <svg
          ref={ref => (this.blob = ref)}
          width="300"
          height="300"
          viewBox="0 0 600 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>{this.getLinearGradient()}</defs>
          <g>{this.getPath(points)}</g>
        </svg>
        <div>
          <button onClick={this.refresh}>Refresh</button>
          <button onClick={() => this.download(pointsArray, angle)}>
            Download
          </button>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
