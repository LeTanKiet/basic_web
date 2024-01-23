$(document).ready(function () {
  // Sample data for the chart
  var data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Sample Data',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: [65, 59, 80, 81, 56],
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

  // Get the canvas element
  var ctx = $('#myChart')[0].getContext('2d');

  // Create a bar chart
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options,
  });
});
