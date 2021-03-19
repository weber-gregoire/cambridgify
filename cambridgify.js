const MAX_RETRY = 3;
const CHAR_REGEX = /[A-Za-zÀ-Ÿà-ÿ\s]/;

class Cambridgify {

  scrambleText(inputText) {
    const { text, ponctuationHistogram } = this.extractPonctuation(inputText);
    const scrambledText = text
      .split(' ')
      .map(this.forceScrambleWord.bind(this))
      .join(' ');
    return this.injectPonctuation(scrambledText, ponctuationHistogram);
  }

  scrambleWord(word) {
    if (word.length > 3) {
      const firstLetter = word.charAt(0);
      const middleLetters = word.split('').slice(1, word.length - 1);
      const lastLetter = word.charAt(word.length - 1);
      const scrambledLetters = [...middleLetters.sort(() => Math.random() - 0.5)];
      return `${firstLetter}${scrambledLetters.join('')}${lastLetter}`;
    }
    return word;
  }

  forceScrambleWord(word) {
    let newWord;
    let scrambleCount = 0;
    do {
      newWord = this.scrambleWord(word);
      ++scrambleCount;
    } while (scrambleCount < MAX_RETRY && newWord === word);
    return newWord;
  }

  extractPonctuation(text) {
    const ponctuationHistogram = {};
    const textWithoutPonctuation = [];
    text.split('').forEach((char, index) => {
      if (char.match(CHAR_REGEX)) {
        textWithoutPonctuation.push(char);
      } else {
        ponctuationHistogram[index] = char;
        textWithoutPonctuation.push(' ');
      }
    });
    return {
      text: textWithoutPonctuation.join(''),
      ponctuationHistogram,
    };
  }

  injectPonctuation(text, ponctuationHistogram) {
    return [...Array(text.length).keys()].map((index) => {
      if (ponctuationHistogram[index]) {
        return ponctuationHistogram[index];
      } else {
        return text.charAt(index);
      }
    }).join('');
  }

}

module.exports = new Cambridgify();
