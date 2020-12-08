///////////////////////////////////////
///////////////////////////////////////
/// FUCNTION
const rowInTable = function (racket) {
  return `<tr><td>${
    racket.name
  }</td><td>${racket.brand.toUpperCase()}</td><td>${racket.category.toUpperCase()}</td><td>${
    racket.itemCode
  }</td>\
<td>${racket.price}</td><td>${racket.sold || 0}</td><td>${
    racket.quantity
  }</td><td><a class="badge badge-pill badge-danger" \
 href="" value=${
   racket._id
 }>Delete</a><a class="badge badge-pill badge-success" \
href='/product/update/${racket._id}'>Edit</a></td></tr>`;
};

///////////////////////////////////////
/// Fetch data racket from server
const fetchDataRackets = async (query) => {
  return new Promise((resolve, reject) =>
    axios({
      method: 'GET',
      url: `http://127.0.0.1:8002/api/v1/racket${query}`
    })
      .then((res) => resolve(res.data.data.rackets))
      .catch((err) => reject(err))
  );
};

///////////////////////////////////////
/// Fetch all brand of racket
const fetchDataBrands = async () => {
  return new Promise((resolve, reject) =>
    axios({
      method: 'GET',
      url: 'http://127.0.0.1:8002/api/v1/racket/brand'
    })
      .then((res) => resolve(res.data.data.brands))
      .catch((err) => reject(err))
  );
};

///////////////////////////////////////
/// Send request to delete racket
const sendDeleteRacket = async (id) => {
  return new Promise((resolve, reject) =>
    axios({
      method: 'DELETE',
      url: `http://127.0.0.1:8002/api/v1/racket/${id}`
    })
      .then((res) => resolve(res.data.status))
      .catch((err) => reject(err))
  );
};

///////////////////////////////////////
/// Update table with new data
const updateTable = (datas, tableClassName) => {
  if ($.fn.DataTable.isDataTable(tableClassName)) {
    $(tableClassName).dataTable().fnDestroy();
  }

  // Add row data in dataTable
  datas.forEach((data) => {
    dataTableBody.insertAdjacentHTML('afterbegin', rowInTable(data));
  });

  // Update Data in dataTable
  if ($(tableClassName).length) {
    $(document).ready(function () {
      $(tableClassName).DataTable({
        lengthChange: false,
        paging: false,
        autoWidth: false
      });
    });
  }
};


const getQueryFromForm = () => {
  let queryArr = $('#form').serializeArray();
  let query = '?limit=2';

  queryArr.forEach((el) => {
    console.log(el);
    if (el.value.length) {
      if (query.includes(el.name)) {
        query += `,${el.value}`.toLowerCase();
      } else {
        query += `&${el.name}=${el.value}`.toLowerCase();
      }
    }
  });

  return query
}

//////////////////////////////////////////
//////////////////////////////////////////
/// SELECTOR
const form = document.getElementById('form');
const brandOption = document.getElementById('selectBrand');
const categoryOption = document.getElementById('selectCategory');
const dataTableBody = document.querySelector('table tbody');

const cancelBtn = document.getElementById('cancelBtn');
const pagination = document.querySelector('.pagination');

//////////////////////////////////////////
//////////////////////////////////////////
// PROCESS
document.addEventListener('DOMContentLoaded', async (e) => {
  const [rackets, brands] = [
    await fetchDataRackets('?limit=2'),
    await fetchDataBrands()
  ];

  // Update table
  updateTable(rackets, 'table.first');

  // Show all brand from server
  if (brandOption) {
    brands.forEach((brand) => {
      const name = brand.name;
      const categoryArr = brand.category;

      $('#selectBrand').append('<option>' + name.toUpperCase() + '</option>');
      categoryArr.forEach((el) => {
        $('#selectCategory').append(
          '<option>' + el.toUpperCase() + '</option>'
        );
      });
    });
    $('.selectpicker').selectpicker('refresh');
  }

  const deleteBtns = document.querySelectorAll(
    '.badge.badge-pill.badge-danger'
  );

  if (deleteBtns) {
    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        await sendDeleteRacket(btn.getAttribute('value'));
      });
    });
  }
});

// Check form content and send req to server
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const query = getQueryFromForm();
    const rackets = await fetchDataRackets(query);
    dataTableBody.textContent = '';

    $('table.first').DataTable().clear();

    updateTable(rackets, 'table.first');
  });
}

// Brand Option Change
if (brandOption) {
  brandOption.addEventListener('change', async (e) => {
    const brands = await fetchDataBrands();
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

// Pagination
if (pagination) {
  pagination.addEventListener('click', (e) => {
    e.preventDefault();

    const query = getQueryFromForm() + e.target.href;
    const rackets = await fetchDataRackets(query);
    
    dataTableBody.textContent = '';
    $('table.first').DataTable().clear();

    updateTable(rackets, 'table.first');
  });
}
