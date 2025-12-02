const invalidPathHandler = (req, res, next) => {
  res.status(404).json({ msg: 'Invalid Path: This endpoint does not exist.' });
};

module.exports = invalidPathHandler;