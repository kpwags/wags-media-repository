let allTvShows = [];
let videoGenreData = [];
let videoServiceData = [];
let filtersActive = false;
let filteredTvShows = [];
let tvStatusIds = [];

window.addEventListener('load', function () {
	tvStatusIds = document
		.querySelector('body')
		.getAttribute('data-statusid')
		.split(',')
		.map((x) => parseInt(x));

	document.getElementById('add-new-tv-show')?.addEventListener('click', function () {
		document.querySelector('#add-tv-show h2').textContent = 'Add TV Show';
		document.querySelector('dialog#add-tv-show').showModal();
	});

	document.getElementById('tv-form-dialog-cancel')?.addEventListener('click', function () {
		closeAddTvShowForm();
	});

	document.querySelector('form[name="add-tv-show"]')?.addEventListener('submit', function (e) {
		e.preventDefault();

		saveTvShow();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-no')?.addEventListener('click', function () {
		cancelOutOfConfirmDialog('#delete-tv-id');
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-yes')?.addEventListener('click', function () {
		deleteTvShow();
	});

	document.querySelector('#open-tv-filter')?.addEventListener('click', function () {
		document.querySelector('dialog#filter-tv').showModal();
	});

	document.querySelector('#tv-filter-cancel')?.addEventListener('click', function () {
		document.querySelector('dialog#filter-tv').close();
	});

	document.querySelector('#clear-filters')?.addEventListener('click', function () {
		clearFilters();
	});

	document.querySelector('form[name="filter-tv"]')?.addEventListener('submit', function (e) {
		e.preventDefault();

		applyFilters();
	});

	loadVideoGenres();
	loadVideoServices();
	loadTelevisionShows();
});

async function loadVideoGenres() {
	const [data, error] = await Api.Get('system/video-genre');

	if (error) {
		showPageError(error);
		return;
	}

	videoGenreData = data;

	document.getElementById('tv-genre')?.appendChild(buildVideoGenreSelectList(videoGenreData));
	document.getElementById('filter-tv-genre')?.appendChild(buildVideoGenreSelectList(videoGenreData));
}

async function loadVideoServices() {
	const [data, error] = await Api.Get('system/video-service');

	if (error) {
		showPageError(error);
		return;
	}

	videoServiceData = data;

	document.getElementById('tv-service')?.appendChild(buildVideoServiceSelectList(videoServiceData));
	document.getElementById('filter-tv-service')?.appendChild(buildVideoServiceSelectList(videoServiceData));
}

