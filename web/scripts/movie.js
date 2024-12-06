let allMovies = [];
let videoGenreData = [];
let videoServiceData = [];
let filtersActive = false;
let filteredMovies = [];
let movieStatusId = 1;

window.addEventListener('load', function () {
	movieStatusId = parseInt(document.querySelector('body').getAttribute("data-statusid"));

	document.getElementById('add-new-movie')?.addEventListener('click', function () {
		document.querySelector('#add-movie h2').textContent = 'Add Movie';
		document.querySelector('dialog#add-movie').showModal();
	});

	document.getElementById('movie-form-dialog-cancel')?.addEventListener('click', function () {
		closeAddMovieForm();
	});

	document.querySelector('form[name="add-movie"]')?.addEventListener('submit', function (e) {
		e.preventDefault();

		saveMovie();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-no')?.addEventListener('click', function () {
		cancelOutOfConfirmDialog('#delete-movie-id');
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-yes')?.addEventListener('click', function () {
		deleteMovie();
	});

	document.querySelector('#open-movie-filter')?.addEventListener('click', function () {
		document.querySelector('dialog#filter-movie').showModal();
	});

	document.querySelector('#movie-filter-cancel')?.addEventListener('click', function () {
		document.querySelector('dialog#filter-movie').close();
	});

	document.querySelector('#clear-filters')?.addEventListener('click', function () {
		clearFilters();
	});

	document.querySelector('form[name="filter-movie"]')?.addEventListener('submit', function (e) {
		e.preventDefault();

		applyFilters();
	});

	loadVideoGenres();
	loadVideoServices();
	loadMovies();
});

async function loadVideoGenres() {
	const [data, error] = await Api.Get("system/video-genre");

	if (error) {
		showPageError(error);
		return;
	}

	videoGenreData = data;

	document.getElementById("movie-genre")?.appendChild(buildVideoGenreSelectList(videoGenreData));
	documentgetElementById("filter-movie-genre")?.appendChild(buildVideoGenreSelectList(videoGenreData));
}

async function loadVideoServices() {
	const [data, error] = await Api.Get("system/video-service");

	if (error) {
		showPageError(error);
		return;
	}

	videoServiceData = data;

	document.getElementById("movie-service")?.appendChild(buildVideoServiceSelectList(videoServiceData));
	document.getElementById("filter-movie-service")?.appendChild(buildVideoServiceSelectList(videoServiceData));
}

