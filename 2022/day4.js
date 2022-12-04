const fileUtil = require('./common/filereader');

async function getOverlap() {
  let encompassCount = 0;
  let overlapCount = 0;

  await fileUtil.fileReader('/day4_input.txt', (input) => {
    let pairs = input.split(',');
    let firstPair = pairs[0].split('-').map((x) => parseInt(x, 10));
    let secondPair = pairs[1].split('-').map((x) => parseInt(x, 10));

    //Part 1
    if (
      (firstPair[0] <= secondPair[0] && firstPair[1] >= secondPair[1]) ||
      (secondPair[0] <= firstPair[0] && secondPair[1] >= firstPair[1])
    ) {
      encompassCount++;
    }

    //Part 2 - as long as one of the numbers is between the other pair, it counts
    if (
      (secondPair[0] <= firstPair[1] && secondPair[0] >= firstPair[0]) ||
      (firstPair[0] <= secondPair[1] && firstPair[0] >= secondPair[0]) ||
      (firstPair[1] >= secondPair[0] && firstPair[1] <= secondPair[1]) ||
      (secondPair[1] >= firstPair[0] && secondPair[1] <= firstPair[1])
    ) {
      overlapCount++;
    }
  });

  //Part 1
  console.log(encompassCount);

  //Part 2
  console.log(overlapCount);
}

getOverlap();
