const fileUtil = require('./common/filereader');

class Directory {
  constructor(parent, name) {
    this.parent = parent;
    this.name = name;
    this.children = {};
  }

  getSize() {
    let sum = 0;

    [].forEach.call(Object.values(this.children), function (child) {
      sum += child.getSize();
    });

    return sum;
  }

  cd(target) {
    if (target == '..') {
      return this.parent;
    } else {
      return this.children[target];
    }
  }

  addEntry(child) {
    child.parent = this;
    this.children[child.name] = child;
  }

  toString(indentationLevel = 0) {
    console.log('  '.repeat(indentationLevel) + '/' + this.name);

    [].forEach.call(Object.values(this.children), function (child) {
      child.toString(indentationLevel + 1);
    });
  }

  hasEntry(childName) {
    return this.children.hasOwnProperty(childName);
  }
}

class File {
  constructor(parent, name, size) {
    this.parent = parent;
    this.name = name;
    this.size = size;
  }

  getSize() {
    return this.size;
  }

  toString(indentationLevel) {
    console.log('  '.repeat(indentationLevel) + '/' + this.name);
  }
}

function getTotal(node, limiter) {
  let sum = 0;

  //Only deal with directories. We don't care about files
  if (!node.size) {
    let size = node.getSize();

    if (size <= limiter) {
      sum += size;
    }

    [].forEach.call(Object.values(node.children), function (child) {
      sum += getTotal(child, limiter);
    });
  }

  return sum;
}

function searchForDirectoryWithClosestSize(targetSize, smallestSize, node) {
  if (!node.size) {
    let nodeSize = node.getSize();

    if (nodeSize > targetSize && nodeSize < smallestSize) {
      smallestSize = nodeSize;
    }

    [].forEach.call(Object.values(node.children), function (child) {
      smallestSize = Math.min(
        smallestSize,
        searchForDirectoryWithClosestSize(targetSize, smallestSize, child),
      );
    });
  }

  return smallestSize;
}

async function noSpace() {
  let fileStructure = new Directory(undefined, '/');
  let currentNode = fileStructure;

  await fileUtil.fileReader('/day7_input.txt', (input) => {
    let commandComponents = input.split(' ');

    switch (commandComponents[0]) {
      case '$':
        let target = commandComponents[2];

        if (commandComponents[1] === 'cd' && target != '/') {
          currentNode = currentNode.cd(target);
        }
        break;
      case 'dir':
        let directoryName = commandComponents[1];

        if (!currentNode.hasEntry(directoryName)) {
          let newDirectory = new Directory(currentNode, directoryName);
          currentNode.addEntry(newDirectory);
        } else {
          console.log('visited before');
        }
        break;
      default:
        let [filesize, filename] = commandComponents;
        filesize = parseInt(filesize, 10);

        if (!currentNode.hasEntry(filename)) {
          let newFile = new File(currentNode, filename, filesize);
          currentNode.addEntry(newFile);
        }
    }
  });

  //Part 1
  console.log(getTotal(fileStructure, 100000));

  //Part 2
  let total = 70000000;
  let unusedSpaceNeeded = 30000000;
  let totalSize = fileStructure.getSize();
  let targetFreespaceRequired = unusedSpaceNeeded - (total - totalSize);

  console.log(
    searchForDirectoryWithClosestSize(targetFreespaceRequired, unusedSpaceNeeded, fileStructure),
  );
}

noSpace();
