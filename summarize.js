/** summarization */

const natural = require('natural');
const SentenceTokenizer = require('sentence-tokenizer');

const internals = {};

internals.tokenizeAndStem = value => {
  const stemmer = natural.PorterStemmer;
  const wordTokenizer = new natural.WordTokenizer();

  const tokens = wordTokenizer
    .tokenize(value)
    .filter(token => natural.stopwords.indexOf(token) === -1)
    .map(token => stemmer.stem(token));

  return tokens;
};

internals.calculateSentenceScore = (sentence, tokenMap) => {
  const tokens = internals.tokenizeAndStem(sentence);

  if (tokens.length === 0) {
    return 0;
  }

  let weight = 0;

  tokens.forEach(token => {
    if (tokenMap[token]) {
      weight += tokenMap[token];
    }
  });

  weight /= tokens.length;

  return weight;
};

internals.calculateAverageScore = weights => {
  const total = weights.reduce((a, b) => a + b);
  return total / weights.length;
};

internals.createArticleSummary = (sentences, weights, threshold) => {
  const summary = [];

  sentences.forEach((sentence, i) => {
    const sentenceWeight = weights[i];
    if (sentenceWeight >= threshold) {
      summary.push(sentence);
    }
  });

  return summary;
};

const summarize = value => {
  const tokenMap = {};
  const tokens = internals.tokenizeAndStem(value);

  tokens.forEach(token => {
    if (tokenMap[token]) {
      tokenMap[token] += 1;
    } else {
      tokenMap[token] = 1;
    }
  });

  const sentenceTokenizer = new SentenceTokenizer('DENNEWITZ1');
  sentenceTokenizer.setEntry(value);
  const sentences = sentenceTokenizer.getSentences();

  const sentenceScores = sentences.map(sentence =>
    internals.calculateSentenceScore(sentence, tokenMap),
  );

  const avgScore = internals.calculateAverageScore(sentenceScores);

  const summary = internals.createArticleSummary(
    sentences,
    sentenceScores,
    1.5 * avgScore,
  );

  return summary;
};

exports.internals = internals;
exports.summarize = summarize;
