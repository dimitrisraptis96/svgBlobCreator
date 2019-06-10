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

function findAngleRad(points) {
  return 360 / points;
}

function getPathTransform() {
  const skewX = `skewX(${getRandomInt(10)})`;
  const skewY = `skewY(${getRandomInt(10)})`;
  const rotate = `rotate(${getRandomInt(360)} ${CENTER_X} ${CENTER_Y})`;
  return `${skewX} ${skewY} ${rotate}`;
}

function getPathData(pointsArray, angle) {
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

function getPath(points) {
  const angle = findAngleRad(points);
  const pointsArray = calculatePoints(points, angle);

  return `
      <path
        transform="${getPathTransform()}"
        d="${getPathData(pointsArray, angle)}"
        fill="url(#linear-gradient)"
      />`;
}

function calculatePoints(points, angle) {
  const pointsArray = [];
  for (let i = 0; i < points; i++) {
    pointsArray.push(getPointOnCircle((i + 1) * angle));
  }
  return pointsArray;
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

function createBlobString(points) {
  return `
      <svg
        id="blob-svg"
        width="300"
        height="300"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>${getLinearGradient()}</defs>
        <g>${getPath(points)}</g>
      </svg>
    `;
}

export default createBlobString;
