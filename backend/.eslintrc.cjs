module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es2021": true,
    "commonjs": true
  },
  "extends": ["eslint:recommended", "prettier"],
  
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
  },
  "rules": {
    "indent": [
      "error",
      4
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-undef": "off",
  }
};