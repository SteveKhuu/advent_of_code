const fileUtil = require('./common/filereader');

async function simulateWaterfall() {
  let leftMost = 1000;
  let rightMost = 0;
  let bottom = 0;
  let objects = {};

  function extractCoords(pair) {
    let [x, y] = pair.split(',');

    return [parseInt(x, 10), parseInt(y, 10)];
  }

  function plotXRock(x, pointFromY) {
    objects[`${x},${pointFromY}`] = 'r';
    if (x < leftMost) {
      leftMost = x;
    }

    if (x > rightMost) {
      rightMost = x;
    }
  }

  function plotYRock(pointFromX, y) {
    objects[`${pointFromX},${y}`] = 'r';
    if (y > bottom) {
      bottom = y;
    }
  }

  function plotRocks(points) {
    for (let p = 0; p < points.length - 1; p++) {
      let pointFrom = points[p];
      let pointTo = points[p + 1];

      let [pointFromX, pointFromY] = extractCoords(pointFrom);
      let [pointToX, pointToY] = extractCoords(pointTo);

      let x = pointFromX;
      while (x != pointToX) {
        plotXRock(x, pointFromY);
        x += Math.sign(pointToX - pointFromX);
      }
      plotXRock(x, pointFromY);

      let y = pointFromY;
      while (y != pointToY) {
        plotYRock(pointFromX, y);
        y += Math.sign(pointToY - pointFromY);
      }
      plotYRock(pointFromX, y);
    }
  }

  function plotNewBottom() {
    bottom += 2;

    for (let r = 0; r < 800; r++) {
      plotXRock(r, bottom);
    }
  }

  function drawWaterfall() {
    let waterfall = '';

    for (let y = 0; y < bottom + 2; y++) {
      waterfall += String(y).padStart(4, '0');
      for (let x = leftMost - 1; x < rightMost + 1; x++) {
        let key = `${x},${y}`;
        if (objects[key] == 'r') {
          waterfall += '#';
        } else if (objects[key] == 's') {
          waterfall += '0';
        } else {
          waterfall += '.';
        }
      }
      waterfall += '\n';
    }

    console.log(waterfall);
  }

  function baseIsSturdy(currentX, currentY) {
    return objects[`${currentX - 1},${currentY}`] && objects[`${currentX + 1},${currentY}`];
  }

  function dropSand(startingX, startingY, numSand) {
    for (let s = 0; s < numSand; s++) {
      let currentX = startingX;
      let currentY = startingY;

      let key = `${currentX},${currentY}`;
      let currentObject = objects[key];

      if (startingY == bottom) {
        //Part 1
        console.log('done');
      } else if (objects[`500,0`]) {
        //Part 2
        console.log('done part 2');
      } else {
        //Freefall wheeeee
        while (!currentObject) {
          currentY++;
          key = `${currentX},${currentY}`;
          currentObject = objects[key];
        }

        if (baseIsSturdy(currentX, currentY)) {
          //has three wide base, nothing above -> sit above base
          let key = `${currentX},${currentY - 1}`;
          if (!objects[key]) {
            objects[key] = 's';
          }
        } else {
          //find least obstructed path
          if (!objects[`${currentX - 1},${currentY}`]) {
            dropSand(currentX - 1, currentY, 1);
          } else if (!objects[`${currentX + 1},${currentY}`]) {
            dropSand(currentX + 1, currentY, 1);
          } else {
            console.log('stuck!');
          }
        }
      }
    }
  }

  await fileUtil.fileReader('/day14_input.txt', (input) => {
    let points = input.split(' -> ');
    plotRocks(points);
  });

  //Part 2
  plotNewBottom();

  dropSand(500, 0, 30214); //795, 30214
  drawWaterfall();
}

simulateWaterfall();
