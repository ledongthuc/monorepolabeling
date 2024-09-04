const core = require('@actions/core');
const github = require('@actions/github');
const { minimatch } = require('minimatch');

try {
  const matchingPatterns = core.getInput('matching-patterns');
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  const fileChanges = [];

  const matchedLabels = matchPattern(matchingPatterns, payload)

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
  console.log('DEBUG 1:', parsedMatchingPatterns);
  console.log('DEBUG 1.1:', fileChanges);
  let matchedLabels = fileChanges.map((filePath) => {
    const matchedPattern = parsedMatchingPatterns.find((matchingPattern) => {
		console.log('DEBUG 1.1.1:', matchingPattern.pattern, filePath, minimatch(matchingPattern.pattern, filePath));
		return minimatch(filePath, matchingPattern.pattern);
	})
	return matchedPattern
  }).filter((pattern) => {
	  return pattern !== undefined;
  }).map((pattern) => {
	  return pattern.label;
  })
  console.log('DEBUG 2:', matchedLabels);
  matchedLabels = matchedLabels.filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
  });
  console.log('DEBUG 3:', matchedLabels);
  console.log(`OUTPUT: labels: ${matchedLabels}`);
  return matchedLabels
}
module.exports = { matchPattern };
