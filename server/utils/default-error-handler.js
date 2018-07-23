module.exports = function errorHandler(error, req, res, next) {
  res.status(500).send({
    success: false,
    error
  });
};
