const mongoose = require('mongoose');
const Racket = require('./../models/racketModel');
const AppError = require('../ultilities/appError');
const APIFeatures = require('../ultilities/apiFeatures');

exports.getProducts = async (req, res, next) => {
  let query = Racket.find();

  const feature = new APIFeatures(query, req.query);
  feature.filter().sort();

  Racket.paginate(query, {
    page: req.query.page || 1,
    limit: req.query.limit || 20
  }).then((result) => {
    res.status(200).render('productList', {
      title: 'Tất cả sản phẩm',
      paginateRes: result,
      rackets: result.docs
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
