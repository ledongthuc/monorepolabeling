const core = require('@actions/core');
const github = require('@actions/github');
const { minimatch } = require('minimatch');

try {
  const matchingPatterns = core.getInput('matching-patterns');
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  const fileChanges = core.getInput('file-changes').split(" ");

  const matchedLabels = matchPattern(matchingPatterns, fileChanges, payload)

  core.setOutput("labels", JSON.stringify(matchedLabels));
} catch (error) {
  core.setFailed(error.message);
}

function matchPattern(matchingPatterns, fileChanges ,payload) {
  console.log(`INPUT: patterns: ${matchingPatterns}`);
  console.log(`ENV: payload: ${payload}`);
  let parsedMatchingPatterns = matchingPatterns.split(/\r?\n/).map((pair) => {
    const pairArr = pair.trim().split(":");
    const pattern = pairArr[0];
    const label = pairArr[1];
    return { pattern, label }
  });

  console.log(`DEBUG: fileChanges: ${fileChanges}`);
  if (!!!fileChanges) {
    return [];
  }

  let matchedLabels = fileChanges.map((filePath) => {
    const matchedPattern = parsedMatchingPatterns.find((matchingPattern) => {
		return minimatch(filePath, matchingPattern.pattern);
	})
	return matchedPattern
  }).filter((pattern) => {
	  return pattern !== undefined;
  }).map((pattern) => {
	  return pattern.label;
  })

  matchedLabels = matchedLabels.filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
  });
  console.log(`OUTPUT: labels: ${matchedLabels}`);
  return matchedLabels
}
module.exports = { matchPattern };
