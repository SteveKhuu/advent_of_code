const fs = require("fs");
const path = require("path");

function elfWithMostCalories() {
  fs.readFile(__dirname + '/day1_input.txt', (err, data) => {
    if (err) throw err;

    let rawData = data.toString();

    const inputs = rawData.split('\n');

    //We don't actually need these, but good to know :)
    let elfTracker = 1;
    let elfWithHighestTotal = 1;
    
    let calorieTracker = [];

    let totalCalories = 0;
    let highestTotal = 0;

    [].forEach.call(inputs, function(input) {
      if (input === '') {
        if (totalCalories > highestTotal) {
          highestTotal = totalCalories;
          elfWithHighestTotal = elfTracker;
        }

        calorieTracker.push(totalCalories);
        elfTracker++;
        totalCalories = 0;
      } else {
        totalCalories += parseInt(input, 10);
      }
    });

    // Part One
    console.log(highestTotal);

    // Part Two
    console.log(
      calorieTracker.sort((a, b) => { return a - b })
                    .slice(-3)
                    .reduce((acc, el) => {return acc + el}, 0)
    );
  });
}

elfWithMostCalories();