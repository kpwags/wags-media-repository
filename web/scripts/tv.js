let allTvShows = [];
let videoGenreData = [];
let videoServiceData = [];
let filtersActive = false;
let filteredLinks = [];
let tvStatusIds = [];

window.addEventListener('load', function () {
	tvStatusIds = document.querySelector('body').getAttribute('data-statusid').split(',').map((x) => parseInt(x));

	document.getElementById('add-new-tv-show').addEventListener('click', function () {
		document.querySelector('dialog#add-tv-show').showModal();
	});

	document.getElementById('tv-form-dialog-cancel').addEventListener('click', function () {
		closeAddTvShowForm();
	});

	document.querySelector('form[name="add-tv-show"]').addEventListener('submit', function(e) {
		e.preventDefault();

		console.log(buildTvFromForm());
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

	document.getElementById('tv-genre').appendChild(buildVideoGenreSelectList(videoGenreData));
}

async function loadVideoServices() {
	const [data, error] = await Api.Get('system/video-service');

	if (error) {
		showPageError(error);
		return;
	}

	videoServiceData = data;

	document.getElementById('tv-service').appendChild(buildVideoServiceSelectList(videoServiceData));
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

	if (allTvShows.length === 0) {
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	clearTableRows();

	const fragment = document.createDocumentFragment();

	allTvShows.forEach((tv) => {
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
		// editButton.addEventListener('click', function () {
		// 	editLink(link.linkId);
		// });

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		// deleteButton.addEventListener('click', function () {
		// 	openDeleteConfirmation(link);
		// });

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	document.querySelector('tr.loading')?.classList.add('hidden');

	document.getElementById('tv-table-body').appendChild(fragment);
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
	document.querySelector('dialog#add-tv-show').close();
}

function buildTvFromForm() {
	return {
		televisionShowId: parseInt(document.querySelector('#televisionShowId').value),
		title: document.querySelector('#tv-title').value,
		status: parseInt(document.querySelector('#tv-status').value),
		imdbLink: document.querySelector('#tv-imdblink').value,
		coverImageUrl: document.querySelector('#tv-cover-url').value,
		sortOrder: parseInt(document.querySelector('#tv-sort').value),
		genreIds: getValuesFromMultiSelect('#tv-genre'),
		serviceIds: getValuesFromMultiSelect('#tv-service'),
		currentSeasonEpisode: parseInt(document.querySelector('#current-episode').value),
		seasonEpisodeCount: parseInt(document.querySelector('#episode-count').value),
		rating: parseInt(document.querySelector('#tv-rating-value').value),
		thoughts: document.querySelector('#tv-thoughts').value,
	};
}