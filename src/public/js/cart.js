$(document).ready(function () {
  //   $('.btn-primary').click(function (event) {
  $('.addToCart').click(function (event) {
    event.preventDefault();

    // Get the product details
    var productCard = $(this).closest('.product-card');
    var id = productCard.find('a[href^="/products/"]').attr('href').split('/')[2];
    var name = productCard.find('.title a').text();
    var price = productCard.find('.price').text().replace('$', '');
    var image = productCard.find('.image-holder img').attr('src');

    // Create a product object
    var product = { id: id, name: name, price: price, image: image };

    // Get the current cart from local storage
    var cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add the product to the cart
    cart.push(product);

    // Save the cart back to local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart display
    updateCartDisplay();
  });

  // Get the cart from local storage
  var cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Get the offcanvas body
  var offcanvasBody = $('.offcanvas-body');

  // Clear the offcanvas body
  offcanvasBody.empty();

  // Loop through the cart items
  cart.forEach(function (product) {
    // Create the HTML for the cart item
    var cartItemHtml = `
      <div class='card mb-3 shadow-lg' style='max-width: 540px;'>
        <div class='row g-0'>
          <div class='col-md-4'>
            <div class='w-100 overflow-hidden d-flex justify-content-center align-items-center' style='aspect-ratio: 1 / 1;'>
              <img src='/images/vase.jpg' class='img-fluid rounded-start' alt='image' />
            </div>
          </div>

          <div class='col-md-8'>
            <div class='card-body d-flex align-items-start justify-content-between'>
              <div>
                <h5 class='card-title'>${product.name}</h5>
                <h5 class='card-title' style='color:#85BB65;'>${product.price}</h5>
              </div>
              <i class='bi bi-trash fs-5'></i>
            </div>
          </div>
        </div>
      </div>
    `;

    // Append the cart item HTML to the offcanvas body
    offcanvasBody.append(cartItemHtml);
  });

  function updateCartDisplay() {
    // Get the cart from local storage
    var cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Get the offcanvas body
    var offcanvasBody = $('.offcanvas-body');

    // Clear the offcanvas body
    offcanvasBody.empty();

    // Loop through the cart items
    cart.forEach(function (product) {
      // Create the HTML for the cart item
      var cartItemHtml = `
        <div class='card mb-3 shadow-lg' style='max-width: 540px;'>
          <div class='row g-0'>
            <div class='col-md-4'>
              <div class='w-100 overflow-hidden d-flex justify-content-center align-items-center' style='aspect-ratio: 1 / 1;'>
                <img src='/images/vase.jpg' class='img-fluid rounded-start' alt='image' />
              </div>
            </div>

            <div class='col-md-8'>
              <div class='card-body d-flex align-items-start justify-content-between'>
                <div>
                  <h5 class='card-title'>${product.name}</h5>
                  <h5 class='card-title' style='color:#85BB65;'>${product.price}</h5>
                </div>
                <i class='bi bi-trash fs-5'></i>
              </div>
            </div>
          </div>
        </div>
    `;

      // Append the cart item HTML to the offcanvas body
      offcanvasBody.append(cartItemHtml);
    });
  }
});
