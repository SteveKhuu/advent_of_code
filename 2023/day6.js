const fileUtil = require('./common/filereader');


const getRange = (t, d) => {
  /*
   * d >= (t - n) * n
   * d >= tn - n^2 
   * n^2 -tn + d >= 0 -> quadratic
   * 
   * ax^2 + bx + c = 0
   * a = 1, b = -t, c = d
   * 
   * (-b +/- sqrt(t^2 - 4(d))) / 2
   * (t + sqrt(t^2 - 4d)) / 2 AND (t - sqrt(t^2 - 4d)) / 2
   */

  // Solves edge case where they're on the finish line but did not cross it.
  d = d + 1;

  let low = Math.ceil((t - Math.sqrt(Math.pow(t, 2) - 4*d)) / 2);
  let high = Math.floor((t + Math.sqrt(Math.pow(t, 2) - 4*d)) / 2);
  
  console.log(`t=${t}, d=${d} => ${high-low+1}`);
};

async function day6() {

  let times = [];
  let distances = [];

  await fileUtil.fileReader('/day6_input.txt', (input) => {
    if (times.length == 0) {
      times = input.match(/\d+/g).map( (n) => +n);
    } else {
      distances = input.match(/\d+/g).map( (n) => +n);
    }    
  });

  for(let i = 0; i < times.length; i++) {
    getRange(times[i], distances[i]);
  }
}

day6();