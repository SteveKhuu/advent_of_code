const fileUtil = require('./common/filereader');

const TIE_POINTS = 3;
const WIN_POINTS = 6;

const throwValue = {
  X: 1,
  Y: 2,
  Z: 3,
};

const ruleSet = {
  A: {
    ties: 'X',
    weakness: 'Y',
    strength: 'Z',
  },
  B: {
    ties: 'Y',
    weakness: 'Z',
    strength: 'X',
  },
  C: {
    ties: 'Z',
    weakness: 'X',
    strength: 'Y',
  },
};

async function calculateRPSScore() {
  let totalScorePartOne = 0;
  let totalScorePartTwo = 0;

  await fileUtil.fileReader('/day2_input.txt', (input) => {
    let throws = input.split(' ');
    let opponentThrows = ruleSet[throws[0]];
    let ourInstruction = throws[1];

    // Part 1
    if (opponentThrows['ties'] === ourInstruction) {
      totalScorePartOne += TIE_POINTS;
    } else if (opponentThrows['weakness'] === ourInstruction) {
      totalScorePartOne += WIN_POINTS;
    }
    totalScorePartOne += throwValue[ourInstruction];

    // Part 2
    if (ourInstruction === 'X') {
      // we need to lose
      totalScorePartTwo += throwValue[opponentThrows['strength']];
    } else if (ourInstruction === 'Y') {
      // we need to tie
      totalScorePartTwo += throwValue[opponentThrows['ties']] + TIE_POINTS;
    } else {
      // we need to win
      totalScorePartTwo += throwValue[opponentThrows['weakness']] + WIN_POINTS;
    }
  });

  console.log(totalScorePartOne);
  console.log(totalScorePartTwo);
}

calculateRPSScore();
