const fileUtil = require('./common/filereader');

let symbolsRegex = /([^0-9.])/g;

const symbolExists = (grid, startX, startY, endX, endY) => {
  let symbolFound = false;

  for (let j = startY; j <= endY; j++) {
    let rowString = grid[j];

    for (let i = startX; i <= endX; i++) {
      let character = rowString.charAt(i);

      if(character.match(symbolsRegex)) {
        symbolFound = true;
        break;
      }
    }

    if (symbolFound) {
      break;
    }
  }

  return symbolFound;
};

const findProperIndex = (string, number) => {
  let allMatches = [...string.matchAll(`${number}`)];
  let realIndex;

  if (allMatches) {
    for(let i = 0; i < allMatches.length; i++) {
      let match = allMatches[i];
      if (string.charAt(match.index-1).match("[^\d]") &&
          string.charAt(match.index + number.length).match("[^\d]")) {
        realIndex = match.index;
        break;
      }
    }
  }

  return realIndex;
};

const day3A = (grid) => {
  let startX = startY = endX = endY = -1;
  let sum = 0;

  grid.forEach((rowString, row) => {
    let numbers = rowString.match(/\d+/g);

    if (numbers) {
      numbers.forEach( (number) => {

        //Deals with edge case where number = 79 and string = ...795..79
        let numberIndex = findProperIndex(rowString, number);

        if (numberIndex) {
          startX = Math.max(numberIndex-1);
          startY = Math.max(row-1);
          endX = Math.min(numberIndex+number.length);
          endY = Math.min(row+1);
          
          if (symbolExists(grid, startX, startY, endX, endY)) {
            sum += parseInt(number, 10);
            // console.log(sum);
          }
        } else {
          console.log(`index for ${number} not found`);
          console.log(rowString);
        }
      });
    }
  });

  return sum;
  ;
};

// scan numbers
    // has symbol = startx-1..endX+1, starty-1..endY+1

async function day3() {
  let grid = [];

  await fileUtil.fileReader('/day3_input.txt', (input) => {
    grid.push(`..${input}..`);
    // build matrix
    
  });

  console.log(day3A(grid));
}

day3();
