'use strict';

function getNationalParks(query, limit=10) {

  const apiKey = 'mW7jh6yufpLc8oXTjhdMqelXOxrvYoYKU2EZFhhj';
  const searchURL = 'https://developer.nps.gov/api/v1/parks';
  
  function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
  }

  const params = {
    stateCode: query,
    limit,
    api_key: apiKey
  };
  const queryString = formatQueryParams(params); 
  const url = searchURL + '?' + queryString;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(error => {
      $('#js-error-message').text(`Something went wrong: ${error.message}`)
    });

  function displayResults(responseJson) {
    console.log(responseJson);
    $('#state-name-input').val("");
    $('#results-list').empty();
    for (let i = 0; i < responseJson.data.length; i++) {
      $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <a href="${responseJson.data[i].url}" target="_blank">Visit ${responseJson.data[i].fullName}'s Website</a>
      </li><hr>`
    )};
    $('#results').removeClass('hidden');
  }

}

function watchForm() {
  $('form').on('submit', function(event) {
    event.preventDefault();
    const searchTerm = $('#state-name-input').val();
    $('#user-input').text(`${searchTerm}:`);
    const maxResults = $('#js-max-results').val();
    getNationalParks(searchTerm, maxResults);
  });
}

$(watchForm);