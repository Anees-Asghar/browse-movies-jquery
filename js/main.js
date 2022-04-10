let api_key = config.API_KEY;

$(document).ready(() => {
	// event listener for movie searches
	let $searchForm = $('#searchForm');
	$searchForm.on('submit', (e) => {
		e.preventDefault();
		let $searchText = $searchForm.find('#searchText').val();

		searchMovies($searchText)
	});

	// event listener for link to home page
	$('#homepageLink').on('click', () => {
		// clear session storage
		if (sessionStorage.getItem('searchText') !== null){
			sessionStorage.removeItem('searchText');
		};
	});
});

function searchMovies(searchText){
	// it is undefined when page is visited for the first time or when
	// you back from the movie detail page
	if (searchText === undefined){
		if (sessionStorage.getItem('searchText') !== null) { // case when we go back to home page from detail page
			searchText = sessionStorage.getItem('searchText');
		} else { // case when home page is visited for the first time
			searchText = 'rush';
		}
	}

	// api call to get movies by search text
	$.ajax({
		url: 'http://www.omdbapi.com/?apikey='+ api_key +'&s=' + searchText,
	}).done((data) => {
		console.log(data);
		let movies = data.Search;
		var output = "";

		// create html to display each movie
		$.each(movies, (index, movie) => {
			output += `
				<div class='col-md-3 mb-5 text-center'>
					<img class='poster' src='${movie.Poster}'>
					<p class='lead mt-2'>${movie.Title}</p>
					<a onclick='selectMovie("${movie.imdbID}", "${searchText}")' 
						class='btn btn-info' href='detail.html'>View</a>
				</div>
		`});

		// display the results
		$('#movies .row').html(output);
	}).fail(() => {
		// create html to display error message
		var output = `
			<div class='col-md-12 text-center'>
				<p>Could not reach the api. Please follow the instructions of the README file.</p>
			</div>
		`
		// display the results
		$('#movies .row').html(output);
	});
};

function selectMovie(id, searchText){
	// set session storage variables
	sessionStorage.setItem('movieId', id);
	sessionStorage.setItem('searchText', searchText);
};

function movieDetail(){
	// get selected movie id from session storage
	let movieId = sessionStorage.getItem('movieId');

	// api call to get movie details
	$.ajax({
		url: 'http://www.omdbapi.com/?apikey='+ api_key +'&i=' + movieId,
	})
	.done((movie) => {
		// generate html to display movie details
		let output =`
	        <div class="row">
	          <div class="col-md-4">
	            <img src="${movie.Poster}" class="thumbnail">
	          </div>
	          <div class="col-md-8">
	            <h2>${movie.Title}</h2>
	            <ul class="list-group mt-3">
	              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
	              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
	              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
	              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
	              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
	              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
	              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
	            </ul>
	          </div>
	        </div>
	        <div class="row mt-5">
	          <div class="well">
	            <h3>Plot</h3>
	            ${movie.Plot}
	            <hr>
	            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-warning">View on IMDB</a>
	            <a href="index.html" class="btn btn-outline-light">Back To Search</a>
	          </div>
	        </div>
    	`;

		// display movie details
    	$('#movieDetail').html(output);
	});
}
