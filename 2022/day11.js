const fileUtil = require('./common/filereader');

let monkies = [];
let modulus = 1; //Borrowing black magic suggestion

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

      let newWorryLevel = toStableNumber(runOperation(startingItem));

      if (!this.hasRelief) {
        newWorryLevel = Math.floor(newWorryLevel / THREE);
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

  inspectionCount() {
    return this.#inspectionCount;
  }
}

function toStableNumber(str) {
  return parseInt(str, 10);
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
}

function reset() {
  monkies = [];
  modulus = 1;
}

function resolve() {
  let inspectionCounts = [];
  [].forEach.call(monkies, function (monkey, i) {
    inspectionCounts.push(monkey.inspectionCount());
  });

  let topTwo = inspectionCounts
    .sort((a, b) => {
      return a - b;
    })
    .slice(-2);
  console.log(topTwo[0] * topTwo[1]);
}

//Part 1
async function part1() {
  await loadMonkeySim();
  await runMonkeySim(20);
  resolve();
  reset();
}

//Part 2
async function part2() {
  await loadMonkeySim(true);
  await runMonkeySim(10000);
  resolve();
}

part1();
part2();
