const { open } = require('fs/promises');
const fileUtil = require('./common/filereader');

let valveReg = /[A-Z]{2}/g;
let paths = {};

let importantTunnels = [];

const STARTING_TUNNEL = 'AA';

/*
 * TL; DR of the below approach
 * - get all non-zero valves
 * - for every tunnel, map the shortest way to reach that tunnel
 * - synthesize a set of strategies/permutations for the correct order of valves we care about
 * - run through each strategy until you find the largest overall value
 */

function shortestPath(source, target) {
  let queue = [source],
    visited = { [source]: true },
    predecessor = {},
    tail = 0;

  while (tail < queue.length) {
    let u = queue[tail++], // Pop a vertex off the queue.
      availableTunnels = paths[u].tunnels;
    for (let i = 0; i < availableTunnels.length; ++i) {
      let v = availableTunnels[i];
      if (visited[v]) {
        continue;
      }
      visited[v] = true;
      if (v === target) {
        // Check if the path is complete.
        let path = [v]; // If so, backtrack through the path.
        while (u !== source) {
          path.push(u);
          u = predecessor[u];
        }
        path.push(u);
        path.reverse();
        return path.join(',');
      }
      predecessor[v] = u;
      queue.push(v);
    }
  }
}

function mapPathsToImportantTunnels() {
  [].forEach.call(Object.values(paths), function (path) {
    let strategies = {};

    [].forEach.call(importantTunnels, function (tunnel) {
      strategies[tunnel] = shortestPath(path.name, tunnel);
      path, tunnel;
    });

    paths[path.name].strategies = strategies;
  });
}

function simulatePermutation(permutationKey, permutationsToRun) {
  let startingTunnel = STARTING_TUNNEL;
  let tunnelSequence = [...permutationsToRun[permutationKey].sequence];

  let runningCost = 0;
  let runningValue = 0;

  let opened = [];

  while (runningCost < 30) {
    let nextTarget = tunnelSequence.shift();

    if (nextTarget) {
      let strategy = paths[startingTunnel].strategies[nextTarget].split(',');
      let exhausted = false;

      for (let s = 1; s < strategy.length; s++) {
        runningCost++;
        permutationsToRun[permutationKey].maxValue += runningValue;

        if (runningCost == 30) {
          exhausted = true;
          break;
        }
      }

      if (exhausted) {
        break;
      }
    }

    runningCost++;
    permutationsToRun[permutationKey].maxValue += runningValue;

    if (nextTarget) {
      opened.push(nextTarget);
      runningValue += paths[nextTarget].flow;
      startingTunnel = nextTarget;
    }
  }
  return permutationsToRun[permutationKey].maxValue;
}

function runPermutations(permutationsToRun) {
  let highestValue = 0;
  let highestValueKey = '';

  let test = Object.keys(permutationsToRun);

  [].forEach.call(test, function (permutationKey) {
    let value = simulatePermutation(permutationKey, permutationsToRun);

    if (value > highestValue) {
      highestValue = value;
      highestValueKey = permutationKey;
    }
  });

  return [highestValue, highestValueKey];
}

