const fileUtil = require('./common/filereader');

class Range {

  constructor(destination, startingPoint, rangeCount) {
    this.mapping = this.mapping || {};

    this.updateRange(destination, startingPoint, rangeCount);  
  }

  updateRange(destination, startingPoint, rangeCount) {
    this.mapping[`${startingPoint}-${startingPoint + rangeCount - 1}`] = {
      destination: destination,
      range: rangeCount
    }
  }

  mapInput(input) {
    let result = input;

    const keys = Object.keys(this.mapping);

    for(let i = 0; i < keys.length; i++) {
      let mappingKey = keys[i];
      let [startPoint, endPoint] = mappingKey.split('-').map((e) => +e);

      if (input >= startPoint && input <= endPoint) {
        result = this.mapping[mappingKey].destination + (input - startPoint);
        break;
      }
    }

    return result;
  }
};

const getSeedMapping = (seed, mappings) => {

  // Reduction is another quasi-fancy way of doing recursive iteration through our mappings
  return mappings.reduce((acc, mapping) => mapping.mapInput(acc),
    seed
  );
};

const getLowestLocation = (seeds, mappings) => {
  // let [seedToSoil, soilToFertilizer, fertilizerToWater, waterToLight, 
  //   lightToTemperature, tempToHumidity, humidityToLocation] = mappings;

  let lowestLocation = getSeedMapping(seeds.shift(), mappings);

  return seeds.reduce( (acc, seed) => Math.min(acc, getSeedMapping(seed, mappings)),
    lowestLocation
  );
};

async function day5A() {
  let seeds = [];
  let mappings = [];
  let rangeInstance;

  await fileUtil.fileReader('/day5_input.txt', (input, lastLine) => {
    if (seeds.length == 0) {
      seeds = input.match(/\d+/g).map((e) => +e);
    } else if(input.match(/\d/)) {
      let [destination, startingPoint, rangeCount] = input.split(" ").map((e) => +e);
      
      if (rangeInstance) {
        rangeInstance.updateRange(destination, startingPoint, rangeCount);
      } else {
        rangeInstance = new Range(destination, startingPoint, rangeCount);
      }

      // EOF is an another mapping entry
      if(lastLine) {
        mappings.push(rangeInstance);
      }
    } else if (input.length == 0) {
      if (rangeInstance) {
        mappings.push(rangeInstance);
        rangeInstance = undefined;
      }
    } 
  });

  console.log(getLowestLocation(seeds, mappings));

};

day5A();