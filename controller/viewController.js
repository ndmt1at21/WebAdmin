exports.getDashboard = (req, res, next) => {
  res.status(200).render('index', {
    title: 'Dashboard'
  });
};
