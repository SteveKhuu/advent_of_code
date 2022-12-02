const fsPromises = require('fs').promises;
const path = require('path');

const fileReader = async (filepath, callback, denominator = '\n') => {
  const data = await fsPromises
    .readFile(__dirname + '/../' + filepath)
    .catch((err) => console.error('Failed to read file', err));

  let rawData = data.toString();

  [].forEach.call(rawData.split(denominator), function (input) {
    callback(input);
  });
};

exports.fileReader = fileReader;
