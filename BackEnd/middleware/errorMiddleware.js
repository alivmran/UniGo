const errorLogger = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  next(err);
};

const errorResponder = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    msg: err.message || 'Internal Server Error',
    status: status
  });
};

module.exports = { errorLogger, errorResponder };