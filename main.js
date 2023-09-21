const { app, BrowserWindow } = require("electron");
require("update-electron-app")();

const path = require("node:path");
const { dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const ProgressBar = require("electron-progressbar");

autoUpdater.autoDownload = false;

autoUpdater.checkForUpdates();

let progressBar;

/* 업데이트가 가능한지 확인하는 부분이다.
업데이트가 가능한 경우 팝업이 뜨면서 업데이트를 하겠냐고 묻는다.
Update를 클릭하면 업데이트 가능한 파일을 다운로드 받는다. */
autoUpdater.on("update-available", () => {
  dialog
    .showMessageBox({
      type: "info",
      title: "Update available",
      message:
        "A new version of Project is available. Do you want to update now?",
      buttons: ["Update", "Later"],
    })
    .then((result) => {
      const buttonIndex = result.response;

      if (buttonIndex === 0) autoUpdater.downloadUpdate();
    });
});

/* progress bar가 없으면 업데이트를 다운받는 동안 사용자가 그 내용을 알 수 없기 때문에
progress bar는 꼭 만들어준다. */
autoUpdater.once("download-progress", (progressObj) => {
  progressBar = new ProgressBar({
    text: "Downloading...",
    detail: "Downloading...",
  });

  progressBar
    .on("completed", function () {
      console.info(`completed...`);
      progressBar.detail = "Task completed. Exiting...";
    })
    .on("aborted", function () {
      console.info(`aborted...`);
    });
});

// 업데이트를 다운받고 나면 업데이트 설치 후 재시작을 요청하는 팝업이 뜬다.
autoUpdater.on("update-downloaded", () => {
  progressBar.setCompleted();
  dialog
    .showMessageBox({
      type: "info",
      title: "Update ready",
      message: "Install & restart now?",
      buttons: ["Restart", "Later"],
    })
    .then((result) => {
      const buttonIndex = result.response;

      if (buttonIndex === 0) autoUpdater.quitAndInstall(false, true);
    });
});

const createWinddow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1200,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // dirname 은 실행중인 루트 경로를 가리킨다.
      //path.join 여러 경로 세그먼트를 함께 결합하여 모든 플랫폼에서 작동하는 경로 문자열을 생성
    },
  });
  // win.setFullScreen;
  // win.kiosk(true);
  // win.on("leave-full-screen", () => {
  //   win.setFullScreen(true);
  //   this.fullsc;
  // });
  // win.on("unmaximize", () => {
  //   win.setFullScreen(true);
  // });
  // win.on("blur", () => {
  //   win.setFullScreen(true);
  // });
  win.loadFile("index.html");
};
// server {
//         server_name info.android_fms.com;

//         location / {
//           root /var/www/html/static;
//           index index.html;
//   }
// }

app.whenReady().then(() => {
  createWinddow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWinddow();
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
});
