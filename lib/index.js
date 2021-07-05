const https = require('https');
const { RMUError, RMUInvalidJSONFormatError } = require('./errors');

/**
 *
 * @param url
 * @param options
 * @returns {Promise<unknown>}
 */
function request(url, options) {
  const agent = new https.Agent({
    timeout: options.timeout || 3000,
  });

  return new Promise((resolve, reject) => {
    https.get(url, { agent }, (response) => {
      response.on(
        'data',
        processResponse.bind(response, options, { resolve, reject })
      );
      response.on(
        'error',
        processResponseError.bind(response, options, { resolve, reject })
      );
    });
  });
}

/**
 *
 * @param data
 * @param options
 * @param promiseHandlers
 * @returns {*}
 */
function processResponse(options, promiseHandlers, data) {
  const headers = this.headers;
  try {
    promiseHandlers.resolve({
      headers,
      body: options.parse
        ? JSON.parse(data.toString('utf8'))
        : data.toString('utf8'),
    });
  } catch (err) {
    if (options.atomic) {
      return promiseHandlers.reject(
        new RMUInvalidJSONFormatError(err.message, data.toString('utf8'))
      );
    }
    return promiseHandlers.resolve({ failures: [err.message] });
  }
}

/**
 *
 * @param options
 * @param promiseHandlers
 * @param error
 * @returns {*}
 */
function processResponseError(options, promiseHandlers, error) {
  if (!options.atomic) {
    return promiseHandlers.resolve({ failures: [error.message] });
  }
  return promiseHandlers.reject(new RMUError(error.message));
}

/**
 *
 * @param urls
 * @param options
 * @returns {Promise<unknown[]>}
 */
function requestMulti(urls, options) {
  return Promise.all(urls.map((url) => request(url, options)));
}

module.exports = {
  requestMulti,

  // exported for unit testing purposes
  processResponse,
  processResponseError,
};
