const mongoose = require('mongoose');
const Racket = require('./../models/racketModel');
const AppError = require('../ultilities/appError');
const APIFeatures = require('../ultilities/apiFeatures');

exports.getProducts = async (req, res, next) => {
  res.status(200).render('productList', {
    title: 'Tất cả sản phẩm'
  });
};

exports.addProduct = async (req, res, next) => {
  res.status(200).render('addProduct', {
    title: 'Thêm sản phẩm'
  });
};

exports.updateProduct = async (req, res, next) => {
  res.status(200).render('editProduct', {
    title: 'Chỉnh sửa sản phẩm'
  });
};
