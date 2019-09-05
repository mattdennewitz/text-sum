const http = require('http')
const Joi = require('joi');

const { summarize } = require('./summarize');

const SCHEMA = Joi.object().keys({
  value: Joi.string().required(),
  threshold: Joi.number()
    .min(1)
    .default(1.2),
});

function bodyToSummary(body){
  const validationResult = Joi.validate(body, SCHEMA);

  if (validationResult.error) {
    throw new Error(validationResult.error);
  }

  const { value, threshold } = validationResult.value;

  return summarize(value, threshold);
}

module.exports.handleSummarization = async (event, context) => {
  const body = JSON.parse(event.body);

  const summary = bodyToSummary(body);

  return {
    statusCode: 200,
    body: JSON.stringify({
      summary,
    }),
  };
};

function httpServer(port) {
  const server = http.createServer((req, resp) => {
    if (req.method !== 'POST' || req.url !== '/summarize'){
      resp.writeHead(405);
      resp.end('POST to /summarize');
      return;
    }
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const summary = bodyToSummary(body);
        resp.writeHead(200, {
          'content-type': 'application/json',
        });
        resp.end(JSON.stringify(summary));
      } catch (err) {
        resp.writeHead(500);
        resp.end(err.toString());
      }
    });
  });

  server.listen(port);
  console.log('Server listening on port 8080');
};

if (!process.env.LAMBDA_TASK_ROOT) {
  httpServer(8080);
}
