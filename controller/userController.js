const mongoose = require('mongoose');
const User = require('./../models/userModel');
const mongoosePaginate = require('mongoose-paginate-v2');
const AppError = require('../ultilities/appError');
const APIFeatures = require('./../ultilities/apiFeatures');

exports.getUsers = async (req, res, next) => {
  let query = User.find();

  const feature = new APIFeatures(query, req.query);
  feature.filter().sort();
  query.select('+active');

  User.paginate(query, {
    page: req.query.page || 1,
    limit: req.query.limit || 2
  }).then((result) => {
    console.log(result.docs);
    res.status(200).render('userList', {
      title: 'Tất cả người dùng',
      paginateRes: result,
      users: result.docs
    });
  });
};
