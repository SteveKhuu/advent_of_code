const fsPromises = require('fs').promises;
const path = require('path');

const fileReader = async (filepath, callback, denominator = '\n') => {
  const data = await fsPromises
    .readFile(__dirname + '/../' + filepath)
    .catch((err) => console.error('Failed to read file', err));

  let rawData = data.toString();
  let fileLines = rawData.split(denominator);

  [].forEach.call(fileLines, function (input, index) {
    callback(input, (index == fileLines.length - 1));
  });
};

exports.fileReader = fileReader;
