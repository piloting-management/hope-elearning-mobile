module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "single"],
    "prettier/prettier": [
      "error",
      {
        "semi": true,
        "singleQuote": true,
        "tabWidth": 2,
        "trailingComma": "es5"
      }
    ]
  }
}
