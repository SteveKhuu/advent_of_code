const fileUtil = require('./common/filereader');
let reg = /(-)?[\d]+/g;

let nodes = [];

function findIntersectionRanges(candidates, y) {
  let range = [];
  let leftmost = Number.MAX_SAFE_INTEGER;
  let rightmost = 0;

  [].forEach.call(candidates, function (candidate) {
    let [sensorX, sensorY] = candidate.sensor;
    let [low, high] = candidate.verticalRange;

    let xMeta = {
      point: sensorX,
      low: -1,
      high: -1,
    };

    //If sensor is on the same axis as y, we can just take the span
    if (sensorY == y) {
      xMeta.low = sensorX - candidate.radius;
      xMeta.high = sensorX + candidate.radius;
    } else {
      // else, the distance of intersection is also a square.
      // |sy+r-y| = sx+d
      let distance = Math.min(Math.abs(low - y), Math.abs(high - y));
      xMeta.low = sensorX - distance;
      xMeta.high = sensorX + distance;
    }

    if (xMeta.low < leftmost) {
      leftmost = xMeta.low;
    }

    if (xMeta.high > rightmost) {
      rightmost = xMeta.high;
    }
    range.push(xMeta);
  });

  return [
    range.sort((a, b) => {
      return a.low - b.low;
    }),
    leftmost,
    rightmost,
  ];
}

function findPaintedAxis(range) {
  let sum = 0;
  let spot = [null, null];

  if (range.length > 0) {
    let previousRange = range[0];
    sum += previousRange.high - previousRange.low + 1;

    for (let r = 1; r < range.length; r++) {
      let node = range[r];

      if (previousRange.low <= node.low && previousRange.high >= node.high) {
        /*
         * -----------  previous
         *   -------    node
         */
        continue;
      } else if (node.low > previousRange.high) {
        /*
         * -----------  previous
         *             -------    node
         */
        sum += node.high - node.low + 1;

        //For Part 2: gaps are a clue that a hidden beacon exists
        spot = previousRange.high + 1;
      } else if (node.low >= previousRange.low && node.high > previousRange.high) {
        /*
         * -----  previous
         *   -------    node
         */
        sum += node.high - previousRange.high;
      }

      previousRange = node;
    }
  }

  return [sum, spot];
}

function findIntersections(y, logOutput) {
  let candidates = [];

  [].forEach.call(nodes, function (node) {
    let distance = Math.abs(node.sensor[1] - y);
    if (distance <= node.radius) {
      candidates.push(node);
    }
  });

  let [range, leftmost, rightmost] = findIntersectionRanges(candidates, y);
  let [sum, spot] = findPaintedAxis(range);

  //Note: Subtract 1 if a beacon is on the specified y-axis
  if (logOutput) {
    console.log(sum);
  }

  if (range.length > 0) {
    //Part 2:
    return [rightmost - leftmost, sum, spot];
  } else {
    return [null, null, null];
  }
}

async function parseSensorsAndBeacons(y) {
  await fileUtil.fileReader('/day15_input.txt', (input) => {
    //calculate radius for each sensor to beacon
    //s => 8, 7
    //b => 2, 10. ergo 6 + 3 radius = Math.abs(sx-bx) + Math.abs(sy-by)

    let [sensor, beacon] = input.split(':');

    let sensorCoordinates = sensor.match(reg).map((c) => parseInt(c, 10));
    let beaconCoordinates = beacon.match(reg).map((c) => parseInt(c, 10));

    let radius =
      Math.abs(beaconCoordinates[0] - sensorCoordinates[0]) +
      Math.abs(beaconCoordinates[1] - sensorCoordinates[1]);

    nodes.push({
      sensor: sensorCoordinates,
      radius: radius,
      verticalRange: [sensorCoordinates[1] - radius, sensorCoordinates[1] + radius],
    });
  });
}

async function part1(y) {
  findIntersections(y, true);
}

async function part2(max) {
  //Part 2
  let yRanges = Array(max).fill(0);
  for (let r = 0; r < yRanges.length; r++) {
    yRanges[r] = findIntersections(r);

    //right-left == sum can only be true if there's a gap in the line -> missing beacon
    //otherwise, it should be right-left+1 == sum
    if (yRanges[r][1] == yRanges[r][0] && yRanges[r][0] != null) {
      console.log(yRanges[r][2] * max + r);
    }
  }
}

async function solve() {
  await parseSensorsAndBeacons();
  await part1(2000000);
  await part2(4000000);
}

solve();
