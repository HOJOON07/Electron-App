const dotenv = require("dotenv");
dotenv.config();
const Token = process.env.GITHUB_TOKEN;

module.exports = {
  packagerConfig: {
    asar: true,
  },
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "HOJOON07",
          name: "Electron-App",
        },
        prerelease: false,
        draft: true,
        authToken: Token,
      },
    },
  ],
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
};
