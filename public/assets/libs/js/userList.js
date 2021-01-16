///////////////////////////////////////
///////////////////////////////////////
/// FUNCTION
const kLimitPerPage = 10;

const confirmBoxHtml = `<div class="card confirm-box" id="confirm-delete">
<div class="card-body confirm-box-body">
    <form class="confirm-form">
        <label class="col-form-label">Nhập <strong>delete</strong> để xác nhận xoá</label>
        <input id="confirmText" type="text" class="form-control">
        <a href="#" id="confirmCancel" class="btn btn-light">Huỷ</a>
        <a href="#" id="confirmOK" class="btn btn-danger">Xác nhận</a>
    </form>
</div>
</div>`;

const actionBtns = (userID) => {
  return `<a class="badge badge-pill badge-info" href="/user/view/${userID}">View</a>
  <a class="badge badge-pill badge-success" href="a" value=${userID}>Active</a>
  <a class="badge badge-pill badge-danger" href="a" value=${userID}>Block</a>`;
};

let currentQuery = '';

const pagination = (totalPage, currentPage, maxPageShow) => {
  let maxPage = 0;
  const hasNext = currentPage < totalPage ? true : false;
  const hasPrev = currentPage > 1 ? true : false;
  let htmlPaging = '<ul class="pagination">{%PREV%}{%PAGE_ITEMS%}{%NEXT%}</ul>';

  if (totalPage <= 1) {
    return '';
  }

  if (hasPrev) {
    htmlPaging = htmlPaging.replace(
      '{%PREV%}',
      `<li class="page-item"><a class="page-link" href="#" value=${
        currentPage - 1
      }>Previous</a></li>`
    );
  } else {
    htmlPaging = htmlPaging.replace('{%PREV%}', '');
  }

  if (hasNext) {
    htmlPaging = htmlPaging.replace(
      '{%NEXT%}',
      `<li class="page-item"><a class="page-link" href="#" value=${
        currentPage + 1
      }>Next</a></li>`
    );
  } else {
    htmlPaging = htmlPaging.replace('{%NEXT%}', '');
  }

  let startPage = 0;
  if (totalPage < maxPageShow) {
    startPage = 1;
    maxPage = totalPage;
  } else if (currentPage > 2 && currentPage + maxPageShow - 3 < totalPage) {
    startPage = currentPage - 2;
  } else {
    startPage = totalPage - maxPageShow + 1;
  }

  let pageItems = '';
  for (let i = 0; i < maxPage; i++) {
    const valuePage = startPage + i;

    if (valuePage === Number(currentPage)) {
      pageItems += `<li class="page-item active"><a class="page-link" href="#" value=${valuePage}>${valuePage}</a></li>`;
    } else {
      pageItems += `<li class="page-item"><a class="page-link" href="#" value=${valuePage}>${valuePage}</a></li>`;
    }
  }

  htmlPaging = htmlPaging.replace('{%PAGE_ITEMS%}', pageItems);
  return htmlPaging;
};

///////////////////////////////////////
/// Fetch all brand of user
const fetchDataUsers = async (queryStr) => {
  return new Promise((resolve, reject) =>
    axios({
      method: 'GET',
      url: `https://ttshopvn.herokuapp.com/api/v1/user?${queryStr}`,
      withCredentials: true
    })
      .then((res) =>
        resolve([
          res.data.data.users,
          res.headers['x-paging-count'],
          res.headers['x-paging-current']
        ])
      )
      .catch((err) => reject(err))
  );
};

/// Send request to active user
const sendActiveUser = async (id) => {
  return new Promise((resolve, reject) =>
    axios({
      method: 'PATCH',
      url: `https://ttshopvn.herokuapp.com/api/v1/user/${id}`,
      withCredentials: true,
      data: {
        active: true
      }
    })
      .then((res) => resolve(res.data.status))
      .catch((err) => reject(err))
  );
};

/// Send request to delete users
const sendDeleteUser = async (id) => {
  return new Promise((resolve, reject) =>
    axios({
      method: 'DELETE',
      url: `https://ttshopvn.herokuapp.com/api/v1/user/${id}`,
      withCredentials: true
    })
      .then((res) => resolve(res.status))
      .catch((err) => reject(err))
  );
};

// Get query from input form
const getQueryFromForm = () => {
  let queryArr = $('#form').serializeArray();
  let query = '';

  queryArr.forEach((el) => {
    if (el.value.length) {
      if (!query) {
        query = `${el.name}=${el.value.toLowerCase()}`;
      } else if (query.includes(el.name)) {
        query += `,${el.value}`.toLowerCase();
      } else {
        query += `&${el.name}=${el.value.toLowerCase()}`;
      }
    }
  });

  return query;
};

