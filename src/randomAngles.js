import gradients from "./gradients";
import { useLayoutEffect } from "react";

const CENTER_X = 300;
const CENTER_Y = 300;
const RADIUS = 200;
const OFFSET = 10;

const topology = {
  dims: [500, 500],
  count: 4,
  offset: 0,
  colors: ["#ea5959", "#f98b60", "#ffc057", "#ffe084"]
};

function getRandomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getAngles(max, numOfParts) {
  const angle = findAngleRad(numOfParts);
  var arr = [];
  var sum = 0;
  for (var i = 0; i < numOfParts - 1; i++) {
    var angle0To90 = getRandomIntBetween(
      angle - angle * 0.01,
      angle + angle * 0.01
    );
    if (i === 0) {
      arr[i] = angle0To90;
    } else {
      arr[i] = arr[i - 1] + angle0To90;
    }
    sum += arr[i];
  }

  arr[numOfParts - 1] = 360;
  console.log(arr);
  return arr;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getPointOnCircle(radius, angle) {
  var x = CENTER_X + radius * Math.cos((angle * Math.PI) / 180);
  var y = CENTER_Y + radius * Math.sin((angle * Math.PI) / 180);
  return { x, y, angle, radius };
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

function getPath(numOfPoints, radius, angles, index, angleOffset, radiusSeeds) {
  const points = getPoints(
    numOfPoints,
    angles,
    angleOffset,
    radius,
    radiusSeeds
  );
  // console.log(points);

  return `
    <path
      id="depth-level-${index}"
      fill="${topology.colors[index]}"
      d="${getPathData(points, angles)}" /> 
      <path
      id="depth-level-${index}"
      stroke="gray"
      d="${getLinePathData(points, angles)}" />
    ${drawCircles(points)} 
    `;
}

function getPoints(numOfPoints, angles, angleOffset, radius, radiusSeeds) {
  const points = [];
  for (let i = 0; i < numOfPoints; i++) {
    // var offset = (angleOffset * angle * -1) ^ i;
    // var point = getPointOnCircle(radius, (i + 1) * angle + offset);
    var point = getPointOnCircle(radius + radiusSeeds[i], angles[i]);
    points.push(point);
  }
  return points;
}

function getLinePathData(points, angles) {
  const numOfPoints = points.length;
  return points
    .map((point, index) => {
      const isFirst = index === 0;
      const isLast = index + 1 === numOfPoints;

      const nextIndex = isLast ? 0 : index + 1;
      const nextPoint = points[nextIndex];
      const dist = Math.pow(
        Math.pow(point.x - nextPoint.x, 2) + Math.pow(point.y - nextPoint.y, 2),
        1 / 2
      );
      const sign = Math.pow(-1, index);
      const offset = 0.1 * dist;
      const angleToAdd = isLast
        ? nextPoint.angle / 2
        : (nextPoint.angle - point.angle) / 2;
      const mediumPoint = getPointOnCircle(
        point.radius + offset * sign * sign,
        point.angle + angleToAdd
      );

      return `
        M  ${point.x} ${point.y}
        L  ${mediumPoint.x} ${mediumPoint.y} 
        M  ${mediumPoint.x} ${mediumPoint.y} 
        L  ${nextPoint.x} ${nextPoint.y} 
    `;
    })
    .join(" ");
  // .replace(" ", "");
}

function drawCircles(points) {
  const numOfPoints = points.length;
  return points
    .map((point, index) => {
      const isFirst = index === 0;

      const isLast = index + 1 === numOfPoints;

      const nextIndex = isLast ? 0 : index + 1;
      const nextPoint = points[nextIndex];
      const dist = Math.pow(
        Math.pow(point.x - nextPoint.x, 2) + Math.pow(point.y - nextPoint.y, 2),
        1 / 2
      );
      const sign = Math.pow(-1, index);
      const offset = 0.1 * dist;
      const angleToAdd = isLast
        ? nextPoint.angle / 2
        : (nextPoint.angle - point.angle) / 2;
      const mediumPoint = getPointOnCircle(
        point.radius + offset * sign * sign,
        point.angle + angleToAdd
      );
      console.log(mediumPoint);

      return `
      <circle fill="black" cx=" ${point.x}" cy="${point.y}" r="10"/>
      <circle fill="gray" cx=" ${mediumPoint.x}" cy="${mediumPoint.y}" r="5"/>
    `;
    })
    .join(" ");
  // .replace(" ", "");
}

function getPathData(points, angles) {
  const numOfPoints = points.length;
  console.log(points);

  return points
    .map((point, index) => {
      const isFirst = index === 0;
      const isLast = index + 1 === numOfPoints;

      const nextIndex = isLast ? 0 : index + 1;
      const nextPoint = points[nextIndex];
      const dist = Math.pow(
        Math.pow(point.x - nextPoint.x, 2) + Math.pow(point.y - nextPoint.y, 2),
        1 / 2
      );

      const sign = Math.pow(-1, index);
      const offset = 0.1 * dist;
      const angleToAdd = isLast
        ? nextPoint.angle / 2
        : (nextPoint.angle - point.angle) / 2;
      const mediumPoint = getPointOnCircle(
        point.radius + offset * sign * sign,
        point.angle + angleToAdd
      );
      // draw lines
      // return `
      //   ${true && `M  ${point.x}, ${point.y}`}
      //   L  ${nextPoint.x}, ${nextPoint.y}
      //   `;

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

function createBlobString(numOfPoints, radiusOffset) {
  const linearGradient = getLinearGradient();
  var radiusSeeds = [];
  for (var i = 0; i < numOfPoints; i++) {
    radiusSeeds.push(getRandomIntBetween(-radiusOffset, radiusOffset));
  }
  const angleOffset = 0.1 * getRandomInt(3);
  // const angle = findAngleRad(numOfPoints);
  const angles = getAngles(360, numOfPoints);
  console.log(radiusSeeds);

  return `
      <svg
        id="blob-svg"
        width="300"
        height="300"
        viewBox="0 0 600 600"
        xmlns="http://www.w
        console.log(arr);
        3.org/2000/svg"
      >
        <defs>${linearGradient}</defs>
        <g>
        ${[...Array(topology.count)]
          .map((x, index) => {
            const radius = RADIUS - index * topology.offset;
            return getPath(
              numOfPoints,
              radius,
              angles,
              index,
              angleOffset,
              radiusSeeds
            );
          })
          .join(" ")}
        </g>
      </svg>
    `;
}

export { createBlobString, getPathData, getPoints };
//
