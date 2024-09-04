const { matchPattern } = require("../index.js");

describe("matchPattern", () => {
  test("test", () => {
    const matchingPatterns = `/file/a/**:serviceA
/file/b/**:serviceB`;
    const fileChanges = [
      "/file/a/name.txt",
      "/file/a/age.txt",
      "/file/b/name.txt",
      "/file/c/name.txt",
	];
    const labels = matchPattern(matchingPatterns, fileChanges);
    expect(labels).toStrictEqual(['serviceA', 'serviceB']);
  });
});
