const fileUtil = require('./common/filereader');

let characters = [...Array(26)].map((x, i) => String.fromCharCode(i + 97));
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
let endCoords = [];

let maxHeight = 0;
let maxWidth = 0;

let shortestPath = {};

async function getShortestPath() {
  let currentY = 0;

  await fileUtil.fileReader('/day12_input.txt', (input) => {
    let startX = input.indexOf(START);
    let endX = input.indexOf(END);

    if (input.indexOf(START) != -1) {
      startCoords = [startX, currentY];
    }

    if (input.indexOf(END) != -1) {
      endCoords = [endX, currentY];
    }

    grid.push(input.split(''));
    currentY++;
  });

  maxHeight = grid.length;
  maxWidth = grid[0].length;
  // console.log(grid);
}

function walkGrid(x, y, explored) {
  let currentHeight = grid[y][x];
  let updatedExplored = { ...explored };
  updatedExplored[`${x},${y}`] = currentHeight;

  if (currentHeight === END) {
    let currentPathLength = Object.keys(shortestPath).length;
    let newPathLength = Object.keys(updatedExplored).length;

    if (currentPathLength === 0 || newPathLength < currentPathLength) {
      shortestPath = { ...updatedExplored };
    }
  } else {
    let validDirections = [];

    [].forEach.call(DIRECTIONS, function (direction) {
      let newCoordinates = [x + direction[0], y + direction[1]];
      if (isAValidDirection(newCoordinates[0], newCoordinates[1], currentHeight, updatedExplored)) {
        validDirections.push(newCoordinates);
      }
    });

    [].forEach.call(validDirections, function (validDirection) {
      let newX = validDirection[0];
      let newY = validDirection[1];

      // console.log(`${currentHeight} at (${x},${y}) will pursue:`);
      // console.log(`     ${grid[newY][newX]} at (${newX},${newY})`);

      walkGrid(newX, newY, updatedExplored);
    });
  }
}

function isAValidDirection(x, y, currentHeight, explored) {
  return (
    x >= 0 &&
    x < maxWidth &&
    y >= 0 &&
    y < maxHeight &&
    !explored.hasOwnProperty(`${x},${y}`) &&
    (currentHeight === START ||
      currentHeight.charCodeAt(0) + 1 === grid[y][x].charCodeAt(0) ||
      currentHeight.charCodeAt(0) === grid[y][x].charCodeAt(0) ||
      ((currentHeight == 'y' || currentHeight == 'z') && grid[y][x] === END))
  );
}

async function solve() {
  await getShortestPath();
  walkGrid(startCoords[0], startCoords[1], {});
  console.log('Shortest path found: ');
  console.log(shortestPath);
  console.log(Object.keys(shortestPath).length - 1);
}

solve();
