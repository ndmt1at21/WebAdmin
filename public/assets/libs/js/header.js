const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userAccount = document.getElementById('userAccount');
const logoutBtn = document.getElementById('logout');

const fetchCurrentUser = async (id) => {
  return new Promise((resolve, reject) =>
    axios({
      method: 'GET',
      url: `https://ttshopvn.herokuapp.com/api/v1/user/currentUser`,
      withCredentials: true
    })
      .then((res) => resolve(res.data.data.user))
      .catch((err) => reject(err))
  );
};

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'https://ttshopvn.herokuapp.com/api/v1/user/logout',
      withCredentials: true
    });

    if (res.data.status == 'success') {
      window.location.href = '/';
    }
  } catch (error) {
    showAlert('Error logging out');
  }
};

document.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault();

  fetchCurrentUser().then(async (user) => {
    if (!user) {
      await logout();
      window.location.href = '/';
    }

    userAvatar.src = `https://ttshopvn.herokuapp.com/img/users/${user.photo}`;
    userName.textContent = user.name;
    userAccount.href = `https://ttshopvn.herokuapp.com/me`;

    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      await logout();
      window.location.href = '/';
    });
  });
});
