const cardUserDetail = (user) => {
  const date = new Date(user.createdDate);
  const formatDate = new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'full'
  }).format(date);

  return `<div class="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-12">
        <div class="text-center">
            <img src="https://ttshopvn.herokuapp.com/img/users/${
              user.photo
            }" alt="User Avatar" class="rounded-circle user-avatar-xxl">
            </div>
        </div>
        <div class="col-xl-10 col-lg-8 col-md-8 col-sm-8 col-12">
            <div class="user-avatar-info">
                <div class="m-b-20">
                    <div class="user-avatar-name">
                        <h2 class="mb-1">${user.name + ' ' + user.lastName}</h2>
                    </div>
                    <div class="rating-star  d-inline-block">
                        <p class="d-inline-block text-dark"></p>
                    </div>
                </div>
            
                <div class="user-avatar-address">
                    <p class="border-bottom pb-3">
                        <span class="d-xl-inline-block d-block mb-2"><i class="fa fa-map-marker-alt mr-2 text-primary "></i>Địa chỉ: ${
                          user.address
                        }</span>
                        <span class="mb-2 ml-xl-4 d-xl-inline-block d-block">Ngày đăng ký: ${formatDate}  </span>
                    </p>
                    <div class="mt-3">
                        <a href="#" class="badge badge-light mr-1">${
                          user.role
                        }</a>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
};

const fetchDataUser = async (id) => {
  return new Promise((resolve, reject) =>
    axios({
      method: 'GET',
      url: `https://ttshopvn.herokuapp.com/api/v1/user/${id}`,
      withCredentials: true
    })
      .then((res) => resolve(res.data.data.user))
      .catch((err) => reject(err))
  );
};

const rowContainer = document.getElementById('rowContainer');

document.addEventListener('DOMContentLoaded', async (e) => {
  const url = window.location.toString();
  const id = url.slice(url.lastIndexOf('/') + 1);

  fetchDataUser(id)
    .then((user) => {
      const htmlCard = cardUserDetail(user);
      rowContainer.insertAdjacentHTML('afterbegin', htmlCard);
    })
    .catch((err) => console.log(err));
});
