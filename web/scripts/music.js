let albums = [];
let genres = [];
let filtersActive = false;
let filteredAlbums = [];

window.addEventListener('load', function () {
	loadAlbums();
	loadGenres();

	document.querySelector('#open-music-filter')?.addEventListener('click', function () {
		document.querySelector('dialog#filter-music').showModal();
	});

	document.querySelector('#filter-music-cancel')?.addEventListener('click', function () {
		document.querySelector('dialog#filter-music').close();
	});

	document.querySelector('#clear-filters')?.addEventListener('click', function () {
		clearFilters();
	});

	document.querySelector('form[name="filter-music"]').addEventListener('submit', function (e) {
		e.preventDefault();

		applyFilters();
	});

	document.getElementById('add-new-album')?.addEventListener('click', function () {
		document.querySelector('dialog#add-album h2').textContent = 'Add Album';
		document.querySelector('dialog#add-album').showModal();
	});

	document.getElementById('album-form-dialog-cancel')?.addEventListener('click', function () {
		closeAddAlbumForm();
	});

	document.querySelector('form[name="add-album"]').addEventListener('submit', function (e) {
		e.preventDefault();

		saveAlbum();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-no')?.addEventListener('click', function () {
		cancelOutOfConfirmDialog('#delete-album-id');
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-yes')?.addEventListener('click', function () {
		deleteAlbum();
	});

	document.getElementById('edit-tracks-form-add-track')?.addEventListener('click', function () {
		addTrackToForm();
	});

	document.getElementById('edit-tracks-form-dialog-cancel')?.addEventListener('click', function () {
		closeEditTracksForm();
	});

	document.querySelector('form[name="edit-tracks"]').addEventListener('submit', function (e) {
		e.preventDefault();

		saveAlbumTracks();
	});
});

async function loadAlbums() {
	const [data, error] = await Api.Get('music');

	if (error) {
		showPageError(error);
		return;
	}

	albums = data;

	loadRowsIntoTable();
}

async function loadGenres() {
	const [data, error] = await Api.Get('music/genre');

	if (error) {
		showPageError(error);
		return;
	}

	genres = data;

	document.getElementById("music-genre")?.appendChild(buildSelectList(genres, 'musicGenreId', 'name'));
	document.getElementById('filter-genre')?.appendChild(buildSelectList(genres, 'musicGenreId', 'name'));
}

