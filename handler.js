const Joi = require('joi');

const { summarize } = require('./summarize');

const SCHEMA = Joi.object().keys({
  value: Joi.string().required(),
  threshold: Joi.number()
    .min(1)
    .default(1.2),
});

module.exports.handleSummarization = async (event, context) => {
  const body = JSON.parse(event.body);

  const validationResult = Joi.validate(body, SCHEMA);

  if (validationResult.error) {
    throw new Error(validationResult.error);
  }

  const { value, threshold } = validationResult.value;

  return {
    statusCode: 200,
    body: JSON.stringify({
      summary: summarize(value, threshold),
    }),
  };
};
