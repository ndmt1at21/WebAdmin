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

const actionBtns = (racketID) => {
  return `<a class="badge badge-pill badge-success" href="/product/update/${racketID}">Edit</a>
  <a class="badge badge-pill badge-danger" href="a" value=${racketID}>Delete</a>`;
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
/// Fetch all brand of racket
const fetchDataBrands = async () => {
  return new Promise((resolve, reject) =>
    axios({
      method: 'GET',
      url: 'https://ttshopvn.herokuapp.com/api/v1/racket/brand',
      withCredentials: true
    })
      .then((res) => resolve(res.data.data.brands))
      .catch((err) => reject(err))
  );
};

const fetchDataRackets = async (queryStr) => {
  return new Promise((resolve, reject) =>
    axios({
      method: 'GET',
      url: `https://ttshopvn.herokuapp.com/api/v1/racket?${queryStr}`,
      withCredentials: true
    })
      .then((res) =>
        resolve([
          res.data.data.rackets,
          res.headers['x-paging-count'],
          res.headers['x-paging-current']
        ])
      )
      .catch((err) => reject(err))
  );
};

///////////////////////////////////////
/// Send request to delete racket
const sendDeleteRacket = async (id) => {
  return new Promise((resolve, reject) =>
    axios({
      method: 'DELETE',
      url: `https://ttshopvn.herokuapp.com/api/v1/racket/${id}`,
      withCredentials: true
    })
      .then((res) => resolve(res.data.status))
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
const form = document.getElementById('form');
const nameRacket = document.getElementById('name');
const itemCode = document.getElementById('itemCode');
const brandOption = document.getElementById('selectBrand');
const categoryOption = document.getElementById('selectCategory');
const cancelBtn = document.getElementById('cancelBtn');

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
          await sendDeleteRacket(btn.getAttribute('value'));
          window.location.reload();
        }
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

    fetchDataRacketsAndUpdateTable(currentQuery);
  });
};

const showTableData = (rackets) => {
  // Show TableData
  if ($('table.first').length) {
    $('table.first').DataTable({
      data: rackets,
      lengthChange: false,
      paging: false,
      autoWidth: false,
      columns: [
        { data: 'name' },
        { data: 'brand' },
        { data: 'category' },
        { data: 'itemCode' },
        { data: 'price' },
        { data: 'sold', defaultContent: 0 },
        { data: 'quantity' },
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

const showTableAndListener = (rackets, totalPages, currentPage) => {
  showTableData(rackets);
  $('table.first').after(
    pagination(Number(totalPages), Number(currentPage), 5)
  );
  listenerBtnsDelete();
  listenerPageClick();
};

const fetchDataRacketsAndUpdateTable = (queryStr) => {
  fetchDataRackets(queryStr)
    .then(([rackets, totalPages, currentPage]) => {
      showTableAndListener(rackets, totalPages, currentPage);
    })
    .catch((err) => {
      console.log(err);
    });
};

const showBrandAndCategory = async () => {
  // Show all brand from server
  if (brandOption) {
    const brands = await fetchDataBrands();
    brands.forEach((brand) => {
      const name = brand.name;
      const categoryArr = brand.category;

      // show brand
      $('#selectBrand').append('<option>' + name.toUpperCase() + '</option>');

      // show category
      categoryArr.forEach((category) => {
        $('#selectCategory').append(
          '<option>' + category.toUpperCase() + '</option>'
        );
      });
    });

    $('.selectpicker').selectpicker('refresh');
  }
};

document.addEventListener('DOMContentLoaded', async (e) => {
  currentQuery = `page=1&limit=${kLimitPerPage}`;
  fetchDataRacketsAndUpdateTable(currentQuery);
  showBrandAndCategory();
});

// Check form content and send req to server
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const query = getQueryFromForm();

    $('table.first').DataTable().destroy();
    $('table.first tbody').empty();

    currentQuery = `${query}&limit=${kLimitPerPage}&page=1`;
    fetchDataRacketsAndUpdateTable(currentQuery);
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
