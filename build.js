const path = require("path");
const fs = require("fs");
const child_process = require("child_process");
const esbuild = require("esbuild");
const tsc = path.join(".", "node_modules", ".bin", "tsc");

const distDir = path.join(".", "dist");
const outDir = path.join(".", "out");

const webFiles = [
    path.join(".", "src", "index.html"),
    path.join(".", "src", "style.css"),
    path.join(".", "src", "favicon.ico"),
];

function clean() {
    [distDir, outDir].forEach((dir) => {
        fs.rmSync(dir, { force: true, recursive: true });
        fs.mkdirSync(dir);
    });
}

function buildTypescript() {
    child_process.execSync(`${tsc} --project tsconfig.json`);
}

function copyWeb() {
    webFiles.forEach((file) => fs.copyFileSync(file, path.join(outDir, path.basename(file))));
}

function bundle() {
    esbuild.buildSync({
        entryPoints: [path.join(distDir, "index.js")],
        bundle: true,
        outfile: path.join(outDir, "index.js"),
    });
}

clean();
buildTypescript();
copyWeb();
bundle();
