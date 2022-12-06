const fileUtil = require('./common/filereader');

async function getStartOfPacketIndicator(targetLength) {
  let characterIndex = 0;

  await fileUtil.fileReader('/day6_input.txt', (input) => {
    let foundMarker = false;

    while (!foundMarker) {
      let markerList = [...Array(targetLength).keys()];
      [].forEach.call(markerList, function (_, markerIndex) {
        markerList[markerIndex] = input.charAt(characterIndex + markerIndex);
      });

      let uniqueMarkerSet = [...new Set(markerList)];

      if (uniqueMarkerSet.length == targetLength) {
        foundMarker = true;
        console.log(characterIndex + targetLength);
      }

      characterIndex++;
    }
  });
}

getStartOfPacketIndicator(4);
getStartOfPacketIndicator(14);
