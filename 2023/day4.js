const fileUtil = require('./common/filereader');

async function day4A() {
  let sum = 0;

  await fileUtil.fileReader('/day4_input.txt', (input) => {
    let numberSets = input.split('|');
    let numberOfMatches = -1;

    //Pad 0 to avoid indexOf issues
    let cardNumbers = numberSets[0].match(/\d+/g).slice(1).map( (n) => n.padStart(2, '0'));
    let winningNumbers = numberSets[1].match(/\d+/g).map( (n) => n.padStart(2, '0')).join(",");

    cardNumbers.forEach( (cardNumber) => {
      if (winningNumbers.indexOf(cardNumber) != -1 ) {
        numberOfMatches++;
      }
    });

    if (numberOfMatches > -1) {
      sum += Math.pow(2, numberOfMatches);
    }
  });

  console.log(sum);
}

day4A();
