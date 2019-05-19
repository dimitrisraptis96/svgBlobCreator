import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const centerX = 300;
const centerY = 300;
const radius = 200;
const offset = 0;

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
          <label for="points">Points</label>
        </div>
        <svg
          width="300"
          height="300"
          viewBox="0 0 600 600"
          xmlns="http://www.w3.org/2000/svg"
        >
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
              fill="salmon"
            />
          </g>
        </svg>
        <button onClick={this.refresh}>Refresh</button>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
