const randomizeArray = (inputArray) => {
  // Used code from this stackoverflow reply: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  const result = [...inputArray];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 2));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
};

class Cambridgify {

  scrambleText (text) {
    return text.split(' ').map(this.scrambleWord).join(' ');
  }

  scrambleWord (word) {
    if (word.length > 3) {
      const firstLetter = word.charAt(0);
      const middleLetters = word.split('').slice(1, word.length - 1);
      const lastLetter = word.charAt(word.length - 1);
      const scrambledLetters = randomizeArray(middleLetters);
      return `${firstLetter}${scrambledLetters.join('')}${lastLetter}`;
    }
    return word;
  }

}

module.exports = new Cambridgify();
