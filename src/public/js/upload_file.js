function getImagePreview(event) {
  var image = URL.createObjectURL(event.target.files[0]);
  var imagediv = document.getElementById('image-preview');
  var newimg = document.createElement('img');
  imagediv.innerHTML = '';
  newimg.src = image;
  newimg.width = '300';
  imagediv.appendChild(newimg);
}