const confirmDelete = function () {
  return new Promise((resolve, reject) => {
    document.body.insertAdjacentHTML('afterbegin', confirmBoxHtml);

    const confirmBox = document.querySelector('.confirm-box');
    const confirmText = document.getElementById('confirmText');
    const confirmCancel = document.getElementById('confirmCancel');
    const confirmOK = document.getElementById('confirmOK');

    confirmBox.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        confirmBox.remove();
        resolve(true);
      }
    });

    confirmOK.addEventListener('click', (e) => {
      e.preventDefault();

      if (confirmText.value === 'delete') {
        confirmBox.remove();
        resolve(true);
      }
    });

    confirmCancel.addEventListener('click', (e) => {
      e.preventDefault();
      confirmBox.remove();
      reject(false);
    });
  });
};

//////////////////////////////////////////
//////////////////////////////////////////
/// SELECTOR
const email = document.getElementById('email');
const name = document.getElementById('name');
const form = document.getElementById('form');

//////////////////////////////////////////
//////////////////////////////////////////
// PROCESS
const listenerBtnsDelete = () => {
  // Select all btn delete (after load table)
  const deleteBtns = document.querySelectorAll(
    '.badge.badge-pill.badge-danger'
  );

  // Delete buttons
  if (deleteBtns) {
    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();

        if ((await confirmDelete()) === true) {
          sendDeleteUser(btn.getAttribute('value')).then((status) => {
            if (status === 204) {
              window.location.reload();
            } else {
              showAlert('danger', 'Có lỗi xảy ra khi block');
            }
          });
        }
      });
    });
  }
};

const listenerBtnsActive = () => {
  // Select all btn actibve (after load table)
  const activeBtns = document.querySelectorAll(
    '.badge.badge-pill.badge-success'
  );

  // Active buttons
  if (activeBtns) {
    activeBtns.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();

        sendActiveUser(btn.getAttribute('value')).then((status) => {
          console.log(status);
          if (status === 'success') {
            window.location.reload();
          } else {
            showAlert('danger', 'Có lỗi xảy ra khi active');
          }
        });
      });
    });
  }
};

const listenerPageClick = () => {
  const paginate = document.querySelector('.pagination');

  if (!paginate) {
    return;
  }

  paginate.addEventListener('click', (e) => {
    e.preventDefault();

    const page = e.target.getAttribute('value');

    $('table.first').DataTable().destroy();
    $('table.first tbody').empty();

    const params = new URLSearchParams(currentQuery);
    params.set('page', page);
    currentQuery = params.toString();

    fetchDataUsersAndUpdateTable(currentQuery);
  });
};

const showTableData = (users) => {
  // Show TableData
  if ($('table.first').length) {
    $('table.first').DataTable({
      data: users,
      lengthChange: false,
      paging: false,
      autoWidth: false,
      columns: [
        { data: '_id' },
        { data: 'name' },
        { data: 'email' },
        { data: 'phone' },
        { data: 'role' },
        {
          data: 'active',
          render: function (data) {
            if (data) return 'Active';
            return 'Blocked';
          }
        },
        {
          data: '_id',
          render: function (data) {
            return actionBtns(data);
          }
        }
      ]
    });
  }
};

const showTableAndListener = (users, totalPages, currentPage) => {
  showTableData(users);
  $('table.first').after(
    pagination(Number(totalPages), Number(currentPage), 5)
  );
  listenerBtnsDelete();
  listenerBtnsActive();
  listenerPageClick();
};

const fetchDataUsersAndUpdateTable = (queryStr) => {
  fetchDataUsers(queryStr)
    .then(([users, totalPages, currentPage]) => {
      showTableAndListener(users, totalPages, currentPage);
    })
    .catch((err) => {
      console.log(err);
    });
};

document.addEventListener('DOMContentLoaded', async (e) => {
  currentQuery = `page=1&limit=${kLimitPerPage}`;
  fetchDataUsersAndUpdateTable(currentQuery);
});

// Check form content and send req to server
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const query = getQueryFromForm();

    $('table.first').DataTable().destroy();
    $('table.first tbody').empty();

    currentQuery = `${query}&limit=${kLimitPerPage}&page=1`;
    fetchDataUsersAndUpdateTable(currentQuery);
  });
}

// Cancel Button Click
if (cancelBtn) {
  cancelBtn.addEventListener('click', (e) => {
    for (let i = 0; i < categoryOption.options.length; i++) {
      categoryOption.options[i].selected = false;
    }

    for (let i = 0; i < brandOption.options.length; i++) {
      brandOption.options[i].selected = false;
    }

    $('.selectpicker').selectpicker('refresh');
  });
}

const getQueryFromForm = () => {
  let queryArr = $('#form').serializeArray();
  let query = '';

  queryArr.forEach((el) => {
    if (el.value.length) {
      if (!query) {
        query = `${el.name}=${el.value.toLowerCase()}`;
      } else if (query.includes(el.name)) {
        query += `,${el.value}`.toLowerCase();
      } else {
        query += `&${el.name}=${el.value.toLowerCase()}`;
      }
    }
  });

  return query;
};

if (form) {
  form.addEventListener('submit', async (e) => {
    const query = getQueryFromForm();

    $('table.first').DataTable().destroy();
    $('table.first tbody').empty();

    await fetchDataUsersAndUpdateTable(query);
  });
}
