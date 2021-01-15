///////////////////////////////////////////
///// FUNCTION
const sendCreateRacket = async (racket) => {
  return new Promise((resolve, reject) =>
    axios({
      method: 'POST',
      url: `https://ttshopvn.herokuapp.com/api/v1/racket`,
      withCredentials: true,
      data: racket
    })
      .then((res) => {
        showAlert('success', 'Thêm thông tin vợt thành công');
        window.open(
          `https://ttshopvn.herokuapp.com/${res.data.data.slug}.${res.data.data._id}`
        );
      })
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

///////////////////////////////////////////
///// SELECTOR
const form = document.getElementById('addProductForm');
const brandOption = document.getElementById('brand');
const frameOption = document.getElementById('frame');
const shaftOption = document.getElementById('shaft');
const difficultOption = document.getElementById('difficulty');
const categoryOption = document.getElementById('category');
const imageCover = document.getElementById('imageCover');
const images = document.getElementById('images');

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
    categoryOption.textContent = '';

    brands.forEach((brand) => {
      if (brand.name === brandOption.value.toLowerCase()) {
        const frameArr = brand.frame;
        const shaftArr = brand.shaft;
        const categoryArr = brand.category;

        // Update frame
        frameArr.forEach((frame) => {
          $('#frame').append('<option>' + frame.toUpperCase() + '</option>');
        });

        // Update shaft
        shaftArr.forEach((shaft) => {
          $('#shaft').append('<option>' + shaft.toUpperCase() + '</option>');
        });

        // Update shaft
        categoryArr.forEach((category) => {
          $('#category').append(
            '<option>' + category.toUpperCase() + '</option>'
          );
        });

        $('.selectpicker').selectpicker('refresh');
      }
    });
  });
}

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

    // Create form data (can send file)
    const formData = new FormData();
    for (const key in racket) {
      formData.append(key, racket[key]);
    }

    formData.append('imageCover', imageCover.files[0]);
    for (let i = 0; i < images.files.length; i++) {
      formData.append('images', images.files[i]);
    }

    await sendCreateRacket(formData);
  });
}
