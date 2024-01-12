function openModal() {
  $('#addProductModal').css('display', 'flex');
}

function closeModal() {
  $('#addProductModal').css('display', 'none');
}

function openEditModal(productId) {
  fetch(`/admin/products/${productId}`)
    .then((response) => response.json())
    .then((product) => {
      $('#editProductId').val(product.id);
      $('#editProductName').val(product.name);
      $('#editProductPrice').val(product.price);
      $('#editProductDescription').val(product.description);
      $('#editProductImage').val(product.image);
      $('#editProductModal').css('display', 'flex');
    })
    .catch((error) => {
      console.error('Error fetching product details:', error);
    });
}

function closeEditModal() {
  $('#editProductModal').css('display', 'none');
}

function saveEditedProduct() {
  const productId = $('#editProductId').val();
  const editedProductName = $('#editProductName').val();
  const editedProductPrice = $('#editProductPrice').val();
  const editedProductDescription = $('#editProductDescription').val();
  const editedProductImage = $('#editProductImage').val();

  fetch(`/admin/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: editedProductName,
      price: editedProductPrice,
      description: editedProductDescription,
      image: editedProductImage,
    }),
  })
    .then((response) => response.json())
    .then((editedProduct) => {
      closeEditModal();
      location.reload(true);
    })
    .catch((error) => {
      console.error('Error updating product:', error);
    });
}

function deleteProductConfirmation(productId) {
  var confirmDelete = confirm('Are you sure you want to delete this product?');
  if (confirmDelete) {
    deleteProduct(productId);
  }
}

function deleteProduct(productId) {
  fetch(`/admin/products/${productId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error deleting product: ${response.statusText}`);
      }
      location.reload(true);
    })
    .catch((error) => {
      console.error(error);
    });
}

function addProduct(event) {
  const productName = $('#productName').val();
  const productPrice = $('#productPrice').val();
  const productDescription = $('#productDescription').val();
  const productImage = $('#productImage').val();

  fetch('/admin/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: productName,
      price: productPrice,
      description: productDescription,
      image: productImage,
    }),
  })
    .then((response) => response.json())
    .then((newProduct) => {
      location.reload(true);
    })
    .catch((error) => {
      console.error('Error adding product:', error);
    });

  closeModal();
}
