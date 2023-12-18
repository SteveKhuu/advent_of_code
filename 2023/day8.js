const fileUtil = require('./common/filereader');

const START = 'AAA';
const END = 'ZZZ';

let directions;
let directionLength;
let pathMap = {};

const solve = () => {
  let node = START;
  let direction;
  let count = 0;

  while(node != END) {
    direction = directions.charAt(count % directionLength);
    node = pathMap[node][direction];

    count++;
  }

  console.log(`DONE! ${count}`);
};

async function day8() {
  await fileUtil.fileReader('/day8_input.txt', (input) => {

    if (directions) {
      let pathContext = input.match(/\w{3}/g);
      if(pathContext) {
        let [path, left, right] = [...pathContext];

        pathMap[path] = {
          'L': left,
          'R': right
        };
      }
    } else {
      directions = input;
      directionLength = directions.length;
    }
  });

  solve();
}

day8();