class RMUError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'RMUError';
  }
}

class RMUInvalidJSONFormatError extends RMUError {
  constructor(msg, badJSON) {
    super(msg);
    this.name = 'RMUInvalidJSONFormatError';
    this.badJSON = badJSON;
  }
}

class RMURequestTimeoutExceededError extends RMUError {
  constructor(msg) {
    super(msg);
    this.name = 'RMURequestTimeoutExceededError';
  }
}

module.exports = {
  RMUError,
  RMUInvalidJSONFormatError,
  RMURequestTimeoutExceededError,
};