function loadRowsIntoTable() {
	clearTableRows();

	const music = filtersActive ? filteredAlbums : albums;

	if (music.length === 0) {
		document.querySelector("tr.loading")?.classList.add("hidden");
		document.querySelector("tr.no-content")?.classList.remove("hidden");
		return;
	}

	const fragment = document.createDocumentFragment();

	music.forEach((album) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const artistCell = document.createElement('td');
		artistCell.textContent = album.artist;

		tr.appendChild(artistCell);

		const albumTitleCell = document.createElement('td');
		albumTitleCell.textContent = album.title;

		tr.appendChild(albumTitleCell);

		const formatsCell = document.createElement('td');

		if (album.formats.length > 0) {
			const formatsList = buildTagList();

			for (const format of album.formats) {
				formatsList.appendChild(buildTagListItem(format.name, format.colorCode));
			}

			formatsCell.appendChild(formatsList);
		} else {
			formatsCell.textContent = '';
		}

		tr.appendChild(formatsCell);

		const genreCell = document.createElement('td');

		if (album.genres.length > 0) {
			const genresList = buildTagList();

			for (const genre of album.genres) {
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
			editAlbum(album);
		});

		const editTracksButton = document.createElement('button');
		editTracksButton.textContent = 'Tracks';
		editTracksButton.classList.add('btn-link');
		editTracksButton.addEventListener('click', function () {
			editTracksForAlbum(album);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(album);
		});

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(editTracksButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	document.querySelector("tr.no-content")?.classList.add("hidden");
	document.querySelector("tr.loading")?.classList.add("hidden");

	document.getElementById("music-table-body").appendChild(fragment);
}

function buildMusicFiltersFromForm() {
	return {
		title: document.querySelector('#filter-name').value,
		genreId: parseInt(document.querySelector('#filter-genre').value),
		formatId: parseInt(document.querySelector('#filter-format').value),
	};
}

function clearFilters() {
	filtersActive = false;
	loadRowsIntoTable();
	document.querySelector('form[name="filter-music"]').reset();
	document.querySelector('#clear-filters').classList.add('hidden');
	document.querySelector('dialog#filter-music').close();
}

function applyFilters() {
	const { title, genreId, formatId } = buildMusicFiltersFromForm();

	if (title === '' && genreId === 0 && formatId === 0) {
		clearFilters();
		return;
	}

	filtersActive = true;

	let music = [...albums];

	if (title !== '') {
		music = music.filter((a) => a.title.toLocaleLowerCase().includes(title.toLocaleLowerCase()) || a.artist.toLocaleLowerCase().includes(title.toLocaleLowerCase()));
	}

	if (genreId > 0) {
		music = music.filter((a) => a.genres.map((g) => g.musicGenreId).includes(genreId));
	}

	if (formatId > 0) {
		music = music.filter((a) => a.formats.map((f) => f.musicFormatId).includes(formatId));
	}

	filteredAlbums = [...music];

	loadRowsIntoTable();

	document.querySelector('#clear-filters').classList.remove('hidden');

	document.querySelector('dialog#filter-music').close();
}

function closeAddAlbumForm() {
	document.querySelector('form[name="add-album"]').reset();

	resetMultiselect('select#music-genre');
	resetMultiselect('select#music-format');

	document.querySelector('dialog#add-album').close();
}

function editAlbum(album) {
	document.querySelector('dialog#add-album h2').textContent = 'Edit Album';

	document.querySelector('input#musicAlbumId').value = album.musicAlbumId;
	document.querySelector('input#album-title').value = album.title;
	document.querySelector('input#album-artist').value = album.artist;
	document.querySelector('input#album-cover').value = album.coverImageUrl;
	document.querySelector('textarea#album-thoughts').value = album.thoughts;
	document.querySelector('input#is-top-ten').checked = album.isTopTen;
	document.querySelector('input#show-on-now').checked = album.showOnNowPage;

	setMultiselectValues('select#music-genre', album.genres.map((g) => g.musicGenreId));
	setMultiselectValues('select#music-format', album.formats.map((f) => f.musicFormatId));

	document.querySelector('dialog#add-album').showModal();
}

function buildAlbum() {
	return {
		musicAlbumId: parseInt(document.querySelector('input#musicAlbumId').value),
		artist: document.querySelector('input#album-artist').value,
		coverImageUrl: document.querySelector('input#album-cover').value,
		formats: getValuesFromMultiSelect('#music-format'),
		genres: getValuesFromMultiSelect('#music-genre'),
		isTopTen: document.querySelector('input#is-top-ten').checked,
		showOnNowPage: document.querySelector('input#show-on-now').checked,
		thoughts: document.querySelector('textarea#album-thoughts').value,
		title: document.querySelector('input#album-title').value,
	}
}

async function addAlbum(values) {
	const [, error] = await Api.Post('music', {
		data: {
			artist: values.artist,
			title: values.title,
			coverImageUrl: values.coverImageUrl,
			thoughts: values.thoughts,
			isTopTen: values.isTopTen,
			showOnNowPage: values.showOnNowPage,
			genres: values.genres,
			formats: values.formats,
		},
	});

	return error;
}

async function updateAlbum(values) {
	const [, error] = await Api.Put(`music/${values.musicAlbumId}`, {
		data: {
			artist: values.artist,
			title: values.title,
			coverImageUrl: values.coverImageUrl,
			thoughts: values.thoughts,
			isTopTen: values.isTopTen,
			showOnNowPage: values.showOnNowPage,
			genres: values.genres,
			formats: values.formats,
		},
	});

	return error;
}

async function saveAlbum() {
	hideModalError('add-album-modal-error');

	const album = buildAlbum();

	const error = album.musicAlbumId > 0 ? await updateAlbum(album) : await addAlbum(album);

	if (error) {
		showModalError(error, 'add-album-modal-error');
		return;
	}

	currentPage = 1;

	clearFilters();

	await loadAlbums();

	closeAddAlbumForm();
}

function openDeleteConfirmation(album) {
	document.getElementById('delete-album-id').value = album.musicAlbumId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the album "${album.title}" by ${album.artist}?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

async function deleteAlbum() {
	const id = parseInt(document.getElementById('delete-album-id').value);

	const [, error] = await Api.Delete(`music/${id}`);

	if (error) {
		showPageError(error);
		document.querySelector('dialog.confirm-dialog').close();
		return;
	}

	clearFilters();

	await loadAlbums();

	document.querySelector('dialog.confirm-dialog').close();
}

function editTracksForAlbum(album) {
	document.querySelector('dialog#edit-album-tracks h3').textContent = `${album.artist} - ${album.title}`;
	document.getElementById('edit-tracks-album-id').value = album.musicAlbumId;

	if (album.tracks.length > 0) {
		const fragment = document.createDocumentFragment();

		for (let i = 0; i < album.tracks.length; i += 1) {
			const track = album.tracks[i];

			fragment.appendChild(buildHtmlFragmentForTrack(track.musicAlbumTrackId, i + 1, track.trackNumber, track.title));
		}

		document.getElementById('tracks').appendChild(fragment);
	} else {
		const trackRow = buildHtmlFragmentForTrack();
		document.getElementById('tracks').appendChild(trackRow);
	}

	document.querySelector('dialog#edit-album-tracks').showModal();
}

function closeEditTracksForm() {
	document.getElementById('edit-tracks-album-id').value = 0;
	document.getElementById('tracks').innerHTML = '';
	document.querySelector('dialog#edit-album-tracks').close();
}

function buildHtmlFragmentForTrack(musicAlbumTrackId = 0, trackId = 1, trackNumber = 1, trackTitle = '') {
	const trackRow = document.createElement('fieldset');
	trackRow.classList.add('track-row');
	trackRow.setAttribute('data-trackid', musicAlbumTrackId);
	trackRow.setAttribute('data-trackkey', trackId);

	const legend = document.createElement('legend');
	legend.classList.add('hidden');
	legend.textContent = 'Album Track';

	trackRow.appendChild(legend);

	// Track Number
	const trackNumberField = document.createElement('div');
	trackNumberField.classList.add('track-number');

	const trackNumberLabel = document.createElement('label');
	trackNumberLabel.setAttribute('for', `track-number-${trackId}`);
	trackNumberLabel.textContent = 'Track #';

	const trackNumberInput = document.createElement('input');
	trackNumberInput.setAttribute('id', `track-number-${trackId}`);
	trackNumberInput.setAttribute('type', 'text');
	trackNumberInput.setAttribute('name', `track-number`);
	trackNumberInput.setAttribute('required', true);
	trackNumberInput.setAttribute('value', trackNumber)

	trackNumberLabel.appendChild(trackNumberInput);
	trackNumberField.appendChild(trackNumberLabel);

	// Track Title
	const trackTitleField = document.createElement('div');
	trackTitleField.classList.add('track-title');

	const trackTitleLabel = document.createElement('label');
	trackTitleLabel.setAttribute('for', `track-title-${trackId}`);
	trackTitleLabel.textContent = 'Title';

	const trackTitleInput = document.createElement('input');
	trackTitleInput.setAttribute('id', `track-title-${trackId}`);
	trackTitleInput.setAttribute('type', 'text');
	trackTitleInput.setAttribute('name', `track-title`);
	trackTitleInput.setAttribute('required', true);
	trackTitleInput.setAttribute('value', trackTitle)

	trackTitleLabel.appendChild(trackTitleInput);
	trackTitleField.appendChild(trackTitleLabel);

	// Delete Button
	const deleteButton = document.createElement('button');
	deleteButton.classList.add('btn-danger');
	deleteButton.setAttribute('type', 'button');
	deleteButton.textContent = 'Delete';
	deleteButton.addEventListener('click', function () {
		removeTrack(trackId);
	});

	trackRow.appendChild(trackNumberField);
	trackRow.appendChild(trackTitleField);
	trackRow.appendChild(deleteButton);

	return trackRow;
}

function removeTrack(trackId) {
	const track = document.querySelector(`fieldset[data-trackkey="${trackId}"]`);
	track.remove();
}

function getNextTrackIdAndNumber() {
	const trackContainer = document.getElementById('tracks');
	const existingTracks = trackContainer.querySelectorAll('fieldset input[name="track-number"]');

	if (existingTracks.length === 0) {
		return {
			trackId: 1,
			trackNumber: 1,
		};
	}

	let maxTrackId = 1;
	let maxTrackNumber = 1;

	for (const track of existingTracks) {
		const trackId = parseInt(track.getAttribute('id').replace('track-number-', ''));
		const trackNumber = parseInt(track.value);

		if (trackId > maxTrackId) {
			maxTrackId = trackId;
		}

		if (trackNumber > maxTrackNumber) {
			maxTrackNumber = trackNumber;
		}
	}

	return {
		trackId: maxTrackId + 1,
		trackNumber: maxTrackNumber + 1
	};
}

function addTrackToForm() {
	const { trackId, trackNumber } = getNextTrackIdAndNumber();

	document.getElementById('tracks').appendChild(buildHtmlFragmentForTrack(0, trackId, trackNumber));
}

function getTracks() {
	const tracks = [];

	const trackContainer = document.getElementById('tracks');
	const existingTracks = trackContainer.querySelectorAll('fieldset');

	for (const track of existingTracks) {
		const trackNumberInput = track.querySelector('input[name="track-number"]');
		const trackTitleInput = track.querySelector('input[name="track-title"]');

		const trackNumber = parseInt(trackNumberInput.value);
		const title = trackTitleInput.value;

		tracks.push({
			trackNumber,
			title,
		});
	}

	return tracks;
}

async function saveAlbumTracks() {
	const albumId = parseInt(document.getElementById('edit-tracks-album-id').value);
	const tracks = getTracks();

	const [, error] = await Api.Put(`music/tracks/${albumId}`, {
		data: {
			tracks,
		},
	});

	if (error) {
		showModalError(error, 'edit-tracks-modal-error');
		return;
	}

	closeEditTracksForm();
}
