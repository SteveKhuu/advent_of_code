const fileUtil = require('./common/filereader');

let visitedPlaces = {};

function debugString(visitedPlaces, size) {
  for (let x = -1 * size; x < size; x++) {
    let row = '';
    for (let y = -1 * size; y < size; y++) {
      let key = `${x},${y}`;

      if (visitedPlaces.hasOwnProperty(key)) {
        row += '#';
      } else {
        row += '.';
      }
    }
    console.log(row);
  }
}

async function getTailRopeVisits(numTails) {
  let currentPositionH = [0, 0];

  let knots = Array(numTails).fill([0, 0]);

  let directionalMapping = {
    R: { vector: 1, axis: 1, opposite: 'L' },
    L: { vector: -1, axis: 1, opposite: 'R' },
    U: { vector: -1, axis: 0, opposite: 'D' },
    D: { vector: 1, axis: 0, opposite: 'U' },
  };

  function moveTail(previousHPos, leader, index) {
    let tail = knots[index];
    let diffX = Math.abs(leader[1] - tail[1]);
    let diffY = Math.abs(leader[0] - tail[0]);

    let previousState = [...knots[index]];

    if (diffX > 1 || diffY > 1) {
      if (diffX == 0 || diffY == 0) {
        knots[index] = previousHPos;
      } else {
        if (diffX > 1) {
          knots[index] = [leader[0], previousHPos[1]];
        } else {
          knots[index] = [previousHPos[0], leader[1]];
        }
      }
    }

    return previousState;
  }

  await fileUtil.fileReader('/day9_input.txt', (input) => {
    let [direction, amount] = input.split(' ');
    amount = parseInt(amount, 10);

    let directionalMeta = directionalMapping[direction];

    let change = directionalMeta.vector;
    let posAxis = directionalMeta.axis;

    for (let s = 0; s < amount; s++) {
      let previousHPos = [...currentPositionH];
      currentPositionH[posAxis] += 1 * change;

      let previousTailer = moveTail(previousHPos, currentPositionH, 0);

      for (let k = 1; k < knots.length; k++) {
        let currentTailer = [...knots[k - 1]];
        previousTailer = moveTail(previousTailer, currentTailer, k);
      }
      const tailPosKey = knots[knots.length - 1].toString();

      visitedPlaces[tailPosKey] = visitedPlaces[tailPosKey] || 0;
      visitedPlaces[tailPosKey]++;
    }
  });

  console.log(Object.keys(visitedPlaces).length);
  console.log(Object.values(visitedPlaces).filter((p) => p > 1).length);
  debugString(visitedPlaces, 30);
}

getTailRopeVisits(9);
