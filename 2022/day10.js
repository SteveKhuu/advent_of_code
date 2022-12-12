const fileUtil = require('./common/filereader');

async function getSignalStrength(cyclesToQuery) {
  let cycles = Array(300).fill(0);
  let cyclePointer = 0;
  let index = 0;
  let CRT = [];
  let CRTrow = [];
  let spritePosition = 1;

  function moveSprite() {
    if (index > 0) {
      spritePosition += cycles[index - 1];
    }
  }

  function paintCRT() {
    if (index % 40 >= spritePosition - 1 && index % 40 <= spritePosition + 1) {
      CRTrow.push('#');
    } else {
      CRTrow.push('.');
    }
  }

  function flushCRTScreen() {
    if (CRTrow.length == 40) {
      CRT.push(CRTrow);
      CRTrow = [];
    }
  }

  await fileUtil.fileReader('/day10_input.txt', (input) => {
    moveSprite();
    paintCRT();

    if (input.charAt(0) != 'n') {
      let [_, value] = input.split(' ');
      cycles[++cyclePointer] = parseInt(value, 10);
    }

    cyclePointer++;
    index++;

    flushCRTScreen();
  });

  //Finish the remaining cycles
  while (index < cycles.length) {
    moveSprite();
    paintCRT();
    flushCRTScreen();
    index++;
  }
  CRT.push(CRTrow);

  let signalStrength = 0;

  [].forEach.call(cyclesToQuery, function (cycleNumber) {
    signalStrength +=
      cycles
        .slice(0, cycleNumber - 1)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 1) * cycleNumber;
  });

  //Part 1
  console.log(`${signalStrength}`);

  //Part 2
  console.log(CRT.join('\r\n'));
}

getSignalStrength([20, 60, 100, 140, 180, 220]);
