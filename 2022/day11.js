const fileUtil = require('./common/filereader');

let monkies = [];
let modulus = BigInt(1); //Borrowing black magic suggestion

const THREE = toStableNumber('3');

class Monkey {
  #inspectionCount;

  constructor(hasRelief = false) {
    this.startingItems = [];
    this.operation = '';
    this.divisibleBy;
    this.firstChoice;
    this.secondChoice;
    this.hasRelief = hasRelief;
    this.#inspectionCount = 0;
  }

  inspectItems() {
    let monkeyScript = this.operation;

    // let reg = /[\d]+/g;
    // monkeyScript = monkeyScript.replace(reg, "`${('0x' + parseInt($&,10).toString(16))}`");

    const runOperation = function (old) {
      let [_, operator, right] = monkeyScript.split(' ');

      if (right.indexOf('old') == -1) {
        right = toStableNumber(right);
      } else {
        right = old;
      }

      return eval(`${old} ${operator} ${right}`);
    };

    while (this.startingItems.length) {
      let startingItem = this.startingItems.shift();

      //TODO: find a way to make hex work
      //let newWorryLevel = `0x${runOperation(startingItem)}`;
      let newWorryLevel = toStableNumber(runOperation(startingItem));

      if (!this.hasRelief) {
        newWorryLevel = Math.floor(
          parseInt(newWorryLevel.toString(10), 10) / parseInt(THREE.toString(10), 10),
        );
        newWorryLevel = BigInt(newWorryLevel);
      } else {
        newWorryLevel = newWorryLevel % modulus; // How does this shit work?!?!
      }

      if (newWorryLevel % this.divisibleBy == 0) {
        monkies[this.firstChoice].startingItems.push(newWorryLevel);
      } else {
        monkies[this.secondChoice].startingItems.push(newWorryLevel);
      }

      this.#inspectionCount++;
    }
  }

  receive(item) {
    this.startingItems.push(item);
  }

  toString() {
    return `inspected ${this.#inspectionCount} times`;
  }
}

function toStableNumber(str) {
  //Hex strategy fails when number gets too large :(
  // let parsedHex = '0x' + parseInt(str, 10).toString(16);
  // return `${parsedHex}`;

  return BigInt(parseInt(str, 10));
}

async function loadMonkeySim(hasRelief) {
  monkies = [];
  let currentMonkey;

  await fileUtil.fileReader('/day11_input.txt', (input) => {
    if (input.indexOf('Monkey') != -1) {
      currentMonkey = new Monkey(hasRelief);
    } else if (input.indexOf('Starting') != -1) {
      let reg = /[\d]+/g;
      let items = input.match(reg).map((i) => toStableNumber(i));

      currentMonkey.startingItems = [...items];
    } else if (input.indexOf('Operation') != -1) {
      let operationString = input.substring(input.indexOf('=') + 2);

      currentMonkey.operation = operationString;
    } else if (input.indexOf('Test') != -1) {
      currentMonkey.divisibleBy = toStableNumber(input.split(' ').pop());

      modulus *= currentMonkey.divisibleBy;
    } else if (input.indexOf('true') != -1) {
      currentMonkey.firstChoice = parseInt(input.split(' ').pop(), 10);
    } else if (input.indexOf('false') != -1) {
      currentMonkey.secondChoice = parseInt(input.split(' ').pop(), 10);
    } else {
      monkies.push(currentMonkey);
    }
  });
}

async function runMonkeySim(rounds) {
  for (let i = 0; i < rounds; i++) {
    [].forEach.call(monkies, function (monkey, i) {
      monkey.inspectItems();
    });
  }

  [].forEach.call(monkies, function (monkey, i) {
    console.log(`Monkey ${i}: ${monkey.toString()}`);
  });
}

//Part 1
async function part1() {
  await loadMonkeySim();
  await runMonkeySim(20);
}

//Part 2
async function runLongerSim(totalNumberOfSims, simsPerCycle = 20) {
  let repetitons = totalNumberOfSims / simsPerCycle;

  while (repetitons > 0) {
    await runMonkeySim(simsPerCycle);
    repetitons--;
  }
}

async function part2() {
  await loadMonkeySim(true);
  await runLongerSim(10000);
}

// part1(); //101,95,7,105
part2();
