class HttpError extends Error {
  constructor(message, erroCode) {
    super(message); // Adds a 'message' property
    this.code = erroCode; // Adds a 'code' property
  }
}

module.exports = HttpError;
