const { open } = require('fs/promises');
const fileUtil = require('./common/filereader');

let valveReg = /[A-Z]{2}/g;
let paths = {};

let importantTunnels = [];
let importantTunnelPermutations = {};

const STARTING_TUNNEL = 'AA';

function permutator(list) {
  let results = [];

  function permute(arr, memo) {
    let cur;
    memo = memo || [];

    for (let i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }

    return results;
  }

  permute(list);

  return results;
}

function collectPermutations(left, right) {
  let permutations = {};

  [].forEach.call(right, function (combination) {
    let results = left.concat(combination);
    let key = results.toString();
    // importantTunnelPermutations[`${key}`] = {
    //   sequence: result,
    //   maxValue: 0,
    // };
    permutations[`${key}`] = {
      sequence: result,
      maxValue: 0,
    };
  });

  return permutations;
}

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
        // console.log(`Shortest path for ${source} to ${target} ${path.join(',')}`);
        return path.join(',');
      }
      predecessor[v] = u;
      queue.push(v);
    }
  }
}

function determineShortestPath2(path, target) {
  return shortestPath(path.name, target);
}

function mapPathsToImportantTunnels() {
  [].forEach.call(Object.values(paths), function (path) {
    let strategies = {};

    [].forEach.call(importantTunnels, function (tunnel) {
      // strategies[tunnel] = determineShortestPath(path, tunnel);
      strategies[tunnel] = determineShortestPath2(path, tunnel);
      path, tunnel;
    });

    paths[path.name].strategies = strategies;
  });
}

function simulatePermutation(permutationKey) {
  let startingTunnel = STARTING_TUNNEL;
  let tunnelSequence = [...importantTunnelPermutations[permutationKey].sequence];

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
        importantTunnelPermutations[permutationKey].maxValue += runningValue;

        // console.log(`== Minute ${runningCost} ==`);
        // console.log(`You move to valve ${strategy[s]}.`);
        // console.log(' ');
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
    importantTunnelPermutations[permutationKey].maxValue += runningValue;
    // console.log(`== Minute ${runningCost} ==`);

    if (nextTarget) {
      // console.log(`You open valve ${nextTarget}.`);
      opened.push(nextTarget);
      runningValue += paths[nextTarget].flow;
      startingTunnel = nextTarget;
    }
    console.log(' ');
  }

  // console.log(
  //   `Sequence ${permutationKey} has cost of ${runningCost} and reward of ${importantTunnelPermutations[permutationKey].maxValue}`,
  // );

  return importantTunnelPermutations[permutationKey].maxValue;
}

function runPermutations(permutationsToRun) {
  let highestValue = 0;
  let highestValueKey = '';

  //let test = Object.keys(importantTunnelPermutations); //['DD,BB,JJ,HH,EE,CC']; //Object.keys(importantTunnelPermutations)

  let test = Object.keys(permutationsToRun);

  [].forEach.call(test, function (permutationKey) {
    let value = simulatePermutation(permutationKey);

    if (value > highestValue) {
      highestValue = value;
      highestValueKey = permutationKey;
    }
  });

  //DD, BB, JJ, HH, EE, CC
  // console.log(`Best sequence is ${highestValueKey} with a value of ${highestValue}`);
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

  // console.log(`permuting..... ${importantTunnels.toString()}`);

  console.log('generating maps.....');
  mapPathsToImportantTunnels();
  console.log('permuting.....');
  [].forEach.call(importantTunnels, function (importantTunnel) {
    let strategy = paths[STARTING_TUNNEL].strategies[importantTunnel];
    let time = 30 - strategy.split(',').length + 1;
    let flowValue = paths[importantTunnel].flow;

    console.log(`${strategy} = ${time} * ${flowValue} = ${time * flowValue}`);
  });

  let left = permutator(['RC', 'GJ', 'QO', 'FR', 'FV']);
  let right = permutator(['CG', 'AJ', 'WI', 'VD', 'ZR', 'PI', 'LM', 'KU', 'AX', 'OF']);

  let best = [];

  [].forEach.call(left, function (combination) {
    let permutationsToRun = collectPermutations(combination, right);
    let [highestValue, highestValueKey] = runPermutations(permutationsToRun);

    if (highestValue > best[0]) {
      best = [highestValue, highestValueKey];
    }
  });
  // collectPermutations(left, right);
  // console.log(paths);
  // runPermutations();

  function findNextTunnel(tunnels, previousPath) {
    let nextTunnel;

    for (let t = 0; t < tunnels.length; t++) {
      if (tunnels[t] != previousPath) {
        nextTunnel = tunnels[t];
        break;
      }
    }

    return nextTunnel;
  }

  function report(m) {
    console.log(`== Minute ${m + 1} ==`);
    let openedValves = Object.keys(opened);
    if (openedValves.length == 0) {
      console.log('No valves are open.');
    } else {
      console.log(
        `Valve(s) ${openedValves.toString()} is/are open, releasing ${currentPressure} pressure.`,
      );
    }
  }

  function part1() {
    let previousPath;
    let node = paths['AA'];

    for (let m = 0; m < 30; m++) {
      report(m);
      totalPressure += currentPressure;

      // For current node, open valves by flow if reachable

      if (!opened.hasOwnProperty(node.name) && node.flow > 0) {
        opened[node.name] = true;
        currentPressure += node.flow;
        console.log(`You open valve ${node.name}.`);
      } else {
        //next tunnel
        let nextPath = findNextTunnel(node.tunnels, previousPath);

        if (nextPath) {
          previousPath = node.name;
          node = paths[nextPath];
          console.log(`You move to valve ${nextPath}.`);
        } else {
          console.log(`You did nothing.`);
        }
      }
      console.log(' ');
    }

    console.log(`Final pressure: ${totalPressure}`);
  }

  // part1();

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
}

openValves();
