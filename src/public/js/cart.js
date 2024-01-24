$(document).ready(function () {
  $('.addToCart').click(function (event) {
    event.preventDefault();

    // Get the product details
    const productCard = $(this).closest('.product-card');
    const id = productCard.find('a[href^="/products/"]').attr('href').split('/')[2];
    const name = productCard.find('.card-title a').text();
    const price = productCard.find('.card-price').text().replace('$', '');
    const image = productCard.find('.image-holder img').attr('src');

    // Create a product object
    const product = { id, name, price, image, amount: 1 };

    // Get the current cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product is already in the cart
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      // If the product is already in the cart, increment the amount
      existingProduct.amount += 1;
    } else {
      // If the product is not in the cart, add it
      cart.push(product);
    }

    // Save the cart back to local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart display
    updateCartDisplay();
  });

  // Function to calculate and display total price
  function updateTotalPrice() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = cart.reduce((total, product) => total + parseFloat(product.price), 0);

    $('#total-price span').text(`$ ${totalPrice.toFixed(2)}`);
  }

  // Function to remove all products from cart
  function removeAllProducts() {
    localStorage.removeItem('cart');

    $('.products-container').empty();

    updateTotalPrice();
  }

  // Event listener for a button to remove all products
  $('#remove-all').click(removeAllProducts);

  // Event listener for buttons to remove individual products
  $('.products-container').on('click', '.remove-product', function () {
    let id = $(this).data('id').toString();

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter((product) => product.id !== id);

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartDisplay();
    updateTotalPrice();
  });

  function updateCartDisplay() {
    // Get the cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Get the offcanvas body
    const productsContainer = $('.products-container');

    // Clear the offcanvas body
    productsContainer.empty();

    // Loop through the cart items
    cart.forEach(function (product) {
      // Append the cart item HTML to the offcanvas body
      productsContainer.append(createCartItemHtml(product));
    });

    updateTotalPrice();
  }

  function createCartItemHtml(product) {
    // Create the HTML for the cart item
    return `
      <div class='cart-item card my-1 shadow-sm w-100'>
        <div class='row g-0'>
          <div class='col-md-4'>
            <div class='image-holder ratio ratio-1x1 position-relative overflow-hidden'>
              <img src='${product.image}' alt='cart item' class='object-fit-cover' />
            </div>
          </div>
          <div class='col-md-8'>
            <div class='card-body d-flex align-items-start justify-content-between'>
              <div class='w-75'>
                <h6 class='fw-semibold text-truncate'>${product.name}</h6>
                <h6 class='fw-normal'>Quantity: ${product.amount}</h6>
                <h6 class='card-title' style='color:#85BB65;'>$ ${product.price}</h6>
              </div>
              <div>
                <button class="remove-product btn border-0" data-id="${product.id}"><i class='bi bi-trash fs-6'></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Initial cart display update
  updateCartDisplay();
});
