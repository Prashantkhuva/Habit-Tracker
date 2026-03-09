const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      if (typeof next === "function") return next(err);
      throw err;
    });
  };
};

export { asyncHandler };
