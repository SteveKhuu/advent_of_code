const fileUtil = require('./common/filereader');

let opponentThrows = ['A', 'B', 'C'];
let throws = ['X', 'Y', 'Z'];

const TIE_POINTS = 3;
const WIN_POINTS = 6;

async function calculateRPSScore() {
  await fileUtil.fileReader('/day2_input.txt', function (inputs) {
    [].forEach.call(inputs, function (input) {
      console.log(input);
    });
  });
}

calculateRPSScore();
