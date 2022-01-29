const path = require('path')

module.exports = {
  "extends": "./_config/eslint-config-phaser",
  "parserOptions": {
    "project": path.join(__dirname, "./tsconfig.json")
  }
}
