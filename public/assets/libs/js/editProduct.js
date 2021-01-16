//////////////////////////////////////////////////////
///// FUNCTION
const sendUpdateRacket = async (data, id) => {
  return new Promise((resolve, reject) =>
    axios({
      method: 'PATCH',
      url: `https://ttshopvn.herokuapp.com/api/v1/racket/${id}`,
      withCredentials: true,
      data: data
    })
      .then((res) => showAlert('success', 'Chỉnh sửa thông tin vợt thành công'))
      .catch((err) => {
        showAlert('danger', err);
      })
  );
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

///////////////////////////////////////
/// Fetch all brand of racket
const fetchDataRacket = async (id) => {
  return new Promise((resolve, reject) =>
    axios({
      method: 'GET',
      url: `https://ttshopvn.herokuapp.com/api/v1/racket/${id}`,
      withCredentials: true
    })
      .then((res) => resolve(res.data.data.racket))
      .catch((err) => reject(err))
  );
};

const updateSelect = (options, optionsWillSelect, idSelect, selector) => {
  options.forEach((el) => {
    $(idSelect).append('<option>' + String(el).toUpperCase() + '</option>');
  });

  optionsWillSelect = optionsWillSelect.map((el) => String(el));
  for (let i = 0; i < selector.options.length; i++) {
    const option = selector.options[i];

    option.selected = optionsWillSelect.includes(
      String(option.value).toLowerCase()
    )
      ? true
      : 0;
  }
};

/////////////////////////////////////////////////////////////
///// SELECTOR
const form = document.getElementById('addProductForm');

const nameRacket = document.getElementById('name');
const brand = document.getElementById('brand');
const itemCode = document.getElementById('itemCode');
const length = document.getElementById('length');
const balancePoint = document.getElementById('balancePoint');
const madein = document.getElementById('madein');
const maxStringing = document.getElementById('maxStringing');
const color = document.getElementById('color');
const category = document.getElementById('category');
const desciption = document.getElementById('desciption');
const price = document.getElementById('price');
const quantity = document.getElementById('quantity');

const flexOption = document.getElementById('flex');
const weightOption = document.getElementById('weight');
const frameOption = document.getElementById('frame');
const shaftOption = document.getElementById('shaft');
const difficultOption = document.getElementById('difficulty');
const imageCover = document.getElementById('imageCover');
const images = document.getElementById('images');

const cancelBtn = document.querySelector('.btn.btn-space.btn-secondary');

///////////////////////////////////////////////////////////
///// PROCESSING
const url = window.location.toString();
const id = url.slice(url.lastIndexOf('/') + 1);

//////////////////////////////////
// Init when dom loaded
document.addEventListener('DOMContentLoaded', async (e) => {
  const [racket, brands] = [await fetchDataRacket(id), await fetchDataBrands()];

  // Show name, brand
  nameRacket.value = racket.name;
  brand.value = racket.brand.toUpperCase();
  itemCode.value = racket.itemCode;
  length.value = racket.length;
  balancePoint.value = racket.balancePoint;
  madein.value = racket.madein;
  maxStringing.value = racket.maxStringing;
  color.value = racket.color;
  category.value = racket.category.toUpperCase();
  desciption.value = racket.desciption;
  price.value = racket.price;
  quantity.value = racket.quantity;

  // Update multi select
  brands.forEach((brand) => {
    const frameArr = brand.frame;
    const shaftArr = brand.shaft;

    if (brand.name === racket.brand) {
      updateSelect(frameArr, racket.frame, '#frame', frameOption);
      updateSelect(shaftArr, racket.shaft, '#shaft', shaftOption);
    }
  });

  updateSelect([2, 3, 4, 5, 6, 7, 8], [racket.weight], '#weight', weightOption);
  updateSelect(
    ['stiff', 'medium', 'flex', 'verystiff'],
    [racket.flex],
    '#flex',
    flexOption
  );
  updateSelect(
    ['normal', 'medium', 'advanced'],
    [racket.difficulty],
    '#difficulty',
    difficultOption
  );

  $('.selectpicker').selectpicker('refresh');

  frameOption.value = racket.frame[0];
});

////////////////////////////////
// Form submit
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Normalize data before send POST to create
    let queryArr = $('#addProductForm').serializeArray();
    let racket = {};

    queryArr.forEach((el) => {
      if (racket[el.name]) {
        if (Array.isArray(racket[el.name])) {
          racket[el.name].push(el.value);
        } else {
          const tmp = racket[el.name];
          racket[el.name] = [];
          racket[el.name].push(tmp);
          racket[el.name].push(el.value);
        }
      } else {
        racket[el.name] = el.value;
      }
    });

    const formData = new FormData();
    for (const key in racket) {
      formData.append(key, racket[key]);
    }

    formData.append('imageCover', imageCover.files[0]);
    for (let i = 0; i < images.files.length; i++) {
      formData.append('images', images.files[i]);
    }

    await sendUpdateRacket(formData, id);
  });
}

if (cancelBtn) {
  cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();

    window.location.href = '/product/all';
  });
}
