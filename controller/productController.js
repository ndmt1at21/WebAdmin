const mongoose = require('mongoose');
const Racket = require('./../models/racketModel');
const mongoosePaginate = require('mongoose-paginate-v2');
const AppError = require('../ultilities/appError');

exports.getAllProduct = async (req, res, next) => {
  const query = Racket.find();

  Racket.paginate(query, {
    page: req.query.page || 1,
    limit: 2
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

exports.updateProduct = async (req, res, next) => {
  await Racket.findById(req.params.id);

  res.status(200).render('editProduct', {
    title: 'Thêm sản phẩm'
  });
};
