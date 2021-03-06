import gradients from "./gradients";
import { useLayoutEffect } from "react";

const CENTER_X = 300;
const CENTER_Y = 300;
const RADIUS = 200;
const OFFSET = 10;

const topology = {
  dims: [500, 500],
  count: 4,
  offset: 40,
  colors: ["#ea5959", "#f98b60", "#ffc057", "#ffe084"]
};

function getRandomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getAngles(max, length) {
  const factor = 0.01;
  const angle = findAngleRad(length);

  const angles = [];
  for (let i = 0; i < length - 1; i++) {
    const isFirst = i === 0;
    const min = angle - angle * factor;
    const max = angle + angle * factor;
    const angle0To90 = getRandomIntBetween(min, max);
    angles[i] = isFirst ? angle0To90 : angles[i - 1] + angle0To90;
  }
  // final angle should be 360 degrees
  angles[length - 1] = 360;
  return angles;
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
  const skewX = `skewX(${getRandomIntBetween(0, 10)})`;
  const skewY = `skewY(${getRandomIntBetween(0, 10)})`;
  const rotate = `rotate(${getRandomIntBetween(
    0,
    360
  )} ${CENTER_X} ${CENTER_Y})`;
  return `${skewX} ${skewY} ${rotate}`;
}

function getPath(d, name, fill, stroke) {
  return `
    <path
      id="${name}"
      fill="${fill}"
      stroke="${stroke}"
      d="${d}" /> 
    `;
}

function getPoints(numOfPoints, angles, radius) {
  const points = [];
  for (let i = 0; i < numOfPoints; i++) {
    // var offset = (angleOffset * angle * -1) ^ i;
    // var point = getPointOnCircle(radius, (i + 1) * angle + offset);
    var point = getPointOnCircle(radius[i], angles[i]);
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
      const radiusToAdd = (nextPoint.radius - point.radius) / 2;
      const mediumPoint = getPointOnCircle(
        point.radius + radiusToAdd + offset * sign,
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
      const radiusToAdd = (nextPoint.radius - point.radius) / 2;
      const mediumPoint = getPointOnCircle(
        point.radius + radiusToAdd + offset * sign,
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
      const radiusToAdd = (nextPoint.radius - point.radius) / 2;
      const mediumPoint = getPointOnCircle(
        point.radius + radiusToAdd + offset * sign,
        point.angle + angleToAdd
      );
      // draw lines
      // return `
      //   ${true && `M  ${point.x}, ${point.y}`}
      //   L  ${nextPoint.x}, ${nextPoint.y}
      //   `;

      if (isFirst) {
        return `
        M  ${point.x}, ${point.y}
        Q  ${mediumPoint.x}, ${mediumPoint.y} ${nextPoint.x}, ${nextPoint.y} 
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

function createSvg(path, gradient) {
  return `
      <svg
        id="blob-svg"
        width="300"
        height="300"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>${gradient}</defs>
        <g transform="${getPathTransform()}"  >
        ${path}
        </g>
      </svg>
    `;
}

function calculateRandomRadiusOffsets(numOfPoints, offset) {
  const offsets = [];
  for (var i = 0; i < numOfPoints; i++) {
    offsets.push(getRandomIntBetween(-offset, offset));
  }
  return offsets;
}

function getBlob(numOfPoints, radiusOffset, hasGuides) {
  const radiusOffsets = calculateRandomRadiusOffsets(numOfPoints, radiusOffset);
  const angles = getAngles(360, numOfPoints);

  return [...Array(topology.count)]
    .map((x, index) => {
      const radius = radiusOffsets.map(
        offset => RADIUS - index * topology.offset + offset
      );
      const points = getPoints(numOfPoints, angles, radius);
      const name = `depth-level-${index}`;
      const fill = topology.colors[index];
      const stroke = "none";
      const d = getPathData(points, angles);
      const blobPath = getPath(d, name, fill, stroke);

      const guidesPath = getPath(
        getLinePathData(points, angles),
        name,
        "none",
        "gray"
      );

      return `${blobPath} ${hasGuides && guidesPath} ${hasGuides &&
        drawCircles(points)}`;
    })
    .join(" ");
}
function createBlobString(hasGuides, numOfPoints, radiusOffset) {
  const linearGradient = getLinearGradient();
  const blob = getBlob(numOfPoints, radiusOffset, hasGuides);
  // const topology = getTopology();

  return createSvg(blob, linearGradient);
}

export { createBlobString, getPathData, getPoints };
