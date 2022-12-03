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
  let partOneTotal = 0;

  let seenItemsForGroup = {};
  let commonCharacterInGroup = '';
  let partTwoTotal = 0;
  let inputIndex = 0;
  const GROUP_SIZE = 3;

  await fileUtil.fileReader('/day3_input.txt', (input) => {
    let rucksackMedian = input.length / 2;
    let firstCompartment = input.substring(0, rucksackMedian);
    let secondCompartment = input.substring(rucksackMedian, input.length);
    let seenCharacters = {};
    let commonCharacter = '';

    [].forEach.call(input, function (item, index) {
      let firstCompartmentItem = firstCompartment.charAt(index);
      let secondCompartmentItem = secondCompartment.charAt(index);

      // Part 1 - Comparing halves
      if (index < rucksackMedian) {
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
        if (firstCompartmentItem === secondCompartmentItem) {
          seenCharacters[secondCompartmentItem] = 2;
          commonCharacter = secondCompartmentItem;
        } else if (seenCharacters[secondCompartmentItem] === 0) {
          seenCharacters[secondCompartmentItem] = 2;
          commonCharacter = secondCompartmentItem;
        } else if (seenCharacters[firstCompartmentItem] === 1) {
          seenCharacters[firstCompartmentItem] = 2;
          commonCharacter = firstCompartmentItem;
        } else {
          seenCharacters[firstCompartmentItem] = 0;
          seenCharacters[secondCompartmentItem] = 1;
        }
      }

      // Part 2 - Comparing groups of rucksacks
      // 0 -> first time seeing character
      // 1 -> seen before in first rucksack
      // 2 -> seen before in first and second rucksack

      if (inputIndex % GROUP_SIZE === 0) {
        seenItemsForGroup[item] = 0;
      } else if (inputIndex % GROUP_SIZE === 1 && seenItemsForGroup[item] === 0) {
        seenItemsForGroup[item] = 1;
      } else if (inputIndex % GROUP_SIZE === 2 && seenItemsForGroup[item] === 1) {
        seenItemsForGroup[item] = 2;
        commonCharacterInGroup = item;
      }
    });

    partOneTotal += getValueOfLetter(commonCharacter);

    inputIndex++;
    if (inputIndex % GROUP_SIZE === 0) {
      partTwoTotal += getValueOfLetter(commonCharacterInGroup);
      seenItemsForGroup = {};
      commonCharacterInGroup = '';
    }
  });

  console.log(partOneTotal);
  console.log(partTwoTotal);
}

getPrioritySum();
