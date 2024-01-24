// Fetch the totalEarningsByMonth data from the server-side rendering
fetch('/admin/dashboard')
  .then((response) => response.json())
  .then((data) => {
    console.log(data.totalEarningsByMonth);
    var totalEarningsByMonth = data.totalEarningsByMonth;

    // Sample data for the chart
    var data = {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      datasets: [
        {
          label: 'Total Earnings',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: totalEarningsByMonth,
        },
      ],
    };

    // Options for the chart
    var options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    // Use jQuery to get the canvas element
    var ctx = $('#myChart')[0].getContext('2d');

    // Create a bar chart using Chart.js
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options,
    });
  });
