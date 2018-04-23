/* eslint-disable */
$(document).ready(() => {
  const tableBody = $('.table > tbody');

  $.ajax({
    url: '/api/locations',
    success: locations => {
      locations.forEach(location => {
        tableBody.append(`
          <tr>
            <td>${location.address}</td>
            <td>${location.bedrooms}</td>
            <td>${location.bathrooms}</td>
            <td>${location.walkability}</td>
            <td>${location.safety}</td>
            <td>${location.price}</td>
          </tr>
        `);
      });
    },
  });
});
/* eslint-enable */
