import gradients from "./gradients";

const CENTER_X = 300;
const CENTER_Y = 300;
const RADIUS = 200;
const OFFSET = 10;

const topology = {
  dims: [500, 500],
  count: 4,
  offset: 100,
  colors: ["ea5959", "f98b60", "ffc057", "ffe084"]
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// function getPointOnCircle(angle) {
//   const randomInt = getRandomInt(OFFSET);
//   var x = CENTER_X + (RADIUS - randomInt) * Math.cos((angle * Math.PI) / 180);
//   var y = CENTER_Y + (RADIUS - randomInt) * Math.sin((angle * Math.PI) / 180);
//   return { x, y, angle };
// }

function getPointOnCircle(radius, angle) {
  // const radius = RADIUS - radius - offset;
  var x = CENTER_X + radius * Math.cos((angle * Math.PI) / 180);
  var y = CENTER_Y + radius * Math.sin((angle * Math.PI) / 180);
  return { x, y, angle };
}

function findAngleRad(numOfPoints) {
  return 360 / numOfPoints;
}

function getPathTransform() {
  const skewX = `skewX(${getRandomInt(10)})`;
  const skewY = `skewY(${getRandomInt(10)})`;
  const rotate = `rotate(${getRandomInt(360)} ${CENTER_X} ${CENTER_Y})`;
  return `${skewX} ${skewY} ${rotate}`;
}

function getPathData(points, angle) {
  const numOfPoints = points.length;

  return points
    .map((point, index) => {
      const isFirst = index === 0;
      const isLast = index + 1 === numOfPoints;

      const nextIndex = isLast ? 0 : index + 1;
      const nextPoint = points[nextIndex];
      const mediumPoint = getPointOnCircle(
        point.angle + (nextPoint.angle - point.angle) / 2
      );

      if (isFirst) {
        return `
        M  ${point.x} ${point.y}
        Q  ${mediumPoint.x} ${mediumPoint.y} ${nextPoint.x} ${nextPoint.y} 
    `;
      } else {
        return `T ${nextPoint.x} ${nextPoint.y}`;
      }
    })
    .join(" ");
  // .replace(" ", "");
}

// const svgPath = (points, command) => {
//   // build the d attributes by looping over the points
//   return points.reduce(
//     (acc, point, i, a) =>
//       i === 0
//         ? // if first point
//           `M ${point[0]},${point[1]}`
//         : // else
//           `${acc} ${command(point, i, a)}`,
//     ""
//   );
// };

// const lineCommand = point => `L ${point[0]} ${point[1]}`;

function getPath(numOfPoints, radius, angle, index) {
  const points = getPoints(numOfPoints, angle, radius);

  return `
      <path
        id="blob-path"
        fill="${topology.colors[index]}"
        d="${getPathData(points, angle)}" /> `;
}

function getPoints(numOfPoints, angle, radius) {
  const points = [];
  for (let i = 0; i < numOfPoints; i++) {
    var point = getPointOnCircle(radius, (i + 1) * angle);
    points.push(point);
  }
  return points;
}

function getRandomGradientColors() {
  return gradients[Math.floor(Math.random() * gradients.length)];
}

function getLinearGradient() {
  const colors = getRandomGradientColors();
  const numOfColors = colors.length;
  const factor = 1 / (numOfColors - 1);
  return `
      <linearGradient id="linear-gradient">
        ${colors.map(
          (color, index) =>
            `<stop offset="${factor * index}" stop-color="${color}" />`
        )}
      </linearGradient>`;
}

function createBlobString(numOfPoints) {
  const linearGradient = getLinearGradient();
  const radiusSeed = getRandomInt(OFFSET);
  const angleSeed = 0.1 * getRandomInt(3);
  const angle = findAngleRad(numOfPoints);

  return `
      <svg
        id="blob-svg"
        width="300"
        height="300"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>${linearGradient}</defs>
        <g>
        ${[...Array(topology.count)]
          .map((x, index) => {
            const radius = RADIUS - index * topology.offset - radiusSeed;
            return getPath(numOfPoints, radius, angle, index);
          })
          .join(" ")}
        </g>
      </svg>
    `;
}

export { createBlobString, getPathData, getPoints };
