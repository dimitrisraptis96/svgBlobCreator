import gradients from "./gradients";

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

const svgPath = (points, command) => {
  // build the d attributes by looping over the points
  return points.reduce(
    (acc, point, i, a) =>
      i === 0
        ? // if first point
          `M ${point[0]},${point[1]}`
        : // else
          `${acc} ${command(point, i, a)}`,
    ""
  );
};

const lineCommand = point => `L ${point[0]} ${point[1]}`;

function getPath(numOfPoints) {
  const angle = findAngleRad(numOfPoints);
  const points = getPoints(numOfPoints, angle);

  // transform="${getPathTransform()}"
  return `
      <path
        id="blob-path"
        d="${getPathData(points, angle)} ${svgPath(
    points.map(p => [p.x, p.y]),
    lineCommand
  )}"
  stroke="black"
        fill="url(#linear-gradient)"
      />`;
}

function getPoints(numOfPoints, angle) {
  // const points = [];
  // for (let i = 0; i < numOfPoints; i++) {
  //   points.push(getPointOnCircle((i + 1) * angle));
  // }
  // return points;
  const angleOffset = 0.1 * getRandomInt(5);

  const points = [];
  for (let i = 0; i < numOfPoints; i++) {
    var offset = (angleOffset * angle * -1) ^ i;
    var point = getPointOnCircle((i + 1) * angle + offset);
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
  return `
      <svg
        id="blob-svg"
        width="300"
        height="300"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>${getLinearGradient()}</defs>
        <g>${getPath(numOfPoints)}</g>
      </svg>
    `;
}

export { createBlobString, getPathData, getPoints };
