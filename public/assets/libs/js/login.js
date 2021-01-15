const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://ttshopvn.herokuapp.com/api/v1/user/login',
      withCredentials: true,
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      window.location.href = '/';
    }
  } catch (error) {
    console.log(error);
    showAlert('danger', 'Đăng nhập thất bại');
  }
};

const formLogin = document.querySelector('form');
const email = document.getElementById('email');
const password = document.getElementById('password');

if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    await login(email.value, password.value);
  });
}