async function openValves() {
  await fileUtil.fileReader('/day16_input.txt', (input) => {
    let [valveStr, tunnelStr] = input.split(';');

    let valveName = valveStr.match(valveReg)[0];
    let valveFlow = parseInt(valveStr.match(/[0-9]+/g)[0], 10);
    let tunnels = tunnelStr.match(valveReg);

    let path = {
      name: valveName,
      flow: valveFlow,
      tunnels: tunnels,
    };

    paths[valveName] = path;

    if (valveFlow > 0) {
      importantTunnels.push(valveName);
    }
  });

  console.log('generating maps.....');
  mapPathsToImportantTunnels();
  console.log('permuting.....');
  // [].forEach.call(importantTunnels, function (importantTunnel) {
  //   let strategy = paths[STARTING_TUNNEL].strategies[importantTunnel];
  //   let time = 30 - strategy.split(',').length + 1;
  //   let flowValue = paths[importantTunnel].flow;

  //   console.log(`${strategy} = ${time} * ${flowValue} = ${time * flowValue}`);
  // });

  function synthesizeBinaryTreeSequence(startingTunnel, tunnelsRemaining, remainingTime) {
    let options = {
      shortestTime: '',
      largestGain: '',
    };

    let shortestTime = remainingTime;
    let largestGain = 0;

    [].forEach.call(tunnelsRemaining, function (tunnel) {
      let strategy = paths[startingTunnel].strategies[tunnel];
      let timeUsed = strategy.split(',').length;
      let timePotential = remainingTime - timeUsed;
      let flowValue = paths[tunnel].flow;
      let potentialValue = timePotential * flowValue;

      if (potentialValue > largestGain && timeUsed < remainingTime) {
        largestGain = potentialValue;
        options.largestGain = {
          key: tunnel,
          timeUsed: timeUsed,
          potentialValue: largestGain,
        };
      }

      if (timeUsed < shortestTime && timeUsed < remainingTime) {
        shortestTime = timeUsed;
        options.shortestTime = {
          key: tunnel,
          timeUsed: timeUsed,
          potentialValue: potentialValue,
        };
      }
    });

    let chosenShortest = options.shortestTime
      ? synthesizeBinaryTreeSequence(
          options.shortestTime.key,
          tunnelsRemaining.filter((t) => t != options.shortestTime.key),
          remainingTime - options['shortestTime'].timeUsed,
        )
      : null;

    let chosenLargest = options.largestGain
      ? synthesizeBinaryTreeSequence(
          options.largestGain.key,
          tunnelsRemaining.filter((t) => t != options.largestGain.key),
          remainingTime - options['largestGain'].timeUsed,
        )
      : null;

    return {
      current: startingTunnel,
      shortestTime: chosenShortest,
      largestGain: chosenLargest,
    };
  }

  function synthesizeBinaryTreeSequence2(startingTunnel, tunnelsRemaining, remainingTime) {
    let info = {};

    [].forEach.call(tunnelsRemaining, function (tunnel) {
      let strategy = paths[startingTunnel].strategies[tunnel];
      let timeUsed = strategy.split(',').length;
      let timePotential = remainingTime - timeUsed;
      let flowValue = paths[tunnel].flow;
      let potentialValue = timePotential * flowValue;

      info[tunnel] = {
        key: tunnel,
        timeUsed: timeUsed,
        potentialValue: potentialValue,
      };
    });

    let subset = Math.min(tunnelsRemaining.length, 2);

    let infoSet = Object.values(info);

    let shortestTimes = infoSet
      .sort((a, b) => {
        return a.timeUsed - b.timeUsed;
      })
      .slice(0, subset);

    let largestGains = infoSet
      .sort((a, b) => {
        return b.potentialValue - a.potentialValue;
      })
      .slice(0, subset);

    let chosenShortSubset = shortestTimes.map((i) => {
      return synthesizeBinaryTreeSequence2(
        i.key,
        tunnelsRemaining.filter((t) => t != i.key),
        remainingTime - i.timeUsed,
      );
    });
    let chosenShortest = subset > 0 ? chosenShortSubset : null;

    let chosenLargestSubset = largestGains.map((i) => {
      return synthesizeBinaryTreeSequence2(
        i.key,
        tunnelsRemaining.filter((t) => t != i.key),
        remainingTime - i.timeUsed,
      );
    });
    let chosenLargest = subset > 0 ? chosenLargestSubset : null;

    return {
      current: startingTunnel,
      shortestTimes: chosenShortest,
      largestGains: chosenLargest,
    };
  }

  function generateSequencesFromTree(sequenceTree, field, sequence) {
    let nextTunnel = sequenceTree[field];
    let nextSequence = [...sequence];
    if (nextTunnel == null) {
      let key = sequence.toString();
      sequencePermutations[key] = sequence;
      return;
    } else {
      nextSequence.push(nextTunnel.current);
      generateSequencesFromTree(nextTunnel, 'largestGain', nextSequence);
      generateSequencesFromTree(nextTunnel, 'shortestTime', nextSequence);
    }
  }

  function generatePermutationHash(sequenceTree) {
    generateSequencesFromTree(sequenceTree, 'largestGain', [STARTING_TUNNEL]);
    generateSequencesFromTree(sequenceTree, 'shortestTime', [STARTING_TUNNEL]);
  }

  let sequencePermutations2 = {};

  function generateSequencesFromTree2(sequenceTree, field, sequence) {
    let nextTunnels = sequenceTree[field];
    let nextSequence = [...sequence];
    if (nextTunnels == null) {
      let key = sequence.toString();
      sequencePermutations2[key] = sequence;
      return;
    } else {
      [].forEach.call(nextTunnels, function (next) {
        generateSequencesFromTree2(next, 'largestGains', [...nextSequence].concat(next.current));
      });
      [].forEach.call(nextTunnels, function (next) {
        generateSequencesFromTree2(next, 'shortestTimes', [...nextSequence].concat(next.current));
      });
    }
  }

  function generatePermutationHash2(sequenceTree) {
    [].forEach.call(sequenceTree.largestGains, function (next) {
      generateSequencesFromTree2(next, 'largestGains', [STARTING_TUNNEL]);
    });
    [].forEach.call(sequenceTree.shortestTimes, function (next) {
      generateSequencesFromTree2(next, 'shortestTimes', [STARTING_TUNNEL]);
    });
  }

  let sequenceTree = synthesizeBinaryTreeSequence(STARTING_TUNNEL, importantTunnels, 30);
  let sequencePermutations = {};

  // let sequenceTree2 = synthesizeBinaryTreeSequence2(STARTING_TUNNEL, importantTunnels, 30);
  // console.log(sequenceTree2);

  console.log(sequenceTree);
  generatePermutationHash(sequenceTree);

  let permutationToTry = {};

  [].forEach.call(Object.keys(sequencePermutations), function (sequenceKey) {
    sequencePermutations[sequenceKey].shift();

    permutationToTry[sequenceKey] = {
      sequence: sequencePermutations[sequenceKey],
      maxValue: 0,
    };
  });

  console.log(runPermutations(permutationToTry));

  // Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
  // Valve BB has flow rate=13; tunnels lead to valves CC, AA
  // Valve CC has flow rate=2; tunnels lead to valves DD, BB
  // Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
  // Valve EE has flow rate=3; tunnels lead to valves FF, DD
  // Valve FF has flow rate=0; tunnels lead to valves EE, GG
  // Valve GG has flow rate=0; tunnels lead to valves FF, HH
  // Valve HH has flow rate=22; tunnel leads to valve GG
  // Valve II has flow rate=0; tunnels lead to valves AA, JJ
  // Valve JJ has flow rate=21; tunnel leads to valve II

  // AA(0) -> DD(20), II(0), BB(13)
  // BB(13) -> CC(2), AA(0)
  // CC(2) -> DD(20), BB(0)
  // DD(20) -> CC(2), AA(0), EE(3)
  // EE(3) -> FF(0), DD(20)
  // FF(3) -> EE(3), GG(0)
  // GG(0) -> FF(3), HH(22)
  // HH(22) -> GG(0)
  // II(0) -> AA(0), JJ(21)
  // JJ(21) -> II(0)

  /*
   *         ___________EE -- FF
   * AA -- DD -----            \-- GG
   * |  \- II--JJ |                 \-- HH
   * |  \- BB --- CC
   *  \____|
   */

  //Valve RO has flow rate=0; tunnels lead to valves AA, TC
  //Valve AA has flow rate=0; tunnels lead to valves RO, EI, VJ, VQ, DZ
  //CG,RC,GJ,QO,AJ,WI,VD,ZR,PI,FR,LM,KU,FV,AX,OF
  // Valve CG has flow rate=10; tunnels lead to valves TI, SU, RV, FF, QX
  // Valve RC has flow rate=18; tunnels lead to valves EQ, WR, AD
  // Valve GJ has flow rate=21; tunnels lead to valves TG, YJ, EU, AZ, ZJ
  // Valve QO has flow rate=24; tunnels lead to valves MF, ER
  // Valve AJ has flow rate=12; tunnels lead to valves QX, JW, TR, MK
  // Valve VD has flow rate=17; tunnels lead to valves TR, VS, JI, GQ, VO
  // Valve ZR has flow rate=11; tunnels lead to valves KX, AZ, ET, LN, XO
  // Valve WI has flow rate=13; tunnels lead to valves XO, ZJ, ZL
  // Valve PI has flow rate=4; tunnels lead to valves BK, KX, VQ, EU, AV
  // Valve FR has flow rate=22; tunnels lead to valves ZK, TF
  // Valve LM has flow rate=3; tunnels lead to valves YI, SU, UJ, VY, HF
  // Valve KU has flow rate=9; tunnels lead to valves XL, TC, TF, VY, YW
  // Valve FV has flow rate=23; tunnels lead to valves KV, TX
  // Valve AX has flow rate=5; tunnels lead to valves TG, AV, HP
  // Valve OF has flow rate=19; tunnel leads to valve KV

  // AA,EI,RV,CG = 27 * 10 = 270
  // AA,VQ,PI,BK,AD,RC = 25 * 18 = 450
  // AA,VQ,PI,EU,GJ = 26 * 21 = 546
  // AA,DZ,VO,VD,GQ,MF,QO = 24 * 24 = 576
  // AA,EI,RV,CG,QX,AJ = 25 * 12 = 300
  // AA,EI,RV,CG,FF,ZL,WI = 24 * 13 = 312
  // AA,DZ,VO,VD = 27 * 17 = 459
  // AA,VQ,PI,KX,ZR = 26 * 11 = 286
  // AA,VQ,PI = 28 * 4 = 112
  // AA,RO,TC,KU,TF,FR = 25 * 22 = 550
  // AA,VJ,UJ,LM = 27 * 3 = 81
  // AA,RO,TC,KU = 27 * 9 = 243
  // AA,VQ,PI,BK,AD,RC,WR,TX,FV = 22 * 23 = 506
  // AA,VQ,PI,AV,AX = 26 * 5 = 130
  // AA,VQ,PI,BK,AD,RC,WR,TX,FV,KV,OF = 20 * 19 = 380
  // ['RC', 'GJ', 'QO', 'FR', 'FV'];
  // ['CG', 'AJ', 'WI', 'VD', 'ZR', 'PI', 'LM', 'KU', 'AX', 'OF'];

  //DD BB JJ HH EE CC
}

openValves();
