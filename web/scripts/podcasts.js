let allPodcasts = [];
let podcastCategories = [];
let filtersActive = false;
let filteredPodcasts = [];

window.addEventListener('load', function () {
	loadCategories();
	loadPodcasts();

	document.querySelector('#open-podcasts-filter')?.addEventListener('click', function () {
		document.querySelector('dialog#filter-podcasts').showModal();
	});

	document.querySelector('#podcast-filter-cancel')?.addEventListener('click', function () {
		document.querySelector('dialog#filter-podcasts').close();
	});

	document.querySelector('#clear-filters')?.addEventListener('click', function () {
		clearFilters();
	});

	document.getElementById('add-new-podcast')?.addEventListener('click', function () {
		document.querySelector('#add-podcast h2').textContent = 'Add Podcast';
		document.querySelector('dialog#add-podcast').showModal();
	});

	document.querySelector('form[name="add-podcast"]')?.addEventListener('submit', function (e) {
		e.preventDefault();
		savePodcast();
	});

	document.querySelector('form[name="filter-podcasts"]')?.addEventListener('submit', function (e) {
		e.preventDefault();
		applyFilters();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-no')?.addEventListener('click', function () {
		cancelOutOfConfirmDialog('#delete-podcast-id');
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-yes')?.addEventListener('click', function () {
		deletePodcast();
	});

	document.getElementById('podcast-form-dialog-cancel')?.addEventListener('click', function () {
		closeAddForm();
	});
});

async function loadCategories() {
	const [data, error] = await Api.Get('podcast/category');

	if (error) {
		showPageError(error);
		return;
	}

	podcastCategories = data;

	document.getElementById('podcast-category').appendChild(buildSelectList(podcastCategories, 'podcastCategoryId', 'name'));
	document.getElementById('filter-podcast-category').appendChild(buildSelectList(podcastCategories, 'podcastCategoryId', 'name'));
}

async function loadPodcasts() {
	clearTableRows();

	const [data, error] = await Api.Get('podcast');

	if (error) {
		showPageError(error);
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	if (data.length === 0) {
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	allPodcasts = data;

	loadRowsIntoTable();
}

function loadRowsIntoTable() {
	clearTableRows();

	const podcasts = filtersActive
		? filteredPodcasts
		: [...allPodcasts];

	const fragment = document.createDocumentFragment();

	podcasts.forEach((podcast) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const nameCell = document.createElement('td');

		const linkAnchor = createLinkElement(podcast.name, podcast.link, true);
		nameCell.appendChild(linkAnchor);

		tr.appendChild(nameCell);

		const categoryCell = document.createElement('td');
		categoryCell.classList.add('center-align');

		const categoryTag = document.createElement('div');
		categoryTag.classList.add('tag');
		categoryTag.setAttribute('style', `background: ${podcast.category.colorCode};`);
		categoryTag.textContent = podcast.category.name;

		categoryCell.appendChild(categoryTag);

		tr.appendChild(categoryCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');
		editButton.addEventListener('click', function () {
			editPodcast(podcast);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(podcast);
		});

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	document.querySelector('tr.loading')?.classList.add('hidden');

	document.getElementById('podcast-table-body').appendChild(fragment);
}

function buildFiltersFromForm() {
	return {
		name: document.querySelector('#filter-podcast-name').value,
		categoryId: parseInt(document.querySelector('#filter-podcast-category').value),
	};
}

function clearFilters() {
	filtersActive = false;
	loadRowsIntoTable();
	document.querySelector('form[name="filter-podcasts"]').reset();
	document.querySelector('#clear-filters').classList.add('hidden');
	document.querySelector('dialog#filter-podcasts').close();
}

function applyFilters() {
	const { name, categoryId } = buildFiltersFromForm();

	if (name === '' && categoryId === 0) {
		clearFilters();
		return;
	}

	filtersActive = true;

	let podcasts = [...allPodcasts];

	if (name !== '') {
		podcasts = podcasts.filter((p) => p.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()));
	}

	if (categoryId > 0) {
		podcasts = podcasts.filter((p) => p.podcastCategoryId === categoryId);
	}

	filteredPodcasts = [...podcasts];

	loadRowsIntoTable();

	document.querySelector('#clear-filters').classList.remove('hidden');

	document.querySelector('dialog#filter-podcasts').close();
}

function openDeleteConfirmation(podcast) {
	document.getElementById('delete-podcast-id').value = podcast.podcastId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the podcast "${podcast.name}"?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

async function deletePodcast() {
	const podcastId = parseInt(document.getElementById('delete-podcast-id').value);

	const [, error] = await Api.Delete(`podcast/${podcastId}`);

	if (error) {
		showPageError(error);
		document.querySelector('dialog.confirm-dialog').close();
		return;
	}

	clearFilters();

	await loadPodcasts();

	document.querySelector('dialog.confirm-dialog').close();
}

function closeAddForm() {
	document.querySelector('form[name="add-podcast"]').reset();
	document.querySelector('dialog#add-podcast').close();
}

function editPodcast(podcast) {
	if (podcast) {
		document.querySelector('#add-podcast h2').textContent = 'Edit Podcast';
		document.querySelector('input#podcastId').value = podcast.podcastId;
		document.querySelector('input#podcast-name').value = podcast.name;
		document.querySelector('select#podcast-category').value = podcast.podcastCategoryId;
		document.querySelector('input#podcast-link').value = podcast.link;
		document.querySelector('input#podcast-image').value = podcast.coverImageUrl;
		document.querySelector('dialog#add-podcast').showModal();
	}
}

function buildPodcastFromForm() {
	return {
		podcastId: parseInt(document.querySelector('#podcastId').value),
		name: document.querySelector('#podcast-name').value,
		link: document.querySelector('#podcast-link').value,
		coverImageUrl: document.querySelector('#podcast-image').value,
		podcastCategoryId: parseInt(document.querySelector('#podcast-category').value),
	};
}

async function addPodcast(values) {
	const [, error] = await Api.Post('podcast', {
		data: {
			name: values.name,
			link: values.link,
			coverImageUrl: values.coverImageUrl,
			podcastCategoryId: values.podcastCategoryId,
		},
	});

	return error;
}

async function updatePodcast(values) {
	const [, error] = await Api.Put(`podcast/${values?.podcastId}`, {
		data: {
			name: values.name,
			link: values.link,
			coverImageUrl: values.coverImageUrl,
			podcastCategoryId: values.podcastCategoryId,
		},
	});

	return error;
}

async function savePodcast() {
	hideModalError('add-podcast-modal-error');

	const podcast = buildPodcastFromForm();

	const error = podcast.podcastId > 0 ? await updatePodcast(podcast) : await addPodcast(podcast);

	if (error) {
		showModalError(error, 'add-podcast-modal-error');
		return;
	}

	clearFilters();

	await loadPodcasts();

	closeAddForm();
}
