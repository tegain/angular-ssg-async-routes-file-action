const core = require("@actions/core");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const makeSureFoldersAreCreated = (filename) => {
  const folders = filename.split(path.sep).slice(0, -1);
  if (folders.length) {
    folders.reduce((last, folder) => {
      const folderPath = last ? last + path.sep + folder : folder;
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`Created folder: ${folderPath}`);
      }
      return folderPath;
    }, "");
  }
};

/**
 * @param data API response data
 * @param {string} responsePath API response routes property path
 * @returns {string} file contents
 */
function getFileContents(data, responsePath) {
  if (typeof data === "string") {
    return data;
  }
  const routesPath =
    responsePath === "null" ? data : resolvePath(responsePath, data);
  if (Array.isArray(routesPath)) {
    return routesPath.join("\n");
  }
  return data;
}

/**
 * @param {string} pathString
 * @param {object} obj
 * @returns {unknown}
 */
function resolvePath(pathString, obj) {
  return pathString.split(".").reduce((p, c) => (p && p[c]) || null, obj);
}

try {
  /** @type {string} */
  const url = core.getInput("url");
  /** @type {'json' | 'text'} */
  const responseType = core.getInput("type");
  /** @type {string} */
  const responsePath = core.getInput("responsePath");
  /** @type {string} */
  const file = core.getInput("file");
  /** @type {boolean} */
  const isDebugMode = core.getInput("debug") === "true";

  console.log(`Fetch data started with`, `url: ${url}`, `file: ${file}`);

  if (!url) {
    core.setFailed("url required");
  }

  if (!file.endsWith(".txt")) {
    core.setFailed('Only ".txt" files are supported');
  }

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        core.setFailed(
          `Fetch to ${url} failed with status: ${response.status}`,
        );
      }
      if (responseType === "json") {
        return response.json();
      }
      return response.text();
    })
    .then((data) => {
      if (isDebugMode) {
        console.log("Current working directory", __dirname);
      }
      makeSureFoldersAreCreated(file);
      fs.writeFileSync(file, getFileContents(data, responsePath));
      console.log(`Successfully saved data from ${url} to ${file}`);
      if (isDebugMode) {
        console.log(fs.readFileSync(file, "utf-8"));
      }
    })
    .catch((error) => core.setFailed(error.message));
} catch (error) {
  core.setFailed(error.message);
}
