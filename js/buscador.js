var sjs = SimpleJekyllSearch({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('results-container'),
  json: '/search.json',
  noResultsText: 'No tenemos este texto aún',
  fuzzy: false
});