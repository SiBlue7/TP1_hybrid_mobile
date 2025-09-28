const FILE_NAME = "scores.json";

function isCordovaReady() {
  return (
    typeof window !== "undefined" &&
    window.cordova &&
    window.resolveLocalFileSystemURL
  );
}

function getDataDir() {
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(
      cordova.file.dataDirectory,
      (dir) => resolve(dir),
      reject
    );
  });
}

async function readFileEntry() {
  const dir = await getDataDir();
  return new Promise((resolve, reject) => {
    dir.getFile(FILE_NAME, { create: true }, (file) => resolve(file), reject);
  });
}

async function readScoresCordova() {
  const file = await readFileEntry();
  return new Promise((resolve, reject) => {
    file.file((f) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          resolve(JSON.parse(reader.result || "[]"));
        } catch {
          resolve([]);
        }
      };
      reader.onerror = reject;
      reader.readAsText(f);
    }, reject);
  });
}

async function writeScoresCordova(scores) {
  const file = await readFileEntry();
  return new Promise((resolve, reject) => {
    file.createWriter((writer) => {
      writer.onwriteend = resolve;
      writer.onerror = reject;
      const blob = new Blob([JSON.stringify(scores)], {
        type: "application/json",
      });
      writer.truncate(0);
      writer.onwriteend = () => {
        writer.onwriteend = resolve;
        writer.write(blob);
      };
    }, reject);
  });
}

export async function readScores() {
  if (isCordovaReady()) return readScoresCordova();
  try {
    return JSON.parse(localStorage.getItem("scores") || "[]");
  } catch {
    return [];
  }
}

export async function appendScore(entry) {
  const scores = await readScores();
  scores.push(entry);
  if (isCordovaReady()) {
    await writeScoresCordova(scores);
  } else {
    localStorage.setItem("scores", JSON.stringify(scores));
  }
  return scores;
}

export async function top5() {
  const scores = await readScores();
  return scores
    .sort((a, b) => b.score - a.score || a.timeSec - b.timeSec)
    .slice(0, 5);
}