function loadRowsIntoTable() {
	clearTableRows();

	const tvShows = filtersActive ? filteredTvShows : allTvShows;

	if (tvShows.length === 0) {
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	let fragment = document.createDocumentFragment();

	if (tvStatusIds.filter((value) => [1, 2, 6].includes(value)).length > 0) {
		// personal backlog, joint backlog & abandoned
		fragment = loadBacklogTelevisionRows(tvShows);
	} else if (tvStatusIds.filter((value) => [3, 4].includes(value)).length > 0) {
		// current & between seasons
		fragment = loadCurrentTelevisionRows(tvShows);
	} else {
		fragment = loadFinishedTelevisionRows(tvShows);
	}

	document.querySelector('tr.no-content')?.classList.add('hidden');
	document.querySelector('tr.loading')?.classList.add('hidden');

	document.getElementById('tv-table-body').appendChild(fragment);

	if (document.querySelector('.table-row-count span')) {
		document.querySelector('.table-row-count span').textContent = tvShows.length;
	}
}

function loadBacklogTelevisionRows(tvShows) {
	const fragment = document.createDocumentFragment();

	tvShows.forEach((tv) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const sortCell = document.createElement('td');
		sortCell.classList.add('center-align');
		sortCell.textContent = tv.sortOrder ?? '';

		tr.appendChild(sortCell);

		const titleCell = document.createElement('td');

		const linkAnchor = document.createElement('a');
		linkAnchor.textContent = tv.title;
		linkAnchor.setAttribute('href', tv.imdbLink);
		linkAnchor.setAttribute('target', '_blank');
		linkAnchor.setAttribute('rel', 'noreferrer nofollow');

		titleCell.appendChild(linkAnchor);

		tr.appendChild(titleCell);

		const serviceCell = document.createElement('td');

		if (tv.services.length > 0) {
			const servicesList = buildTagList();

			for (const service of tv.services) {
				servicesList.appendChild(buildTagListItem(service.name, service.colorCode));
			}

			serviceCell.appendChild(servicesList);
		} else {
			serviceCell.textContent = '';
		}

		tr.appendChild(serviceCell);

		const genreCell = document.createElement('td');

		if (tv.genres.length > 0) {
			const genresList = buildTagList();

			for (const genre of tv.genres) {
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
			editTelevisionShow(tv.televisionShowId);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(tv);
		});

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	return fragment;
}

function loadCurrentTelevisionRows(tvShows) {
	const fragment = document.createDocumentFragment();

	tvShows.sort((a, b) => sortByTitle(a.title, b.title)).sort((a, b) => a.statusId - b.statusId);

	tvShows.forEach((tv) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const titleCell = document.createElement('td');

		const linkAnchor = document.createElement('a');
		linkAnchor.textContent = tv.title;
		linkAnchor.setAttribute('href', tv.imdbLink);
		linkAnchor.setAttribute('target', '_blank');
		linkAnchor.setAttribute('rel', 'noreferrer nofollow');

		titleCell.appendChild(linkAnchor);

		tr.appendChild(titleCell);

		const statusCell = document.createElement('td');

		const statusList = buildTagList();
		statusList.appendChild(buildTagListItem(tv.status.name, tv.status.colorCode));

		statusCell.appendChild(statusList);

		tr.appendChild(statusCell);

		const progressCell = document.createElement('td');

		const progressBar = document.createElement('progress-bar');
		progressBar.setAttribute('progress', tv.progress);

		progressCell.appendChild(progressBar);

		tr.appendChild(progressCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');
		editButton.addEventListener('click', function () {
			editTelevisionShow(tv.televisionShowId);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(tv);
		});

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	return fragment;
}

function loadFinishedTelevisionRows(tvShows) {
	const fragment = document.createDocumentFragment();

	tvShows.sort((a, b) => sortByTitle(a.title, b.title));

	tvShows.forEach((tv) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const titleCell = document.createElement('td');

		const linkAnchor = document.createElement('a');
		linkAnchor.textContent = tv.title;
		linkAnchor.setAttribute('href', tv.imdbLink);
		linkAnchor.setAttribute('target', '_blank');
		linkAnchor.setAttribute('rel', 'noreferrer nofollow');

		titleCell.appendChild(linkAnchor);

		tr.appendChild(titleCell);

		const ratingCell = document.createElement('td');
		ratingCell.classList.add('center-align');

		const ratingDisplay = document.createElement('rating-display');
		ratingDisplay.setAttribute('data-rating', tv.rating);
		ratingDisplay.setAttribute('data-size', 'md');
		ratingCell.appendChild(ratingDisplay);

		tr.appendChild(ratingCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');
		editButton.addEventListener('click', function () {
			editTelevisionShow(tv.televisionShowId);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(tv);
		});

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	return fragment;
}

async function loadTelevisionShows() {
	const [data, error] = await Api.Get('tv');

	if (error) {
		showPageError(error);
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	allTvShows = data.filter((tv) => tvStatusIds.includes(tv.statusId)).sort((a, b) => sortBySortOrder(a.sortOrder, b.sortOrder));

	loadRowsIntoTable();
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

function closeAddTvShowForm() {
	document.querySelector('form[name="add-tv-show"]').reset();

	resetMultiselect('select#tv-genre');
	resetMultiselect('select#tv-service');

	document.querySelector('dialog#add-tv-show').close();
}

function editTelevisionShow(televisionShowId) {
	const tvShow = allTvShows.find((t) => t.televisionShowId === televisionShowId);

	if (tvShow) {
		document.querySelector('#add-tv-show h2').textContent = 'Edit TV Show';
		document.querySelector('input#televisionShowId').value = tvShow.televisionShowId;
		document.querySelector('input#tv-title').value = tvShow.title;
		document.querySelector('select#tv-status').value = tvShow.statusId;
		document.querySelector('input#tv-imdblink').value = tvShow.imdbLink;
		document.querySelector('input#tv-cover-url').value = tvShow.coverImageUrl;
		document.querySelector('input#tv-sort').value = tvShow.sortOrder;
		document.querySelector('input#tv-current-episode').value = tvShow.currentSeasonEpisode;
		document.querySelector('input#tv-episode-count').value = tvShow.seasonEpisodeCount;
		document.querySelector('#tv-rating').setAttribute('rating', tvShow.rating);
		document.querySelector('textarea#tv-thoughts').value = tvShow.thoughts;

		setMultiselectValues(
			'select#tv-genre',
			tvShow.genres.map((g) => g.videoGenreId),
		);

		setMultiselectValues(
			'select#tv-service',
			tvShow.services.map((s) => s.videoServiceId),
		);

		document.querySelector('dialog#add-tv-show').showModal();
	}
}

function buildTvFromForm() {
	return {
		televisionShowId: parseInt(document.querySelector('#televisionShowId').value),
		title: document.querySelector('#tv-title').value,
		statusId: parseInt(document.querySelector('#tv-status').value),
		imdbLink: document.querySelector('#tv-imdblink').value,
		coverImageUrl: document.querySelector('#tv-cover-url').value,
		sortOrder: parseInt(document.querySelector('#tv-sort').value),
		genres: getValuesFromMultiSelect('#tv-genre'),
		services: getValuesFromMultiSelect('#tv-service'),
		currentSeasonEpisode: parseInt(document.querySelector('#tv-current-episode').value),
		seasonEpisodeCount: parseInt(document.querySelector('#tv-episode-count').value),
		rating: parseInt(document.querySelector('#tv-rating-value').value),
		thoughts: document.querySelector('#tv-thoughts').value,
	};
}

async function addTvShow(values) {
	const [, error] = await Api.Post('tv', {
		data: {
			title: values.title,
			imdbLink: values.imdbLink,
			coverImageUrl: values.coverImageUrl,
			rating: values.rating,
			thoughts: values.thoughts,
			sortOrder: values.sortOrder,
			statusId: values.statusId,
			seasonEpisodeCount: values.seasonEpisodeCount,
			currentSeasonEpisode: values.currentSeasonEpisode,
			genres: values.genres,
			services: values.services,
		},
	});

	return error;
}

async function updateTvShow(values) {
	const [, error] = await Api.Put(`tv/${values?.televisionShowId}`, {
		data: {
			title: values.title,
			imdbLink: values.imdbLink,
			coverImageUrl: values.coverImageUrl,
			rating: values.rating,
			thoughts: values.thoughts,
			sortOrder: values.sortOrder,
			statusId: values.statusId,
			seasonEpisodeCount: values.seasonEpisodeCount,
			currentSeasonEpisode: values.currentSeasonEpisode,
			genres: values.genres,
			services: values.services,
		},
	});

	return error;
}

async function saveTvShow() {
	hideModalError('add-tv-modal-error');

	const tvShow = buildTvFromForm();

	const error = tvShow.televisionShowId > 0 ? await updateTvShow(tvShow) : await addTvShow(tvShow);

	if (error) {
		showModalError(error, 'add-tv-modal-error');
		return;
	}

	currentPage = 1;

	await loadTelevisionShows();

	closeAddTvShowForm();
}

function openDeleteConfirmation(tvShow) {
	document.getElementById('delete-tv-id').value = tvShow.televisionShowId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the TV show "${tvShow.title}"?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

async function deleteTvShow() {
	const televisionShowId = parseInt(document.getElementById('delete-tv-id').value);

	const [, error] = await Api.Delete(`tv/${televisionShowId}`);

	if (error) {
		showPageError(error);
		document.querySelector('dialog.confirm-dialog').close();
		return;
	}

	await loadTelevisionShows();

	document.querySelector('dialog.confirm-dialog').close();
}

function buildTvFiltersFromForm() {
	return {
		title: document.querySelector('#filter-tv-title').value,
		genreId: parseInt(document.querySelector('#filter-tv-genre').value),
		serviceId: parseInt(document.querySelector('#filter-tv-service').value),
	};
}

function clearFilters() {
	filtersActive = false;
	loadRowsIntoTable();
	document.querySelector('form[name="filter-tv"]').reset();
	document.querySelector('#clear-filters').classList.add('hidden');
	document.querySelector('dialog#filter-tv').close();
}

function applyFilters() {
	const { title, genreId, serviceId } = buildTvFiltersFromForm();

	if (title === '' && genreId === 0 && serviceId === 0) {
		clearFilters();
		return;
	}

	filtersActive = true;

	let tvShows = [...allTvShows];

	if (title !== '') {
		tvShows = tvShows.filter((tv) => tv.title.toLocaleLowerCase().includes(title.toLocaleLowerCase()));
	}

	if (genreId > 0) {
		tvShows = tvShows.filter((tv) => tv.genres.map((g) => g.videoGenreId).includes(genreId));
	}

	if (serviceId > 0) {
		tvShows = tvShows.filter((tv) => tv.services.map((s) => s.videoServiceId).includes(serviceId));
	}

	filteredTvShows = [...tvShows];

	loadRowsIntoTable();

	document.querySelector('#clear-filters').classList.remove('hidden');

	document.querySelector('dialog#filter-tv').close();
}
