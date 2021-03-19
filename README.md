[![Build Status](https://travis-ci.org/weber-gregoire/cambridgify.svg?branch=master)](https://travis-ci.org/weber-gregoire/cambridgify)

# Cambridgify

This is a simple npm package that I created in order to demonstrate that some of the things we see on the internet, and mosty on social networks, might be attractive, but are usually not true.

This one bit of code is used to show that the "study from Cambridge" (that actually do not exists) saying that the human brain do not care about the order of letters in a word as long as the first and last letters are correctly placed is wrong.
The text used to démonstrate that is actually well crafted to make it easy to read. It also use relatively short word to make the scrambling ineficient.

But if you use that code to try, and use long word, you'll be able to experience by yourself that this do not really work.

## How to use

Add the package to your dependencies
```javascript
npm install --save @greggow/cambridgify
```

Include the Cambridgify object
```javascript
const cambridgify = require('@greggow/cambridgify');
```

Use the instance to scramble texts

```javascript
const text = 'According to a researcher at Cambridge University, it doesn\'t matter in what order the letters in a word are, the only important thing is that the first and last letter be at the right place. The rest can be a total mess and you can still read it without problem. This is because the human mind does not read every letter by itself, but the word as a whole.';
const scrambledText = cambridgify.scrambleText(text);
console.log(scrambledText);

/*
Should output something like this (not taht readable uh ? :p ) :
Aidcocrng to a reeescrrah at Cagmbirde Urnivtseyi, it doesn't matetr in what order the ltretes in a word are, the only irtmnpaot tnihg is that the first and last letetr be at the right plaec. The rest can be a total mses and you can still read it wihotut prlemob. This is bescaue the human mnid does not read every lteter by iestfl, but the wrod as a wlhoe.
*/
```
