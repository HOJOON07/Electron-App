const { app, BrowserWindow } = require("electron");
require("update-electron-app")();

const path = require("node:path");

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

app.whenReady().then(() => {
  createWinddow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWinddow();
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
});
