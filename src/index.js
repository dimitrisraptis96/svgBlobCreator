import React from "react";
import ReactDOM from "react-dom";
import { saveAs } from "file-saver";

import "./styles.css";

const centerX = 300;
const centerY = 300;
const radius = 200;
const offset = 10;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getPointOnCircle(angle) {
  const randomInt = getRandomInt(offset);
  var x = centerX + (radius - randomInt) * Math.cos((angle * Math.PI) / 180);
  var y = centerY + (radius - randomInt) * Math.sin((angle * Math.PI) / 180);
  return { x, y, angle };
}

function findAngleRad(points) {
  return 360 / points;
}

class App extends React.Component {
  state = {
    points: 4
  };

  handlePoints = e => {
    this.setState({ points: e.target.value });
  };

  refresh = () => {
    this.setState({ points: this.state.points });
  };

  download = (points, angle) => {
    const transform = `skewX(${getRandomInt(10)}) skewY(${getRandomInt(
      10
    )}) rotate(${getRandomInt(360)} ${centerX} ${centerY})`;

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

  render() {
    const { points } = this.state;
    const angle = findAngleRad(points);

    const pointsArray = [];
    const randomAngle = getRandomInt(45);
    for (let i = 0; i < points; i++) {
      // pointsArray.push(getPointOnCircle(randomAngle + (i + 1) * angle));
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
          width="300"
          height="300"
          viewBox="0 0 600 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="linear-gradient">
              <stop offset="0" stop-color="#43E97B" />
              <stop offset="1" stop-color="#38F9D7" />
            </linearGradient>
          </defs>
          <g>
            <path
              transform={`skewX(${getRandomInt(10)}) skewY(${getRandomInt(
                10
              )}) rotate(${getRandomInt(360)} ${centerX} ${centerY})`}
              d={pointsArray.map((point, index) => {
                const nextIndex =
                  index + 1 === pointsArray.length ? 0 : index + 1;
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
              })}
              fill="url(#linear-gradient)"
            />
          </g>
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
