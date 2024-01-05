function openModal() {
  document.getElementById('addProductModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('addProductModal').style.display = 'none';
}

function openEditModal(productId) {
  fetch(`/admin/products/${productId}`)
    .then(response => response.json())
    .then(product => {
      document.getElementById('editProductId').value = product.id;
      document.getElementById('editProductName').value = product.name;
      document.getElementById('editProductPrice').value = product.price;
      document.getElementById('editProductDescription').value = product.description;
      document.getElementById('editProductImage').value = product.image;
      document.getElementById('editProductModal').style.display = 'flex';
    })
    .catch(error => {
      console.error('Error fetching product details:', error);
    });
}

function closeEditModal() {
  document.getElementById('editProductModal').style.display = 'none';
}

function saveEditedProduct() {
  const productId = document.getElementById('editProductId').value;
  const editedProductName = document.getElementById('editProductName').value;
  const editedProductPrice = document.getElementById('editProductPrice').value;
  const editedProductDescription = document.getElementById('editProductDescription').value;
  const editedProductImage = document.getElementById('editProductImage').value;

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
    .then(response => response.json())
    .then(editedProduct => {
      closeEditModal();
      location.reload(true);
    })
    .catch(error => {
      console.error('Error updating product:', error);
    });
}

function deleteProductConfirmation(productId) {
  var confirmDelete = confirm("Are you sure you want to delete this product?");
  if (confirmDelete) {
    deleteProduct(productId);
  }
}

function deleteProduct(productId) {
  fetch(`/admin/products/${productId}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error deleting product: ${response.statusText}`);
      }
      location.reload(true);
    })
    .catch(error => {
      console.error(error);
    });
}

function addProduct(event) {
  const productName = document.getElementById('productName').value;
  const productPrice = document.getElementById('productPrice').value;
  const productDescription = document.getElementById('productDescription').value;
  const productImage = document.getElementById('productImage').value;

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
    .then(response => response.json())
    .then(newProduct => {
      location.reload(true);
    })
    .catch(error => {
      console.error('Error adding product:', error);
    });

  closeModal();
}