const wrapper = document.querySelector('.imgWrapper');
const fileName = document.querySelector('.file-name');
const defaultBtn = document.querySelector('#default-btn');
const customBtn = document.querySelector('#custom-btn');
const cancelBtn = document.querySelector('#cancel-btn i');
const img = document.querySelector('img');

const regExp = /[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/;

function HandleImage() {
  defaultBtn.click();
}

defaultBtn.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      const { result } = reader;
      img.src = result;
      wrapper.classList.add('active');
    };
    cancelBtn.addEventListener('click', function () {
      img.src = '';
      wrapper.classList.remove('active');
    });
    reader.readAsDataURL(file);
  }
  if (this.value) {
    const valueStore = this.value.match(regExp);
    fileName.textContent = valueStore;
  }
});
