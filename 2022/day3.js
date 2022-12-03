const fileUtil = require('./common/filereader');

// a = 97, A . 65
const LOWER_ASCII_START = 97;
const UPPER_ASCII_START = 65;

function getValueOfLetter(letter) {
  let asciiValue = letter.charCodeAt(0);

  if (asciiValue >= LOWER_ASCII_START) {
    return asciiValue - LOWER_ASCII_START + 1;
  } else {
    return asciiValue - UPPER_ASCII_START + 27;
  }
}

async function getPrioritySum() {
  let total = 0;

  await fileUtil.fileReader('/day3_input.txt', (input) => {
    let firstCompartment = input.substring(0, input.length / 2);
    let secondCompartment = input.substring(input.length / 2, input.length);
    let seenCharacters = {};
    let commonCharacter = '';

    [].forEach.call(firstCompartment, function (item, index) {
      let secondCompartmentItem = secondCompartment.charAt(index);

      // 0 -> seen in first compartment
      // 1 -> seen in second compartment
      // 2 -> mark it as match (for debugging reference)

      /*
       * Iteration Scenarios:
       * - both letters in current index position match
       * - letter in the second compartment has been seen in the first compartment before
       * - letter in the first compartment has been seen in the second compartment before
       * - we have not seen either letter before
       */
      if (item === secondCompartmentItem) {
        seenCharacters[secondCompartmentItem] = 2;
        commonCharacter = secondCompartmentItem;
      } else if (seenCharacters[secondCompartmentItem] === 0) {
        seenCharacters[secondCompartmentItem] = 2;
        commonCharacter = secondCompartmentItem;
      } else if (seenCharacters[item] === 1) {
        seenCharacters[item] = 2;
        commonCharacter = item;
      } else {
        seenCharacters[item] = 0;
        seenCharacters[secondCompartmentItem] = 1;
      }
    });

    total += getValueOfLetter(commonCharacter);
  });

  console.log(total);
}

getPrioritySum();
