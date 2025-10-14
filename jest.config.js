module.exports = {
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  collectCoverageFrom: [
    "**/*.ts",
    "!**/node_modules/**",
    "!**/dist/**",
    "!esbuild.config.mjs",
    "!version-bump.mjs"
  ],
  moduleNameMapper: {
    "^obsidian$": "./__mocks__/obsidian.js"
  },
  transform: {
    "^.+\\.ts$": "babel-jest"
  }
}
