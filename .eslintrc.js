module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
	"indent": 0,
	"no-tabs": 0,
	"no-mixed-spaces-and-tabs": 0,
	"brace-style": 0,
	"no-multiple-empty-lines": 0,
	"no-new": 0,
	"no-new-object": 0,
	"no-unused-vars": 0,
	"semi": 0,
	"eol-last": 0,
	"space-infix-ops": 0,
	"no-trailing-spaces": 0,
	"quotes": 0,
	"no-undef": 0,
	"spaced-comment": 0,
	"no-caller": 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
