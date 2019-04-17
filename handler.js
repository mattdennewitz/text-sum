const { summarize } = require('./summarize');

module.exports.handleSummarization = async (event, context) => {
  const body = JSON.parse(event.body);

  return {
    statusCode: 200,
    body: JSON.stringify({
      summary: summarize(body.value),
    }),
  };
};
