const fileUtil = require('./common/filereader');

const START = 'AAA';
const END = 'ZZZ';

let directions;
let directionLength;
let pathMap = {};

let simultaneousStatus = [];

const getLCM = (nums) => {
  // If there's a faster way to do this, will revisit
  let min = nums.reduce((acc, n) => Math.min(acc, n), nums[0]);

  while (nums.some((n) => n % min != 0)) {
    min++;
  }

  console.log(`The LCM is ${min}`);

  return min;
}

const getPathCount = (s) => {
  let node = s;
  let count = 0;

  while(node.charAt(2) != 'Z') { // Refactored to work with 8A
    direction = directions.charAt(count % directionLength);
    node = pathMap[node][direction];
    count++;
  }

  return count;
};

const solve8B = () => {
  let count = 0;
  let results = simultaneousStatus.map((s) => getPathCount(s));

  getLCM(results);
  console.log(`8B DONE! ${count}`);
}

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

        if (path.includes('A')){
          simultaneousStatus.push(path);
        }
      }
    } else {
      directions = input;
      directionLength = directions.length;
    }
  });

  console.log(`8A: ${getPathCount(START)}`);
  solve8B();
}

day8();

