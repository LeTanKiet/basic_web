$(document).ready(function () {
  $('input.categoryCheckbox').change(function () {
    filterProducts();
  });

  // Handler for price range filter
  $('#minPriceInput, #maxPriceInput').on('input', function () {
    filterProducts();
  });

  // Handler for color filter
  $('input.colorCheckbox').change(function () {
    filterProducts();
  });

  // Handler for material filter
  $('input.materialCheckbox').change(function () {
    filterProducts();
  });

  // Handler for country of origin filter
  $('input.countryCheckbox').change(function () {
    filterProducts();
  });

  // Handler for apply button
  $('#applyFilterBtn').on('click', function () {
    filterProducts();
  });

  function filterProducts() {
    var selectedCategories = getSelectedValues('categoryCheckbox');
    var minPrice = parseFloat($('#minPriceInput').val()) || 0;
    var maxPrice = parseFloat($('#maxPriceInput').val()) || Number.MAX_VALUE;
    var selectedColors = getSelectedValues('colorCheckbox');
    var selectedMaterials = getSelectedValues('materialCheckbox');
    var selectedCountries = getSelectedValues('countryCheckbox');

    // Implement your filtering logic here
    $('.product-card').each(function () {
      var productCategory = $(this).data('category');
      var productPrice = parseFloat($(this).data('price'));
      var productColor = $(this).data('color');
      var productMaterial = $(this).data('material');
      var productCountry = $(this).data('country');

      // Check if the product meets the selected criteria
      var categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(productCategory);
      var priceMatch = productPrice >= minPrice && productPrice <= maxPrice;
      var colorMatch = selectedColors.length === 0 || selectedColors.includes(productColor);
      var materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(productMaterial);
      var countryMatch = selectedCountries.length === 0 || selectedCountries.includes(productCountry);

      // Show/hide the product based on the matching criteria
      if (categoryMatch && priceMatch && colorMatch && materialMatch && countryMatch) {
        console.log($(this));
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }

  function getSelectedValues(checkboxName) {
    return $('input[name="' + checkboxName + '"]:checked')
      .map(function () {
        return this.id;
      })
      .get();
  }
});
