$(document).ready(function () {
  $('#payButton').click(function () {
    var orderId = $('#orderId').data('order-id');
    initiatePayment(orderId);
  });
});

function initiatePayment(orderId) {
  $.ajax({
    url: '/order/start-payment',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ orderId: orderId }),
    success: function (data) {
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    },
    error: function (xhr, status, error) {
      console.error('Error:', error);
    },
  });
}
