const fs = require("fs");
const path = require("path");

function removeComments(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "$1")
    .replace(/^\s*\n/gm, "");
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const cleanContent = removeComments(content);
  fs.writeFileSync(filePath, cleanContent);
}

function walkDir(dir, fileTypes) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.includes("node_modules")) {
      walkDir(filePath, fileTypes);
    } else if (fileTypes.some((type) => file.endsWith(type))) {
      processFile(filePath);
    }
  });
}

const sourceDir = process.argv[2] || path.join(__dirname, "..");
const fileTypes = [".js", ".ts", ".jsx", ".tsx"];

console.log("Removing comments from files...");
walkDir(sourceDir, fileTypes);
console.log("Comments removed successfully!");
