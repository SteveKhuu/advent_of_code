const fileUtil = require('./common/filereader');

let visitedPlaces = {};

function debugString(visitedPlaces, size) {
  for (let y = -1 * size; y < size; y++) {
    let row = '';
    for (let x = -1 * size; x < size; x++) {
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
  let knots = Array(numTails + 1).fill([0, 0]);

  let directionalMapping = {
    R: { vector: 1, axis: 0, opposite: 'L' },
    L: { vector: -1, axis: 0, opposite: 'R' },
    U: { vector: -1, axis: 1, opposite: 'D' },
    D: { vector: 1, axis: 1, opposite: 'U' },
  };

  function moveTail(leader, index) {
    let tail = knots[index];
    let diffX = Math.abs(leader[0] - tail[0]);
    let diffY = Math.abs(leader[1] - tail[1]);

    if (diffX > 1 || diffY > 1) {
      tail[0] += Math.sign(leader[0] - tail[0]);
      tail[1] += Math.sign(leader[1] - tail[1]);
      knots[index] = [...tail];
    }
  }

  await fileUtil.fileReader('/day9_input.txt', (input) => {
    let [direction, amount] = input.split(' ');
    amount = parseInt(amount, 10);

    let directionalMeta = directionalMapping[direction];

    let change = directionalMeta.vector;
    let posAxis = directionalMeta.axis;

    for (let s = 0; s < amount; s++) {
      let head = [...knots[0]];
      head[posAxis] += 1 * change;
      knots[0] = [...head];
      moveTail(knots[0], 1);

      for (let k = 2; k < knots.length; k++) {
        moveTail(knots[k - 1], k);
      }
      const tailPosKey = knots[knots.length - 1].toString();

      visitedPlaces[tailPosKey] = visitedPlaces[tailPosKey] || 0;
      visitedPlaces[tailPosKey]++;
    }
  });

  console.log(Object.keys(visitedPlaces).length);
  debugString(visitedPlaces, 30);
}

getTailRopeVisits(9);
