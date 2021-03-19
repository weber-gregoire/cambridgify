const chai = require('chai');
const sinonChai = require('sinon-chai');
const { stub } = require('sinon');
const cambridgify = require('../cambridgify');

const { expect } = chai;

chai.use(sinonChai);

const originalScrambleWord = cambridgify.scrambleWord;
const originalForceScrambleWord = cambridgify.forceScrambleWord;
const originalExtractPonctuation = cambridgify.extractPonctuation;
const originalInjectPonctuation = cambridgify.injectPonctuation;

const scrambleWordMock = stub();
const forceScrambleWordMock = stub();
const extractPonctuationMock = stub();
const injectPonctuationMock = stub();

describe('Cambridgify', () => {

  beforeEach(() => {
    cambridgify.scrambleWord = originalScrambleWord;
    cambridgify.forceScrambleWord = originalForceScrambleWord;
    cambridgify.extractPonctuation = originalExtractPonctuation;
    cambridgify.injectPonctuation = originalInjectPonctuation;
    scrambleWordMock.reset();
    forceScrambleWordMock.reset();
    extractPonctuationMock.reset();
    injectPonctuationMock.reset();
  });

  describe('scrambleText', () => {

    beforeEach(() => {
      cambridgify.forceScrambleWord = forceScrambleWordMock;
      cambridgify.extractPonctuation = extractPonctuationMock;
      cambridgify.injectPonctuation = injectPonctuationMock;
    });

    it('Should forward to other functions in correct order with one word', () => {
      // Given
      const input = 'word';
      const extractPonctuationResponse = {
        text: 'word',
        ponctuationHistogram: {},
      };
      const forceScrambleResponse = 'wrod';
      const injectPonctuationResponse = 'word';
      extractPonctuationMock.returns(extractPonctuationResponse);
      forceScrambleWordMock.returns(forceScrambleResponse);
      injectPonctuationMock.returns(injectPonctuationResponse);

      // When
      const result = cambridgify.scrambleText(input);

      // Then
      expect(result).to.be.equal(injectPonctuationResponse);
      expect(extractPonctuationMock).to.have.been.calledOnce;
      expect(extractPonctuationMock).to.have.been.calledWith(input);
      expect(forceScrambleWordMock).to.have.been.calledOnce;
      expect(forceScrambleWordMock).to.have.been.calledWith(extractPonctuationResponse.text);
      expect(injectPonctuationMock).to.have.been.calledOnce;
      expect(injectPonctuationMock).to.have.been.calledWith(forceScrambleResponse);
    });

    it('Should forward to other functions in correct order with multiple words', () => {
      // Given
      const input = 'multiple word';
      const extractPonctuationResponse = {
        text: 'multiple word',
        ponctuationHistogram: {},
      };
      const forceScrambleResponse0 = 'mtilluepe';
      const forceScrambleResponse1 = 'wrod';
      const injectPonctuationResponse = 'multiple word';
      extractPonctuationMock.returns(extractPonctuationResponse);
      forceScrambleWordMock.onCall(0).returns(forceScrambleResponse0);
      forceScrambleWordMock.onCall(1).returns(forceScrambleResponse1);
      injectPonctuationMock.returns(injectPonctuationResponse);

      // When
      const result = cambridgify.scrambleText(input);

      // Then
      expect(result).to.be.equal(injectPonctuationResponse);
      expect(extractPonctuationMock).to.have.been.calledOnce;
      expect(extractPonctuationMock).to.have.been.calledWith(input);
      expect(forceScrambleWordMock).to.have.been.calledTwice;
      expect(forceScrambleWordMock).to.have.been.calledWith('multiple');
      expect(forceScrambleWordMock).to.have.been.calledWith('word');
      expect(injectPonctuationMock).to.have.been.calledOnce;
      expect(injectPonctuationMock).to.have.been.calledWith(
        `${forceScrambleResponse0} ${forceScrambleResponse1}`,
      );
    });
  });

  describe('scrambleWord', () => {

    it('Should not change word if word length is 1 char', () => {
      // Given
      const shortWord = 'I';

      // When
      testShortWordScrambling(shortWord);
    });

    it('Should not change word if word length is 2 chars', () => {
      // Given
      const shortWord = 'Be';

      // When
      testShortWordScrambling(shortWord);
    });

    it('Should not change word if word length is 3 chars', () => {
      // Given
      const shortWord = 'Yop';

      // When
      testShortWordScrambling(shortWord);
    });

    it('Should scramble middle letters if word length is 4 chars', () => {
      // Given
      const longWord = 'Nope';

      // When
      testLongWordScrambling(longWord);
    });

    it('Should scramble middle letters if word length is longer than 4 chars', () => {
      // Given
      const longWord = 'Cambridge';

      // When
      testLongWordScrambling(longWord);
    });

    it('Should scramble middle letters if word length is super long', () => {
      // Given
      const veryLongWord = 'pneumonoultramicroscopicsilicovolcanoconiosis';

      // When
      testLongWordScrambling(veryLongWord);
    });
  });

  describe('forceScrambleWord', () => {

    beforeEach(() => {
      cambridgify.scrambleWord = scrambleWordMock;
    });

    it('Should loop once if word is scrambled on first try', () => {
      // Given
      const input = 'word';
      const scrambleWordResult = 'wrod';
      scrambleWordMock.returns(scrambleWordResult);

      // When
      const result = cambridgify.forceScrambleWord(input);

      // Then
      expect(result).to.be.equal(scrambleWordResult);
      expect(scrambleWordMock).to.have.been.calledOnce;
      expect(scrambleWordMock).to.have.been.calledWith(input);
    });

    it('Should loop twice if word is scrambled on second try', () => {
      // Given
      const input = 'word';
      const scrambleWordResult0 = 'word';
      const scrambleWordResult1 = 'wrod';
      scrambleWordMock.onCall(0).returns(scrambleWordResult0);
      scrambleWordMock.onCall(1).returns(scrambleWordResult1);

      // When
      const result = cambridgify.forceScrambleWord(input);

      // Then
      expect(result).to.be.equal(scrambleWordResult1);
      expect(scrambleWordMock).to.have.been.calledTwice;
      expect(scrambleWordMock).to.have.been.calledWith(input);
    });

    it('Should loop thrice if word is scrambled on thrid try', () => {
      // Given
      const input = 'word';
      const scrambleWordResult0 = 'word';
      const scrambleWordResult2 = 'wrod';
      scrambleWordMock.onCall(0).returns(scrambleWordResult0);
      scrambleWordMock.onCall(1).returns(scrambleWordResult0);
      scrambleWordMock.onCall(2).returns(scrambleWordResult2);

      // When
      const result = cambridgify.forceScrambleWord(input);

      // Then
      expect(result).to.be.equal(scrambleWordResult2);
      expect(scrambleWordMock).to.have.been.calledThrice;
      expect(scrambleWordMock).to.have.been.calledWith(input);
    });

    it('Should loop thrice if word is not scrambled on thrid try', () => {
      // Given
      const input = 'word';
      const scrambleWordResult = 'word';
      scrambleWordMock.returns(scrambleWordResult);

      // When
      const result = cambridgify.forceScrambleWord(input);

      // Then
      expect(result).to.be.equal(scrambleWordResult);
      expect(scrambleWordMock).to.have.been.calledThrice;
      expect(scrambleWordMock).to.have.been.calledWith(input);
    });
  });

  describe('extractPonctuation', () => {

    it('Should return same text and no histogram when ponctuation in input text', () => {
      // Given
      const inputText = 'Some text without anything else than letters';

      // When
      const result = cambridgify.extractPonctuation(inputText);

      // Then
      expect(result.text).to.be.equal(inputText);
      expect(result.ponctuationHistogram).to.deep.equal({});
    });

    it('Should return clean text and histogram when ponctuation in input text', () => {
      // Given
      const inputText = '(Some) text with! a lot[] of & other# things@ than7 lett3rs';
      const expectedText = ' Some  text with  a lot   of   other  things  than  lett rs';
      const expectedHistogram = {
        0: '(',
        5: ')',
        16: '!',
        23: '[',
        24: ']',
        29: '&',
        36: '#',
        44: '@',
        50: '7',
        56: '3',
      };

      // When
      const result = cambridgify.extractPonctuation(inputText);

      // Then
      expect(result.text).to.be.equal(expectedText);
      expect(result.ponctuationHistogram).to.deep.equal(expectedHistogram);
    });
  });

  describe('injectPonctuation', () => {

    it('Should inject chars at given index in string', () => {
      // Given
      const inputText = 'some text  blah  blah ';
      const ponctuation = {
        10: '(',
        15: ')',
        21: '!',
      };
      const expectedResult = 'some text (blah) blah!';

      // When
      const result = cambridgify.injectPonctuation(inputText, ponctuation);

      // Then
      expect(result).to.be.equal(expectedResult);
    });
  });
});

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
