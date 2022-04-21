class MyError extends Error {
  constructor(httpCode, message, isOperational = true) {
    this.httpCode = httpCode;
    this.message = message;
    this.isOperational = isOperational;
  }
}

module.exports = MyError;
