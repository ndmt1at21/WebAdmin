///////////////////////////////////////
///////////////////////////////////////
/// FUCNTION
const rowInTable = function (racket) {
  return `<tr><td>${racket._id}</td><td>${racket.name}</td><td>${
    racket.brand
  }</td><td>${racket.category}</td><td>${racket.itemCode}</td>\
<td>${racket.price}</td><td>${
    racket.sold || 0
  }</td><td><a class="badge badge-pill badge-danger" \
 href="" value=${
   racket._id
 }>Delete</a><a class="badge badge-pill badge-success" \
href='/update/${racket._id}'>Edit</a></td></tr>`;
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
      url: `http://127.0.0.1:8002/api/racket/${id}}`
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
        paging: false
      });
    });
  }
};

//////////////////////////////////////////
//////////////////////////////////////////
/// SELECTOR
const dataTableBody = document.querySelector('table tbody');
const brandOption = document.getElementById('selectBrand');
const form = document.getElementById('form');
const categoryOption = document.getElementById('selectCategory');

//////////////////////////////////////////
//////////////////////////////////////////
// PROCESS
document.addEventListener('DOMContentLoaded', async (e) => {
  const [rackets, brands] = [
    await fetchDataRackets(''),
    await fetchDataBrands()
  ];

  // Update table
  updateTable(rackets, 'table.first');

  // Get all brand from server
  if (brandOption) {
    brands.forEach((brand) => {
      const name = brand.name;

      $('#selectBrand').append('<option>' + name.toUpperCase() + '</option>');
    });
    $('.selectpicker').selectpicker('refresh');
  }

  const deleteBtns = document.querySelectorAll(
    '.badge.badge-pill.badge-danger'
  );

  if (deleteBtns) {
    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();

        await sendDeleteRacket(btn.getAttribute('value'));
      });
    });
  }
});

// Check form content and send req to server
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let queryArr = $('#form').serializeArray();
    let query = '';

    queryArr.forEach((el) => {
      if (el.value) {
        if (!query) query += `?${el.name}=${el.value}`.toLowerCase();
        else if (query.includes(el.name)) {
          query += `,${el.value}`.toLowerCase();
        } else {
          query += `&${el.name}=${el.value}`.toLowerCase();
        }
      }
    });

    window.history.pushState('', {}, query);

    const rackets = await fetchDataRackets(query);
    dataTableBody.textContent = '';

    $('table.first').DataTable().clear();

    updateTable(rackets, 'table.first');
  });
}
