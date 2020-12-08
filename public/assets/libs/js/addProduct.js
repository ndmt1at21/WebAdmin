///////////////////////////////////////////
///// FUNCTION
const sendCreateRacket = async (racket) => {
  return new Promise((resolve, reject) =>
    axios({
      method: 'POST',
      url: `http://127.0.0.1:8002/api/v1/racket`,
      body: {
        racket
      }
    })
      .then((res) => resolve(res.status))
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

///////////////////////////////////////////
///// SELECTOR
const form = document.getElementById('addProductForm');
const brandOption = document.getElementById('brand');
const frameOption = document.getElementById('frame');
const shaftOption = document.getElementById('shaft');

///////////////////////////////////////////
///// PROCESSING
document.addEventListener('DOMContentLoaded', async (e) => {
  const brands = await fetchDataBrands();
  if (brandOption) {
    brands.forEach((brand) => {
      const name = brand.name;
      $('#brand').append('<option>' + name.toUpperCase() + '</option>');
    });
    $('.selectpicker').selectpicker('refresh');
  }
});

if (brandOption) {
  brandOption.addEventListener('change', async (e) => {
    const brands = await fetchDataBrands();
    frameOption.textContent = '';
    shaftOption.textContent = '';

    brands.forEach((brand) => {
      if (brand.name === brandOption.value.toLowerCase()) {
        const frameArr = brand.frame;
        const shaftArr = brand.shaft;

        frameArr.forEach((frame) => {
          $('#frame').append('<option>' + frame.toUpperCase() + '</option>');
        });

        shaftArr.forEach((shaft) => {
          $('#shaft').append('<option>' + shaft.toUpperCase() + '</option>');
        });

        $('.selectpicker').selectpicker('refresh');
      }
    });
  });
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

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

    await sendCreateRacket(racket);
  });
}
