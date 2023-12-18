const fileUtil = require('./common/filereader');

class Range {

  constructor(destination, startingPoint, rangeCount, index) {
    this.mapping = {};
    this.updateRange(destination, startingPoint, rangeCount);
    this.name = `mapping-${index}`;
  }

  updateRange(destination, startingPoint, rangeCount) {
    this.mapping[`${startingPoint}-${startingPoint + rangeCount - 1}`] = destination
  }

  mapInput(input) {
    let result = input;

    const keys = Object.keys(this.mapping);

    for(let i = 0; i < keys.length; i++) {
      let mappingKey = keys[i];
      let [startPoint, endPoint] = mappingKey.split('-').map((e) => +e);

      if (input >= startPoint && input <= endPoint) {
        let destination = this.mapping[mappingKey];
        result = destination + (input - startPoint);
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
  let lowestLocation = getSeedMapping(seeds[0], mappings);

  return [...seeds].slice(1).reduce( (acc, seed) => Math.min(acc, getSeedMapping(seed, mappings)),
    lowestLocation
  );
};

const generateTheorticalSeed = (theorticalSeedNumber, mappings) => {
  return getSeedMapping(theorticalSeedNumber, [...mappings].reverse());
};

const theroticalSeedExists = (seedNumber, seeds) => {
  let seedExists = false;

  for(let i = 0; i < seeds.length; i += 2) {
    let startingSeedNum = seeds[i];
    let numSeeds = seeds[i+1];

    if (seedNumber >= startingSeedNum && seedNumber < (startingSeedNum + numSeeds)) {

      console.log(`${startingSeedNum} <= ${seedNumber} < ${startingSeedNum + numSeeds}`)
      seedExists = true;
      break;
    }
  }

  return seedExists;
};

/*
  * Day 5B: If you're starting with a location, then we should be able to go bottoms up
  * 
  */
const getLowestLocationFromSeedRange = (seeds, mappings) => {
  let lowestSeed;
  let theorticalLocationNumber = 20_000_000; // TBD, brute forced this.

  while(!lowestSeed) {
    // TODO: why is the inverse lookup producing a difference seed number?
    const theroticalSeed = generateTheorticalSeed(theorticalLocationNumber, mappings);

    if(theroticalSeedExists(theroticalSeed, seeds)) {
      lowestSeed = theorticalLocationNumber;
    }
    theorticalLocationNumber++;
  }

  return lowestSeed;
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
        rangeInstance = new Range(destination, startingPoint, rangeCount, mappings.length);
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
  console.log(getLowestLocationFromSeedRange(seeds, mappings));
  

};

day5A();