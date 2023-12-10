const fileUtil = require('./common/filereader');

let cardStack = {};
let cardDupes = {};

const getNumberOfMatches = (input) => {
  let numberOfMatches = -1;
  let numberSets = input.split('|');
  //Pad 0 to avoid indexOf issues
  let cardNumbers = numberSets[0].match(/\d+/g).slice(1).map( (n) => n.padStart(2, '0'));
  let winningNumbers = numberSets[1].match(/\d+/g).map( (n) => n.padStart(2, '0')).join(",");

  cardNumbers.forEach( (cardNumber) => {
    if (winningNumbers.indexOf(cardNumber) != -1 ) {
      numberOfMatches++;
    }
  });

  return numberOfMatches;
};

async function day4A() {
  let sum = 0;

  await fileUtil.fileReader('/day4_input.txt', (input) => {
    let cardKey = input.match(/\d+/)[0];
    cardStack[cardKey] = input;

    const numberOfMatches = getNumberOfMatches(input);

    if (numberOfMatches > -1) {      
      sum += Math.pow(2, numberOfMatches);
    }

    cardDupes[cardKey] = {
      matches: numberOfMatches+1,
      cardCount: 1
    }
  });

  console.log(sum);
  day4B();
}

const createCardDupes = (cardKey, numberOfDupes) => {
  for(let i = 1; i <= numberOfDupes; i++) {
    let cardIndex = +cardKey.match(/\d+/)[0]
    cardDupes[`${cardIndex+i}`].cardCount++;
  }
};



const day4B = () => {
  let day4BSum = 0;

  console.log(cardDupes);

  for(let k in cardDupes) {
    
    let cardCount = cardDupes[k].cardCount;
    day4BSum += cardCount;

    for(let c = 0; c < cardCount; c++) {
      createCardDupes(k, cardDupes[k].matches);
    }
  }

  console.log(day4BSum);

};

day4A();
