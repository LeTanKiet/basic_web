// category_manager.js

function openModal() {
  document.getElementById('addCategoryModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('addCategoryModal').style.display = 'none';
}

function openEditModal(categoryId) {
  fetch(`/admin/categories/${categoryId}`)
    .then((response) => response.json())
    .then((category) => {
      document.getElementById('editCategoryId').value = category.id;
      document.getElementById('editCategoryName').value = category.name;
      document.getElementById('editCategoryDescription').value = category.description;
      document.getElementById('editCategoryModal').style.display = 'flex';
    })
    .catch((error) => {
      console.error('Error fetching category details:', error);
    });
}

function closeEditModal() {
  document.getElementById('editCategoryModal').style.display = 'none';
}

function saveEditedCategory() {
  const categoryId = document.getElementById('editCategoryId').value;
  const editedCategoryName = document.getElementById('editCategoryName').value;
  const editedCategoryDescription = document.getElementById('editCategoryDescription').value;

  fetch(`/admin/categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: editedCategoryName,
      description: editedCategoryDescription,
    }),
  })
    .then((response) => response.json())
    .then((editedCategory) => {
      closeEditModal();
      location.reload(true);
    })
    .catch((error) => {
      console.error('Error updating category:', error);
    });
}

function deleteCategoryConfirmation(categoryId) {
  var confirmDelete = confirm('Are you sure you want to delete this category?');
  if (confirmDelete) {
    deleteCategory(categoryId);
  }
}

function deleteCategory(categoryId) {
  fetch(`/admin/categories/${categoryId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error deleting category: ${response.statusText}`);
      }
      location.reload(true);
    })
    .catch((error) => {
      console.error(error);
    });
}

function addCategory(event) {
  const categoryName = document.getElementById('categoryName').value;
  const categoryDescription = document.getElementById('categoryDescription').value;

  fetch('/admin/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: categoryName,
      description: categoryDescription,
    }),
  })
    .then((response) => response.json())
    .then((newCategory) => {
      location.reload(true);
    })
    .catch((error) => {
      console.error('Error adding category:', error);
    });

  closeModal();
}
