const path = require("path");
const os = require("os");
const fs = require("fs");
const child_process = require("child_process");

const tsc = path.join(".", "node_modules", ".bin", "tsc");

const distDir = path.join(".", "dist");
const webFiles = [
    path.join(".", "src", "index.html"),
    path.join(".", "src", "style.css"),
    path.join(".", "src", "favicon.ico"),
];

function cleanDist() {
    fs.rmSync(distDir, { force: true, recursive: true });
    fs.mkdirSync(distDir);
}

function buildTypescript() {
    child_process.execSync(`${tsc} --project tsconfig.json`);
}

function copyWeb() {
    webFiles.forEach((file) => fs.copyFileSync(file, path.join(distDir, path.basename(file))));
}

cleanDist();
buildTypescript();
copyWeb();
