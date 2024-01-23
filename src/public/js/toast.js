let toastTriggers = document.getElementsByClassName('toastBtn');
let toastLiveExample = document.getElementById('liveToast');

Array.from(toastTriggers).forEach(function (toastTrigger) {
  toastTrigger.addEventListener('click', function () {
    var toast = new bootstrap.Toast(toastLiveExample);

    toast.show();
  });
});
