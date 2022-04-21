module.exports = (err, req, res, next) => {
  if (err.isOperational) {
    res.status(err.httpCode).send({ error: err.message });
  } else {
    res.status(500).send({ error: "Something unexpected went wrong." });
  }
};
