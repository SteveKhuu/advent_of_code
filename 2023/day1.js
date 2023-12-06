const fileUtil = require('./common/filereader');

const exp1A = '\\d';
const numberExp = '\\d|one|two|three|four|five|six|seven|eight|nine';
const nameToIndex = numberExp.split('|');

const getValue = (phrase) => {
  // +'7' -> 7 or +'seven' -> NaN
  return +phrase || nameToIndex.indexOf(phrase);
};

const digitsToNumber = (firstDigit, secondDigit) => {
  // Append 7 to 7 to make 77, then convert back to number
  return getValue(getValue(firstDigit)+''+getValue(secondDigit)+'');
};

const day1Process = (collection, regex) => {
  let sum = collection.reduce((acc,current) => {
    let firstAndLast = current.match(`(?=(${regex})).*(${regex})`)
    return acc + digitsToNumber(firstAndLast[1], firstAndLast[2]);
  }, 0);
    
  console.log(sum);
}

async function day1() {

  let collection = [];

  await fileUtil.fileReader('/day1_input.txt', (input) => {
    collection.push(input)
  });

  day1Process(collection, exp1A);
  day1Process(collection, numberExp);
}

day1();