exports.getDashboard = (req, res, next) => {
  res.status(200).render('index', {
    title: 'Dashboard'
  });
};

exports.getLogin = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Đăng nhập'
  });
};
