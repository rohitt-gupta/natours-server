module.exports = fn => {
  return (req, res, next) => {
    // fn(req, res, next).catch(err => next(err));
    // when the catch block receives a err object it pass it to the next function
    // which in turn goes to the global error handler
    fn(req, res, next).catch(next);
  };
};
