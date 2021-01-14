///////////////////////////////////////
///////////////////////////////////////
/// FUNCTION

///////////////////////////////////////
/// Fetch all brand of racket
const fetchDataBrands = async () => {
  return new Promise((resolve, reject) =>
    axios({
      method: 'GET',
      url: 'http://ttshopvn.herokuapp.com/api/v1/racket/brand'
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
      url: `http://ttshopvn.herokuapp.com/api/v1/racket/${id}`
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
        query = `?${el.name}=${el.value.toLowerCase()}`;
      } else if (query.includes(el.name)) {
        query += `,${el.value}`.toLowerCase();
      } else {
        query += `&${el.name}=${el.value.toLowerCase()}`;
      }
    }
  });

  return query;
};

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
const nameEle = document.getElementById('name');
const itemCodeEle = document.getElementById('itemCode');
const brandOption = document.getElementById('selectBrand');
const categoryOption = document.getElementById('selectCategory');

const cancelBtn = document.getElementById('cancelBtn');
const paginate = document.querySelector('.pagination');

//////////////////////////////////////////
//////////////////////////////////////////
// PROCESS
document.addEventListener('DOMContentLoaded', async (e) => {
  let params = new URLSearchParams(document.location.search);

  const nameValue = params.get('name');
  const itemCodeValue = params.get('itemCode') ?? '';
  let brandSelected;
  let categorySelected;

  if (params.get('brand')) {
    brandSelected = params.get('brand').split(',');
  }

  if (params.get('category')) {
    categorySelected = params.get('category').split(',');
  }

  nameEle.value = nameValue;
  itemCodeEle.value = itemCodeValue;

  // Show TableData
  if ($('table.first').length) {
    $('table.first').DataTable({
      lengthChange: false,
      paging: false,
      autoWidth: false
    });
  }

  // Show all brand from server
  if (brandOption) {
    const brands = await fetchDataBrands();
    brands.forEach((brand) => {
      const name = brand.name;
      const categoryArr = brand.category;

      // show brand, checked brand
      $('#selectBrand').append('<option>' + name.toUpperCase() + '</option>');
      if (brandSelected && brandSelected.includes(name)) {
        brandOption.lastChild.selected = true;
      }

      // show category, checked category
      categoryArr.forEach((category) => {
        $('#selectCategory').append(
          '<option>' + category.toUpperCase() + '</option>'
        );

        if (categorySelected && categorySelected.includes(category)) {
          categoryOption.lastChild.selected = true;
        }
      });
    });

    $('.selectpicker').selectpicker('refresh');
  }

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
});

// Check form content and send req to server
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const query = getQueryFromForm();
    window.location.href = query;
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

if (paginate) {
  paginate.addEventListener('click', (e) => {
    e.preventDefault();

    let query = getQueryFromForm();
    if (query) query += `&${e.target.getAttribute('href')}`;
    else query = `?${e.target.getAttribute('href')}`;

    window.location.href = query;
  });
}
