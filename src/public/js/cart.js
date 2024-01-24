$(document).ready(function () {
  $('.addToCart').click(function (event) {
    event.preventDefault();

    // Get the product details
    const productCard = $(this).closest('.product-card');
    const id = productCard.find('a[href^="/products/"]').attr('href').split('/')[2];
    const name = productCard.find('.title a').text();
    const price = productCard.find('.price').text().replace('$', '');
    const image = productCard.find('.image-holder img').attr('src');

    // Create a product object
    const product = { id, name, price, image };

    // Get the current cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add the product to the cart
    cart.push(product);

    // Save the cart back to local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart display
    updateCartDisplay();
  });

  function updateCartDisplay() {
    // Get the cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Get the offcanvas body
    const offcanvasBody = $('.offcanvas-body');
    const checkoutBody = $('.checkout-cart-body');
    const checkoutTotalPrice = $('.checkout-total-price');

    // Clear the offcanvas body
    offcanvasBody.empty();

    let totalPrice = 0;
    // Loop through the cart items
    cart.forEach(function (product) {
      // Append the cart item HTML to the offcanvas body
      offcanvasBody.append(createCartItemHtml(product));
      checkoutBody.append(createCartItemInCheckoutPage(product));
      totalPrice += Number(product.price);
    });
    checkoutTotalPrice.text(`$${totalPrice}`);
  }

  function createCartItemHtml(product) {
    // Create the HTML for the cart item
    return `
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
  }

  function createCartItemInCheckoutPage(product) {
    return `
      <div class='checkout-item'>
        <div class='checkout-item-image'>
          <img src='http://localhost:3000/${product.image}' alt='' />
        </div>
        <div class='checkout-item-body'>
          <b>${product.name}</b>
          <span class='checkout-price'>$${product.price}</span>
        </div>
        <div class='checkout-item-delete'>
          <img src='https://static-00.iconduck.com/assets.00/trash-icon-462x512-njvey5nf.png' alt='' />
        </div>
      </div>
    `;
  }

  // Initial cart display update
  updateCartDisplay();
});
