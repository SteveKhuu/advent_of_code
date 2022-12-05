const fileUtil = require('./common/filereader');

async function getFinalCrateMessage() {
  let stacks = [];
  let stacksPartTwo = [];

  await fileUtil.fileReader('/day5_input.txt', (input) => {
    // Parse stack
    if (input.indexOf('[') != -1) {
      for (let i = 1; i < input.length; i += 4) {
        let stackIndex = (i - 1) / 4;

        if (typeof stacks[stackIndex] == 'undefined') {
          stacks[stackIndex] = [];
          stacksPartTwo[stackIndex] = [];
        }

        if (input.charAt(i) != ' ') {
          stacks[stackIndex].push(input.charAt(i));
          stacksPartTwo[stackIndex].push(input.charAt(i));
        }
      }
    } else if (input.indexOf('move') != -1) {
      // Read instructions
      let numericInstructionsRegex = /[0-9]+/g;
      let [numToShift, from, to] = input.match(numericInstructionsRegex);
      from = parseInt(from, 10) - 1;
      to = parseInt(to, 10) - 1;

      //Part 1
      for (let i = 0; i < numToShift; i++) {
        stacks[to].unshift(stacks[from].shift());
      }

      //Part 2
      let preservedOrder = [];
      for (let i = 0; i < numToShift; i++) {
        preservedOrder.push(stacksPartTwo[from].shift());
      }
      stacksPartTwo[to] = preservedOrder.concat(stacksPartTwo[to]);
    }
  });

  console.log(stacks.map((x) => x[0]).join(''));
  console.log(stacksPartTwo.map((x) => x[0]).join(''));
}

getFinalCrateMessage();
