let videoGames = [];
let genres = [];
let systems = [];
let filtersActive = false;
let filteredVideoGames = [];
let videoGameStatusId = 1;

window.addEventListener('load', function () {
	videoGameStatusId = parseInt(document.querySelector('body').getAttribute("data-statusid"));

	document.getElementById('add-new-video-game')?.addEventListener('click', function () {
		document.querySelector('#add-video-game h2').textContent = 'Add Game';
		document.querySelector('dialog#add-video-game').showModal();
	});

	document.getElementById('video-game-form-dialog-cancel')?.addEventListener('click', function () {
		closeAddVideoGameForm();
	});

	document.querySelector('form[name="add-video-game"]')?.addEventListener('submit', function (e) {
		e.preventDefault();

		saveVideoGame();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-no')?.addEventListener('click', function () {
		cancelOutOfConfirmDialog('#delete-video-game-id');
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-yes')?.addEventListener('click', function () {
		deleteVideoGame();
	});

	document.querySelector('#open-video-game-filter')?.addEventListener('click', function () {
		document.querySelector('dialog#filter-video-game').showModal();
	});

	document.querySelector('#video-game-filter-cancel')?.addEventListener('click', function () {
		document.querySelector('dialog#filter-video-game').close();
	});

	document.querySelector('#clear-filters')?.addEventListener('click', function () {
		clearFilters();
	});

	document.querySelector('form[name="filter-video-game"]')?.addEventListener('submit', function (e) {
		e.preventDefault();

		applyFilters();
	});

	loadVideoGames();
	loadGenres();
	loadSystems();
});

async function loadGenres() {
	const [data, error] = await Api.Get("video-game/genre");

	if (error) {
		showPageError(error);
		return;
	}

	genres = data;

	document.getElementById("video-game-genre")?.appendChild(buildSelectList(genres, 'videoGameGenreId', 'name'));
	document.getElementById("filter-video-game-genre")?.appendChild(buildSelectList(genres, 'videoGameGenreId', 'name'));
}

async function loadSystems() {
	const [data, error] = await Api.Get("video-game/system");

	if (error) {
		showPageError(error);
		return;
	}

	systems = data;

	document.getElementById("video-game-system")?.appendChild(buildSelectList(systems, 'videoGameSystemId', 'name'));
	document.getElementById("filter-video-game-system")?.appendChild(buildSelectList(systems, 'videoGameSystemId', 'name'));
}

