const { off } = require('process');
const fileUtil = require('./common/filereader');

function compareLists(firstList, secondList) {
  return compare(JSON.parse(firstList), JSON.parse(secondList));
}

const compare = (first, second) => {
  if (typeof first == 'number' && typeof second == 'number') {
    if (first < second) return true;
    if (first > second) return false;
    return null;
  } else if (typeof first == 'object' && typeof second == 'object') {
    for (let i = 0; i < Math.min(first.length, second.length); i++) {
      let result = compare(first[i], second[i]);
      if (result != null) return result;
    }

    if (first.length < second.length) {
      return true;
    } else if (first.length > second.length) {
      return false;
    } else {
      return null;
    }
  } else {
    return compare(
      typeof first == 'number' ? [first] : first,
      typeof second == 'number' ? [second] : second,
    );
  }
};

async function solve() {
  let lists = [];
  let currentIndex = 1;
  let matchingIndicies = 0;

  let emptyListsToSort = [];
  let listsToSort = [];
  let reg = /\d/g;

  await fileUtil.fileReader('/day13_input.txt', (input) => {
    if (currentIndex % 3 != 0) {
      lists[(currentIndex % 3) - 1] = input;

      listsToSort.push(input);
    } else {
      if (compareLists(lists[0], lists[1])) {
        matchingIndicies += currentIndex / 3;
      }
    }
    currentIndex++;
  });

  console.log(matchingIndicies);

  let firstObject = '[[2]]';
  let secondObject = '[[6]]';

  listsToSort.push(firstObject);
  listsToSort.push(secondObject);
  listsToSort.sort((a, b) => {
    return compareLists(a, b) ? -1 : 1;
  });

  let firstLocation, secondLocation;
  let index = 1;
  while (!firstLocation && !secondLocation && index <= listsToSort.length) {
    if (listsToSort[index - 1] == firstObject) {
      firstLocation = index;
    } else if (listsToSort[index - 1] == secondObject) {
      secondLocation = index;
    }
    index++;
  }

  console.log(`${listsToSort.indexOf(firstObject) + 1} * ${listsToSort.indexOf(secondObject) + 1}`);
  console.log((listsToSort.indexOf(firstObject) + 1) * (listsToSort.indexOf(secondObject) + 1));
}

solve();
