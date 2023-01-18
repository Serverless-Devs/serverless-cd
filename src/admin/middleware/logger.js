module.exports = async function (req, res, next) {
  console.log(
    `url: ${req.url}, method: ${JSON.stringify(req.method)}, body: ${JSON.stringify(
      req.body,
    )}, query: ${JSON.stringify(req.query)}`,
  );
  next();
};
