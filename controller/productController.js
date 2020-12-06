exports.getAllProduct = (req, res, next) => {
  res.status(200).render('productList', {});
};
