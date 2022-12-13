const fileUtil = require('./common/filereader');

const START = 'S';
const END = 'E';
const DIRECTIONS = [
  [0, -1], // UP
  [0, +1], // DOWN
  [-1, 0], // LEFT
  [+1, 0], // RIGHT
];

let grid = [];
let startCoords = [];
let otherPossibleStarts = [];
let endCoords = [];

let maxHeight = 0;
let maxWidth = 0;

function isNotAValidDirection(x, y, currentHeight, visited) {
  return (
    x < 0 ||
    y < 0 ||
    x == maxWidth ||
    y == maxHeight ||
    visited.hasOwnProperty(`${x},${y}`) ||
    notValidNextCharacter(currentHeight, grid[y][x])
  );
}

function notValidNextCharacter(current, next) {
  let currentVal = current.charCodeAt(0);
  if (current == START) {
    currentVal = 'a'.charCodeAt(0);
  }

  let nextVal = next.charCodeAt(0);
  if (next == END) {
    nextVal = 'z'.charCodeAt(0);
  }

  return nextVal > currentVal + 1;
}

async function parseGrid() {
  let currentY = 0;

  await fileUtil.fileReader('/day12_input.txt', (input) => {
    let startX = input.indexOf(START);
    let endX = input.indexOf(END);

    if (input.indexOf(START) != -1) {
      startCoords = [startX, currentY];
    }

    if (input.indexOf('a') != -1) {
      otherPossibleStarts.push({ x: input.indexOf('a'), y: currentY, steps: 0 });
    }

    if (input.indexOf(END) != -1) {
      endCoords = [endX, currentY];
    }

    grid.push(input.split(''));
    currentY++;
  });

  maxHeight = grid.length;
  maxWidth = grid[0].length;
}

function walkGrid(part) {
  let directionsToGo = [];
  let visited = {};

  if (part == 1) {
    directionsToGo.push({ x: startCoords[0], y: startCoords[1], steps: 0 });
  } else {
    directionsToGo = [...otherPossibleStarts];
  }

  while (directionsToGo.length > 0) {
    let { x, y, steps } = directionsToGo.shift();

    let currentHeight = grid[y][x];

    if (visited.hasOwnProperty(`${x},${y}`)) {
      continue;
    }

    if (currentHeight == END) {
      console.log(steps);
      break;
    }

    [].forEach.call(DIRECTIONS, function (direction) {
      let newCoordinates = [x + direction[0], y + direction[1]];

      if (isNotAValidDirection(newCoordinates[0], newCoordinates[1], currentHeight, visited)) {
        return;
      }
      directionsToGo.push({ x: newCoordinates[0], y: newCoordinates[1], steps: steps + 1 });
    });

    let key = `${x},${y}`;
    visited[key] = 1;
  }
}

async function solve() {
  await parseGrid();
  walkGrid(1);
  walkGrid(2);
}

solve();
