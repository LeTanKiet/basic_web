async function getImagePreview(event) {
  var image = URL.createObjectURL(event.target.files[0]);
  var imageElement = document.getElementById('image-preview-img');
  imageElement.innerHTML = '';
  imageElement.src = image;
  imageElement.width = '300';

  const formElement = document.getElementById('upload_avatar_form');
  formElement.submit();
}
