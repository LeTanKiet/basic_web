$(document).ready(function () {
  // Check if dark mode preference is stored in localStorage
  const isDarkMode = localStorage.getItem('darkMode') === 'true';

  // Apply dark mode if the preference is true
  if (isDarkMode) {
    $('body').addClass('dark-mode');
  }

  // Toggle dark mode on button click
  $('#darkModeToggle').on('click', function () {
    // Toggle the dark mode class on the body
    $('body').toggleClass('dark-mode');

    // Store the dark mode preference in localStorage
    const newMode = $('body').hasClass('dark-mode');
    localStorage.setItem('darkMode', newMode.toString());
  });
});
