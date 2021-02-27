const chai = require('chai');
const sinonChai = require('sinon-chai');
const { stub } = require('sinon');
const cambridgify = require('../cambridgify');

const { expect } = chai;

chai.use(sinonChai);

const originalScrambleText = cambridgify.scrambleText;
const originalScrambleWord = cambridgify.scrambleWord;
const scrambleTextMock = stub();
const scrambleWordMock = stub();

function testShortWordScrambling(shortWord) {
  for (let i = 0; i < 5; ++i) {
    // When
    const result = cambridgify.scrambleWord(shortWord);

    // Then
    expect(result).to.be.equal(shortWord);
  }
}

function testLongWordScrambling(longWord) {
  for (let i = 0; i < 5; ++i) {
    // When
    const result = cambridgify.scrambleWord(longWord);

    // Then
    expect(result.charAt(0)).to.be.equal(longWord.charAt(0));
    expect(result.charAt(result.length - 1)).to.be.equal(longWord.charAt(longWord.length - 1));
    expect(result.length).to.be.equal(longWord.length);
    expect(result.split('')).to.have.members(longWord.split(''));
  }
}

describe('Cambridgify', () => {

  beforeEach(() => {
    cambridgify.scrambleText = originalScrambleText;
    cambridgify.scrambleWord = originalScrambleWord;
    scrambleTextMock.reset();
    scrambleWordMock.reset();
  });

  describe('scrambleText', () => {

    beforeEach(() => {
      cambridgify.scrambleWord = scrambleWordMock;
    });

    it('Should forward the only word to scrambleWord', () => {
      // Given
      const oneWordText = 'Word';
      const scrambledWord = 'Wrod';
      scrambleWordMock.returns(scrambledWord);

      // When
      const result = cambridgify.scrambleText(oneWordText);

      // Then
      expect(result).to.be.equal(scrambledWord);
      expect(scrambleWordMock).to.have.been.calledOnce;
      expect(scrambleWordMock).to.have.been.calledWith(oneWordText);
    });

    it('Should forward every words to scrambleWord', () => {
      // Given
      const words = [
        ['fermentum', 'fltriciem'],
        ['hendrerit', 'hermentut'],
        ['curabitur', 'cendrerir'],
        ['ultricies', 'uurabitus'],
      ];

      const text = `${words[0][0]} ${words[1][0]} ${words[2][0]} ${words[3][0]}`;
      const expectedResult = `${words[0][1]} ${words[1][1]} ${words[2][1]} ${words[3][1]}`;

      scrambleWordMock.onCall(0).returns(words[0][1]);
      scrambleWordMock.onCall(1).returns(words[1][1]);
      scrambleWordMock.onCall(2).returns(words[2][1]);
      scrambleWordMock.onCall(3).returns(words[3][1]);

      // When
      const result = cambridgify.scrambleText(text);

      // Then
      expect(result).to.be.equal(expectedResult);
      expect(scrambleWordMock.callCount).to.be.equal(4);
      expect(scrambleWordMock).to.have.been.calledWith(words[0][0]);
      expect(scrambleWordMock).to.have.been.calledWith(words[1][0]);
      expect(scrambleWordMock).to.have.been.calledWith(words[2][0]);
      expect(scrambleWordMock).to.have.been.calledWith(words[3][0]);
    });
  });

  describe('scrambleWord', () => {

    it('Should not change word if word length is 1 char', () => {
      // Given
      const shortWord = 'I';

      testShortWordScrambling(shortWord);
    });

    it('Should not change word if word length is 2 chars', () => {
      // Given
      const shortWord = 'Be';

      testShortWordScrambling(shortWord);
    });

    it('Should not change word if word length is 3 chars', () => {
      // Given
      const shortWord = 'Yop';

      testShortWordScrambling(shortWord);
    });

    it('Should scramble middle letters if word length is 4 chars', () => {
      // Given
      const longWord = 'Nope';

      testLongWordScrambling(longWord);
    });

    it('Should scramble middle letters if word length is longer than 4 chars', () => {
      // Given
      const longWord = 'Cambridge';

      testLongWordScrambling(longWord);
    });

    it('Should scramble middle letters if word length is super long', () => {
      // Given
      const veryLongWord = 'pneumonoultramicroscopicsilicovolcanoconiosis';

      testLongWordScrambling(veryLongWord);
    });
  });
});