function loadBacklogVideoGameRows(games) {
	const fragment = document.createDocumentFragment();

	games.forEach((game) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const sortCell = document.createElement('td');
		sortCell.classList.add('center-align');
		sortCell.textContent = game.sortOrder ?? '';

		tr.appendChild(sortCell);

		const titleCell = document.createElement('td');

		titleCell.appendChild(createLinkElement(game.title, game.link, true));

		tr.appendChild(titleCell);

		const systemCell = document.createElement('td');

		if (game.systems.length > 0) {
			const systemsList = buildTagList();

			for (const system of game.systems) {
				systemsList.appendChild(buildTagListItem(system.name, system.colorCode));
			}

			systemCell.appendChild(systemsList);
		} else {
			systemCell.textContent = '';
		}

		tr.appendChild(systemCell);

		const genreCell = document.createElement('td');

		if (game.genres.length > 0) {
			const genreList = buildTagList();

			for (const genre of game.genres) {
				genreList.appendChild(buildTagListItem(genre.name, genre.colorCode));
			}

			genreCell.appendChild(genreList);
		} else {
			genreCell.textContent = '';
		}

		tr.appendChild(genreCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');
		editButton.addEventListener('click', function () {
			editVideoGame(game);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(game);
		});

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	return fragment;
}

function loadCurrentVideoGameRows(games) {
	const fragment = document.createDocumentFragment();

	games.forEach((game) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const titleCell = document.createElement('td');

		titleCell.appendChild(createLinkElement(game.title, game.link, true));

		tr.appendChild(titleCell);

		const systemCell = document.createElement('td');

		if (game.systems.length > 0) {
			const systemsList = buildTagList();

			for (const system of game.systems) {
				systemsList.appendChild(buildTagListItem(system.name, system.colorCode));
			}

			systemCell.appendChild(systemsList);
		} else {
			systemCell.textContent = '';
		}

		tr.appendChild(systemCell);

		const dateCell = document.createElement('td');
		dateCell.classList.add('center-align');
		dateCell.textContent = game.dateStarted ? displayDate(game.dateStarted) : '';

		tr.appendChild(dateCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');
		editButton.addEventListener('click', function () {
			editVideoGame(game);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(game);
		});

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	return fragment;
}

function loadFinishedVideoGameRows(games) {
	const fragment = document.createDocumentFragment();

	games.forEach((game) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const titleCell = document.createElement('td');

		titleCell.appendChild(createLinkElement(game.title, game.link, true));

		tr.appendChild(titleCell);

		const systemCell = document.createElement('td');

		if (game.systems.length > 0) {
			const systemsList = buildTagList();

			for (const system of game.systems) {
				systemsList.appendChild(buildTagListItem(system.name, system.colorCode));
			}

			systemCell.appendChild(systemsList);
		} else {
			systemCell.textContent = '';
		}

		tr.appendChild(systemCell);

		const dateCell = document.createElement('td');
		dateCell.classList.add('center-align');
		dateCell.textContent = game.dateCompleted ? displayDate(game.dateCompleted) : '';

		tr.appendChild(dateCell);

		const ratingCell = document.createElement('td');
		ratingCell.classList.add('center-align');

		const ratingDisplay = document.createElement('rating-display');
		ratingDisplay.setAttribute('data-rating', game.rating);
		ratingDisplay.setAttribute('data-size', 'md');
		ratingCell.appendChild(ratingDisplay);

		tr.appendChild(ratingCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');
		editButton.addEventListener('click', function () {
			editVideoGame(game);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(game);
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

	const games = filtersActive ? filteredVideoGames : videoGames;

	if (games.length === 0) {
		document.querySelector("tr.loading")?.classList.add("hidden");
		document.querySelector("tr.no-content")?.classList.remove("hidden");
		return;
	}

	let fragment = document.createDocumentFragment();

	switch (videoGameStatusId) {
		case 1:
			fragment = loadBacklogVideoGameRows(games.sort((a, b) => sortBySortOrder(a.sortOrder, b.sortOrder)));
			break;
		case 2:
			fragment = loadCurrentVideoGameRows(games.sort((a, b) => sortByTitle(a.title, b.title)));
			break;
		case 3:
			fragment = loadFinishedVideoGameRows(games.sort((a, b) => sortByDate(a.dateCompleted, b.dateCompleted)));
			break;
		default:
			document.querySelector("tr.loading")?.classList.add("hidden");
			document.querySelector("tr.no-content")?.classList.remove("hidden");
			return;
	}

	document.querySelector("tr.no-content")?.classList.add("hidden");
	document.querySelector("tr.loading")?.classList.add("hidden");

	document.getElementById("video-game-table-body").appendChild(fragment);

	if (document.querySelector('.table-row-count span')) {
		document.querySelector('.table-row-count span').textContent = games.length;
	}
}

async function loadVideoGames() {
	const [data, error] = await Api.Get("video-game");

	if (error) {
		showPageError(error);
		document.querySelector("tr.loading")?.classList.add("hidden");
		document.querySelector("tr.no-content")?.classList.remove("hidden");
		return;
	}

	videoGames = data.filter((vg) => vg.videoGameStatusId === videoGameStatusId);

	loadRowsIntoTable();
}

function closeAddVideoGameForm() {
	document.querySelector('form[name="add-video-game"]').reset();

	resetMultiselect('select#video-game-genre');
	resetMultiselect('select#video-game-system');

	document.querySelector('dialog#add-video-game').close();
}

function editVideoGame(game) {
	if (game) {
		document.querySelector('#add-video-game h2').textContent = 'Edit Game';
		document.querySelector('input#videoGameId').value = game.videoGameId;
		document.querySelector('input#video-game-title').value = game.title;
		document.querySelector('select#video-game-status').value = game.videoGameStatusId;
		document.querySelector('select#video-game-completion-status').value = game.videoGameCompletionId;
		document.querySelector('input#video-game-link').value = game.link;
		document.querySelector('input#video-game-cover-url').value = game.coverImageUrl;
		document.querySelector('input#video-game-sort').value = game.sortOrder;

		if (game.dateStarted) {
			document.querySelector('input#video-game-date-started').value = displayDate(game.dateStarted, 'YYYY-MM-DD');
		}

		if (game.dateCompleted) {
			document.querySelector('input#video-game-date-completed').value = displayDate(game.dateCompleted, 'YYYY-MM-DD');
		}

		document.querySelector('#video-game-rating').setAttribute('rating', game.rating);
		document.querySelector('textarea#video-game-thoughts').value = game.thoughts;

		setMultiselectValues('select#video-game-genre', game.genres.map((g) => g.videoGameGenreId));
		setMultiselectValues('select#video-game-system', game.systems.map((s) => s.videoGameSystemId));

		document.querySelector('dialog#add-video-game').showModal();
	}
}

function buildVideoGameFromForm() {
	return {
		videoGameId: parseInt(document.querySelector('#videoGameId').value),
		title: document.querySelector('#video-game-title').value,
		videoGameStatusId: parseInt(document.querySelector('#video-game-status').value),
		videoGameCompletionId: parseInt(document.querySelector('#video-game-completion-status').value),
		link: document.querySelector('#video-game-link').value,
		coverImageUrl: document.querySelector('#video-game-cover-url').value,
		sortOrder: parseInt(document.querySelector('#video-game-sort').value),
		genres: getValuesFromMultiSelect('#video-game-genre'),
		systems: getValuesFromMultiSelect('#video-game-system'),
		dateStarted: document.querySelector('#video-game-date-started').value,
		dateCompleted: document.querySelector('#video-game-date-completed').value,
		rating: parseInt(document.querySelector('#video-game-rating-value').value),
		thoughts: document.querySelector('#video-game-thoughts').value,
	};
}

async function addVideoGame(values) {
	const [, error] = await Api.Post('video-game', {
		data: {
			videoGameStatusId: values.videoGameStatusId,
			videoGameCompletionId: values.videoGameCompletionId,
			title: values.title,
			link: values.link,
			dateStarted: values.dateStarted,
			dateCompleted: values.dateCompleted,
			rating: values.rating,
			thoughts: values.thoughts,
			coverImageUrl: values.coverImageUrl,
			sortOrder: values.sortOrder,
			genres: values.genres,
			systems: values.systems,
		},
	});

	return error;
}

async function updateVideoGame(values) {
	const [, error] = await Api.Put(`video-game/${values?.videoGameId}`, {
		data: {
			videoGameStatusId: values.videoGameStatusId,
			videoGameCompletionId: values.videoGameCompletionId,
			title: values.title,
			link: values.link,
			dateStarted: values.dateStarted,
			dateCompleted: values.dateCompleted,
			rating: values.rating,
			thoughts: values.thoughts,
			coverImageUrl: values.coverImageUrl,
			sortOrder: values.sortOrder,
			genres: values.genres,
			systems: values.systems,
		},
	});

	return error;
}

async function saveVideoGame() {
	hideModalError('add-video-game-modal-error');

	const game = buildVideoGameFromForm();

	const error = game.videoGameId > 0 ? await updateVideoGame(game) : await addVideoGame(game);

	if (error) {
		showModalError(error, 'add-video-game-modal-error');
		return;
	}

	clearFilters();

	await loadVideoGames();

	closeAddVideoGameForm();
}

function openDeleteConfirmation(game) {
	document.getElementById('delete-video-game-id').value = game.videoGameId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the game "${game.title}"?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

async function deleteVideoGame() {
	const id = parseInt(document.getElementById('delete-video-game-id').value);

	const [, error] = await Api.Delete(`video-game/${id}`);

	if (error) {
		showPageError(error);
		document.querySelector('dialog.confirm-dialog').close();
		return;
	}

	await loadVideoGames();

	document.getElementById('delete-video-game-id').value = '0';
	document.querySelector('dialog.confirm-dialog').close();
}

function buildVideoGameFiltersFromForm() {
	return {
		title: document.querySelector('#filter-video-game-title').value,
		genreId: parseInt(document.querySelector('#filter-video-game-genre').value),
		systemId: parseInt(document.querySelector('#filter-video-game-system').value),
	};
}

function clearFilters() {
	filtersActive = false;
	loadRowsIntoTable();
	document.querySelector('form[name="filter-video-game"]').reset();
	document.querySelector('#clear-filters').classList.add('hidden');
	document.querySelector('dialog#filter-video-game').close();
}

function applyFilters() {
	const { title, genreId, systemId } = buildVideoGameFiltersFromForm();

	if (title === '' && genreId === 0 && systemId === 0) {
		clearFilters();
		return;
	}

	filtersActive = true;

	let games = [...videoGames];

	if (title !== '') {
		games = games.filter((vg) => vg.title.toLocaleLowerCase().includes(title.toLocaleLowerCase()));
	}

	if (genreId > 0) {
		games = games.filter((bg) => bg.genres.map((g) => g.videoGameGenreId).includes(genreId));
	}

	if (systemId > 0) {
		games = games.filter((m) => m.systems.map((s) => s.videoGameSystemId).includes(systemId));
	}

	filteredVideoGames = [...games];

	loadRowsIntoTable();

	document.querySelector('#clear-filters').classList.remove('hidden');

	document.querySelector('dialog#filter-video-game').close();
}
