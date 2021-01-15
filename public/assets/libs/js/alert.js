const hideAlert = () => {
  const element = document.querySelector('.alert');
  if (element) element.parentElement.removeChild(element);
};

const showAlert = (status, message) => {
  hideAlert();
  let html = `<div class="alert alert-${status} alert-custom" style="position: fixed; top: 0; left: 50%; transform: translateX(-50%)">${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', html);
  window.setTimeout(hideAlert, 2000);
};
