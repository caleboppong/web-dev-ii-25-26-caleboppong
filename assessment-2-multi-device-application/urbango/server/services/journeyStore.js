const fs = require("fs");
const path = require("path");

const storageDirectory = path.join(__dirname, "..", "storage");
const storageFile = path.join(storageDirectory, "journeys.json");

function ensureStorage() {
  if (!fs.existsSync(storageDirectory)) {
    fs.mkdirSync(storageDirectory, { recursive: true });
  }

  if (!fs.existsSync(storageFile)) {
    fs.writeFileSync(storageFile, "[]", "utf8");
  }
}

function readJourneys() {
  ensureStorage();

  try {
    return JSON.parse(fs.readFileSync(storageFile, "utf8"));
  } catch {
    return [];
  }
}

function writeJourneys(journeys) {
  ensureStorage();
  fs.writeFileSync(storageFile, JSON.stringify(journeys, null, 2), "utf8");
}

module.exports = {
  readJourneys,
  writeJourneys
};
