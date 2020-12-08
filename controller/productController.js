const mongoose = require('mongoose');
const Racket = require('./../models/racketModel');
const mongoosePaginate = require('mongoose-paginate-v2');

exports.getAllProduct = async (req, res, next) => {
  const query = Racket.find();

  Racket.paginate(query, {
    page: req.query.page || 1,
    limit: 25
  }).then((result) => {
    res.status(200).render('productList', {
      title: 'Tất cả sản phẩm',
      paginateRes: result
    });
  });
};

exports.addProduct = async (req, res, next) => {
  res.status(200).render('addProduct', {
    title: 'Thêm sản phẩm'
  });
};
