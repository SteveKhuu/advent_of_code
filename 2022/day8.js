const fileUtil = require('./common/filereader');

function getScenicScoreBackwards(trees, treeHeight) {
  let scenicScore = 0;

  for (let b = trees.length - 1; b >= 0; b--) {
    scenicScore++;

    if (trees[b] >= treeHeight) {
      break;
    }
  }

  return scenicScore;
}

function getScenicScoreForwards(trees, treeHeight) {
  let scenicScore = 0;

  for (let f = 0; f < trees.length; f++) {
    scenicScore++;

    if (trees[f] >= treeHeight) {
      break;
    }
  }

  return scenicScore;
}

async function getVisibleTrees() {
  let totalVisibleTrees = 0;
  let maxScenicScore = 0;
  let treeGrid = [];

  //Init Grid
  await fileUtil.fileReader('/day8_input.txt', (input) => {
    let treeRow = input
      .split('')
      .map((height) => ({ height: parseInt(height, 10), scenicScore: 0 }));

    treeGrid.push(treeRow);
  });

  [].forEach.call(treeGrid, function (treeRow, treeX) {
    [].forEach.call(treeRow, function (tree, treeY) {
      let treeHeight = tree.height;

      let leftTrees = treeGrid[treeX].slice(0, treeY);
      let leftTreeHeights = leftTrees.map((tree) => tree.height);

      let rightTrees = treeGrid[treeX].slice(treeY + 1);
      let rightTreeHeights = rightTrees.map((tree) => tree.height);

      let topTrees = treeGrid.slice(0, treeX).map((treeRow) => treeRow[treeY]);
      let topTreeHeights = topTrees.map((tree) => tree.height);

      let bottomTrees = treeGrid.slice(treeX + 1).map((treeRow) => treeRow[treeY]);
      let bottomTreeHeights = bottomTrees.map((tree) => tree.height);

      //Part 1, get visible trees
      if (
        Math.max(...leftTreeHeights) < treeHeight ||
        Math.max(...topTreeHeights) < treeHeight ||
        Math.max(...rightTreeHeights) < treeHeight ||
        Math.max(...bottomTreeHeights) < treeHeight
      ) {
        totalVisibleTrees++;
      }

      //Part 2, get scenic score
      let leftScenicScore = getScenicScoreBackwards(leftTreeHeights, treeHeight);
      let rightScenicScore = getScenicScoreForwards(rightTreeHeights, treeHeight);
      let topScenicScore = getScenicScoreBackwards(topTreeHeights, treeHeight);
      let bottomScenicScore = getScenicScoreForwards(bottomTreeHeights, treeHeight);

      tree.scenicScore = leftScenicScore * rightScenicScore * topScenicScore * bottomScenicScore;

      if (tree.scenicScore > maxScenicScore) {
        maxScenicScore = tree.scenicScore;
      }
    });
  });

  console.log(totalVisibleTrees);
  console.log(maxScenicScore);
}

getVisibleTrees();
