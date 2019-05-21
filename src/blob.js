const centerX = 300;
const centerY = 300;
const radius = 200;
const offset = 10;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function findAngleDegree(points) {
  return 360 / points;
}

function getPointOnCircle(angle) {
  const randomInt = getRandomInt(offset);
  var x = centerX + (radius - randomInt) * Math.cos((angle * Math.PI) / 180);
  var y = centerY + (radius - randomInt) * Math.sin((angle * Math.PI) / 180);
  return { x, y, angle };
}

function getDataPath(points, angle) {
  const numOfPoints = points.length;

  return points
    .map((point, index) => {
      const nextIndex = index + 1 === numOfPoints ? 0 : index + 1;
      const nextPoint = points[nextIndex];
      const mediumPoint = getPointOnCircle(point.angle + angle / 2);

      if (index === 0) {
        return `
        M  ${point.x} ${point.y}
        Q  ${mediumPoint.x} ${mediumPoint.y} ${nextPoint.x} ${nextPoint.y} 
      `;
      } else {
        return `T ${nextPoint.x} ${nextPoint.y}`;
      }
    })
    .join();
}

function getPathTransformation() {
  const skew = `skewX(${getRandomInt(10)}) skewY(${getRandomInt(10)})`;
  const rotate = `rotate(${getRandomInt(360)} ${centerX} ${centerY})`;
  return `${skew} ${rotate}`;
}

function getRandomSymmetricPoints(numOfPoints, angle) {
  const points = [];
  for (let i = 0; i < numOfPoints; i++) {
    points.push(getPointOnCircle((i + 1) * angle));
  }
  return points;
}

export function createBlob(numOfPoints) {
  const angle = findAngleDegree(numOfPoints);
  const points = getRandomSymmetricPoints(numOfPoints, angle);

  return `<svg
      width="300"
      height="300"
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="linear-gradient" x1="0%" y1="0" x2="100%" y2="0">
          <stop offset="0" stop-color="#43E97B">
          </stop>
          <stop offset=".5" stop-color="#38F9D7">
          </stop>
        </linearGradient>
      </defs>
      <g>
        <path
          transform="${getPathTransformation()}"
          d="${getDataPath(points, angle)}"
          fill="url(#linear-gradient)"
        />
      </g>
    </svg>`;
}