function loadBacklogMovieRows(movies) {
	const fragment = document.createDocumentFragment();

	movies.forEach((movie) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const sortCell = document.createElement('td');
		sortCell.classList.add('center-align');
		sortCell.textContent = movie.sortOrder ?? '';

		tr.appendChild(sortCell);

		const titleCell = document.createElement('td');

		const linkAnchor = document.createElement('a');
		linkAnchor.textContent = movie.title;
		linkAnchor.setAttribute('href', movie.imdbLink);
		linkAnchor.setAttribute('target', '_blank');
		linkAnchor.setAttribute('rel', 'noreferrer nofollow');

		titleCell.appendChild(linkAnchor);

		tr.appendChild(titleCell);

		const serviceCell = document.createElement('td');

		if (movie.services.length > 0) {
			const servicesList = buildTagList();

			for (const service of movie.services) {
				servicesList.appendChild(buildTagListItem(service.name, service.colorCode));
			}

			serviceCell.appendChild(servicesList);
		} else {
			serviceCell.textContent = '';
		}

		tr.appendChild(serviceCell);

		const genreCell = document.createElement('td');

		if (movie.genres.length > 0) {
			const genresList = buildTagList();

			for (const genre of movie.genres) {
				genresList.appendChild(buildTagListItem(genre.name, genre.colorCode));
			}

			genreCell.appendChild(genresList);
		} else {
			genreCell.textContent = '';
		}

		tr.appendChild(genreCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');
		editButton.addEventListener('click', function () {
			editMovie(movie.movieId);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(movie);
		});

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	return fragment;
}

function loadFinishedMovieRows(movies) {
	const fragment = document.createDocumentFragment();

	movies.forEach((movie) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const titleCell = document.createElement('td');

		const linkAnchor = document.createElement('a');
		linkAnchor.textContent = movie.title;
		linkAnchor.setAttribute('href', movie.imdbLink);
		linkAnchor.setAttribute('target', '_blank');
		linkAnchor.setAttribute('rel', 'noreferrer nofollow');

		titleCell.appendChild(linkAnchor);

		tr.appendChild(titleCell);

		const dateCell = document.createElement('td');
		dateCell.classList.add('center-align');
		dateCell.textContent = dayjs(movie.dateWatched).format('MM/DD/YYYY');

		tr.appendChild(dateCell);

		const ratingCell = document.createElement('td');
		ratingCell.classList.add('center-align');

		const ratingDisplay = document.createElement('rating-display');
		ratingDisplay.setAttribute('data-rating', movie.rating);
		ratingDisplay.setAttribute('data-size', 'md');
		ratingCell.appendChild(ratingDisplay);

		tr.appendChild(ratingCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');
		editButton.addEventListener('click', function () {
			editTelevisionShow(movie.televisionShowId);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(movie);
		});

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	return fragment;
}

function loadAbandonedMovieRows(movies) {
	const fragment = document.createDocumentFragment();

	movies.forEach((movie) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const titleCell = document.createElement('td');

		const linkAnchor = document.createElement('a');
		linkAnchor.textContent = movie.title;
		linkAnchor.setAttribute('href', movie.imdbLink);
		linkAnchor.setAttribute('target', '_blank');
		linkAnchor.setAttribute('rel', 'noreferrer nofollow');

		titleCell.appendChild(linkAnchor);

		tr.appendChild(titleCell);

		const dateCell = document.createElement('td');
		dateCell.classList.add('center-align');
		dateCell.textContent = dayjs(movie.dateWatched).format('MM/DD/YYYY');

		tr.appendChild(dateCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');
		editButton.addEventListener('click', function () {
			editTelevisionShow(movie.televisionShowId);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(movie);
		});

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	return fragment;
}

function loadRowsIntoTable() {
	clearTableRows();

	const movies = filtersActive ? filteredMovies : allMovies;

	if (movies.length === 0) {
		document.querySelector("tr.loading")?.classList.add("hidden");
		document.querySelector("tr.no-content")?.classList.remove("hidden");
		return;
	}

	let fragment = document.createDocumentFragment();

	if ([1, 2].includes(movieStatusId)) {
		// personal backlog, joint backlog & abandoned
		fragment = loadBacklogMovieRows(movies.sort((a, b) => sortBySortOrder(a.sortOrder, b.sortOrder)));
	} else if (movieStatusId === 4) {
		fragment = loadAbandonedMovieRows(movies.sort((a, b) => sortByDate(a.dateWatched, b.dateWatched)));
	} else {
		fragment = loadFinishedMovieRows(movies.sort((a, b) => sortByDate(a.dateWatched, b.dateWatched)));
	}

	document.querySelector("tr.no-content")?.classList.add("hidden");
	document.querySelector("tr.loading")?.classList.add("hidden");

	document.getElementById("movie-table-body").appendChild(fragment);
}

async function loadMovies() {
	const [data, error] = await Api.Get("movie");

	if (error) {
		showPageError(error);
		document.querySelector("tr.loading")?.classList.add("hidden");
		document.querySelector("tr.no-content")?.classList.remove("hidden");
		return;
	}

	allMovies = data.filter((m) => m.statusId === movieStatusId);

	loadRowsIntoTable();
}

function closeAddMovieForm() {
	document.querySelector('form[name="add-movie"]').reset();

	resetMultiselect('select#movie-genre');
	resetMultiselect('select#movie-service');

	document.querySelector('dialog#add-movie').close();
}

function buildVideoGenreSelectList(genres) {
	const fragment = document.createDocumentFragment();

	genres.forEach((genre) => {
		const opt = document.createElement('option');
		opt.setAttribute('value', genre.videoGenreId);
		opt.textContent = genre.name;

		fragment.appendChild(opt);
	});

	return fragment;
}

function buildVideoServiceSelectList(services) {
	const fragment = document.createDocumentFragment();

	services.forEach((service) => {
		const opt = document.createElement('option');
		opt.setAttribute('value', service.videoServiceId);
		opt.textContent = service.name;

		fragment.appendChild(opt);
	});

	return fragment;
}

function editMovie(movieId) {
	const movie = allMovies.find((m) => m.movieId === movieId);

	if (movie) {
		document.querySelector('#add-movie h2').textContent = 'Edit Movie';
		document.querySelector('input#movieId').value = movie.movieId;
		document.querySelector('input#movie-title').value = movie.title;
		document.querySelector('select#movie-status').value = movie.statusId;
		document.querySelector('input#movie-imdblink').value = movie.imdbLink;
		document.querySelector('input#movie-cover-url').value = movie.posterImageUrl;
		document.querySelector('input#movie-sort').value = movie.sortOrder;
		document.querySelector('input#movie-date').value = dayjs(movie.dateWatched).format('YYYY-MM-DD');
		document.querySelector('#movie-rating').setAttribute('rating', movie.rating);
		document.querySelector('textarea#movie-thoughts').value = movie.thoughts;

		setMultiselectValues(
			'select#movie-genre',
			movie.genres.map((g) => g.videoGenreId),
		);

		setMultiselectValues(
			'select#movie-service',
			movie.services.map((s) => s.videoServiceId),
		);

		document.querySelector('dialog#add-movie').showModal();
	}
}

function buildMovieFromForm() {
	return {
		movieId: parseInt(document.querySelector('#movieId').value),
		title: document.querySelector('#movie-title').value,
		statusId: parseInt(document.querySelector('#movie-status').value),
		imdbLink: document.querySelector('#movie-imdblink').value,
		posterImageUrl: document.querySelector('#movie-cover-url').value,
		sortOrder: parseInt(document.querySelector('#movie-sort').value),
		genres: getValuesFromMultiSelect('#movie-genre'),
		services: getValuesFromMultiSelect('#movie-service'),
		dateWatched: document.querySelector('#movie-date').value,
		rating: parseInt(document.querySelector('#movie-rating-value').value),
		thoughts: document.querySelector('#movie-thoughts').value,
	};
}

async function addMovie(values) {
	const [, error] = await Api.Post('movie', {
		data: {
			title: values.title,
			imdbLink: values.imdbLink,
			posterImageUrl: values.posterImageUrl,
			dateWatched: values.dateWatched,
			rating: values.rating,
			thoughts: values.thoughts,
			sortOrder: values.sortOrder,
			statusId: values.statusId,
			genres: values.genres,
			services: values.services,
		},
	});

	return error;
}

async function updateMovie(values) {
	const [, error] = await Api.Put(`movie/${values?.movieId}`, {
		data: {
			title: values.title,
			imdbLink: values.imdbLink,
			posterImageUrl: values.posterImageUrl,
			dateWatched: values.dateWatched,
			rating: values.rating,
			thoughts: values.thoughts,
			sortOrder: values.sortOrder,
			statusId: values.statusId,
			genres: values.genres,
			services: values.services,
		},
	});

	return error;
}

async function saveMovie() {
	hideModalError('add-movie-modal-error');

	const movie = buildMovieFromForm();

	const error = movie.movieId > 0 ? await updateMovie(movie) : await addMovie(movie);

	if (error) {
		showModalError(error, 'add-movie-modal-error');
		return;
	}

	currentPage = 1;

	await loadMovies();

	closeAddMovieForm();
}

function openDeleteConfirmation(movie) {
	document.getElementById('delete-movie-id').value = movie.movieId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the movie "${movie.title}"?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

async function deleteMovie() {
	const movieId = parseInt(document.getElementById('delete-movie-id').value);

	const [, error] = await Api.Delete(`movie/${movieId}`);

	if (error) {
		showPageError(error);
		document.querySelector('dialog.confirm-dialog').close();
		return;
	}

	await loadMovies();

	document.querySelector('dialog.confirm-dialog').close();
}

function buildMovieFiltersFromForm() {
	return {
		title: document.querySelector('#filter-movie-title').value,
		genreId: parseInt(document.querySelector('#filter-movie-genre').value),
		serviceId: parseInt(document.querySelector('#filter-movie-service').value),
	};
}

function clearFilters() {
	filtersActive = false;
	currentPage = 1;
	loadRowsIntoTable();
	document.querySelector('form[name="filter-movie"]').reset();
	document.querySelector('#clear-filters').classList.add('hidden');
	document.querySelector('dialog#filter-movie').close();
}

function applyFilters() {
	const { title, genreId, serviceId } = buildMovieFiltersFromForm();

	if (title === '' && genreId === 0 && serviceId === 0) {
		clearFilters();
		return;
	}

	filtersActive = true;

	let movies = [...allMovies];

	if (title !== '') {
		movies = movies.filter((tv) => tv.title.toLocaleLowerCase().includes(title.toLocaleLowerCase()));
	}

	if (genreId > 0) {
		movies = movies.filter((m) => m.genres.map((g) => g.videoGenreId).includes(genreId));
	}

	if (serviceId > 0) {
		movies = movies.filter((m) => m.services.map((s) => s.videoServiceId).includes(serviceId));
	}

	filteredMovies = [...movies];

	loadRowsIntoTable();

	document.querySelector('#clear-filters').classList.remove('hidden');

	document.querySelector('dialog#filter-movie').close();
}
