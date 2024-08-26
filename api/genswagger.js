const fs = require("fs");

// Check if the file source is provided as a command-line argument
const fileSourceArgIndex = process.argv.indexOf("--fileSource");
const fileSource = fileSourceArgIndex !== -1 ? process.argv[fileSourceArgIndex + 1] : null;

if (!fileSource) {
  console.error("Please provide a valid file source using --fileSource");
  process.exit(1);
}

const filePath = "docs/swagger.js";
const originalContent = fs.readFileSync(filePath, "utf8");

const separator = "//separator";
const separatorIndex = originalContent.indexOf(separator);

if (separatorIndex === -1) {
  console.error("Separator not found in the original content");
  process.exit(1);
}

function getFirstStringFromString(inputString) {
  const match = inputString.match(/(\w+List)/);
  return match ? match[1] : "";
}

const fileContent = fs.readFileSync(fileSource, "utf8");
const getListString = getFirstStringFromString(fileContent);
const isListExist = originalContent.includes(getListString);
// console.log(getListString, isListExist);
// process.exit(1);

if (!isListExist) {
  const updatedContent = originalContent.slice(0, separatorIndex) + fileContent + originalContent.slice(separatorIndex);

  fs.writeFileSync(filePath, updatedContent, "utf8");
  console.log("Content appended successfully!");
}
