const mongoose = require('mongoose');
const AppError = require('../ultilities/appError');

exports.getUsers = async (req, res, next) => {
  res.status(200).render('userList', {
    title: 'Tất cả người dùng'
  });
};

exports.getUserDetail = async (req, res, next) => {
  res.status(200).render('userDetail', {
    title: `Thông tin ID ${req.params.id}`
  });
};
