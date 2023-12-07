const fileUtil = require('./common/filereader');


const gameRegex = 'Game\\s(\\d+)';
const cubeRegex = /(\d+\s[a-z]+)/g;

const MAX_RED_CUBES = 12;
const MAX_GREEN_CUBES = 13;
const MAX_BLUE_CUBES = 14;

const exceeds_limits = (cubes) => {
  let exceeds_limit = false;

  cubes.forEach((cube) => {
    // 1 red
    let cubeDescriptor = cube.split(' ');
    
    let cubeQuantity = +cubeDescriptor[0];
    let cubeColour = cubeDescriptor[1];
    // cubesInPlay[cubeColour] += +cubeDescriptor[0];

    if (cubeQuantity > eval(`MAX_${cubeColour.toUpperCase()}_CUBES`)) {
      exceeds_limit = true;

      return exceeds_limit;
    }
  });

  return exceeds_limit;
};

const get_cubes_needed = (cubes) => {
  let cubesInPlay = {
    'red' : 0,
    'blue' : 0,
    'green' : 0
  };

  cubes.forEach((cube) => {
    let cubeDescriptor = cube.split(' ');
    
    let cubeQuantity = +cubeDescriptor[0];
    let cubeColour = cubeDescriptor[1];

    cubesInPlay[cubeColour] =  Math.max(cubeQuantity, cubesInPlay[cubeColour]);

  });

  return cubesInPlay['red'] * cubesInPlay['blue'] * cubesInPlay['green'];
};

// 12 red cubes, 13 green cubes, and 14 blue cubes
async function day2A() {

  let sum = 0;

  await fileUtil.fileReader('/day2_input.txt', (input) => {
    let gameValue = input.match(`${gameRegex}`);
    let cubes = input.match(cubeRegex);

    if (!exceeds_limits(cubes)) {
      sum += +gameValue[1];
    }
  });

  console.log(sum);
}

async function day2B() {

  let sum = 0;

  await fileUtil.fileReader('/day2_input.txt', (input) => {
    let cubes = input.match(cubeRegex);

    sum += get_cubes_needed(cubes);
  });

  console.log(sum);
}

day2A();
day2B();
