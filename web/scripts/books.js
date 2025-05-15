let books = [];
let genres = [];
let series = [];
let filtersActive = false;
let filteredBooks = [];
let bookStatusId = 1;

window.addEventListener('load', function () {
	bookStatusId = parseInt(document.querySelector('body').getAttribute("data-statusid"));

	document.getElementById('add-new-book')?.addEventListener('click', function () {
		openAddForm();
	});

	document.getElementById('book-form-dialog-cancel')?.addEventListener('click', function () {
		closeAddBookForm();
	});

	document.querySelector('form[name="add-book"]')?.addEventListener('submit', function (e) {
		e.preventDefault();

		saveBook();
	});

	document.querySelector('dialog.confirm-dialog[dialog-type="confirm-delete"] button.confirm-dialog-no')?.addEventListener('click', function () {
		cancelOutOfConfirmDialog('#delete-book-id');
	});

	document.querySelector('dialog.confirm-dialog[dialog-type="confirm-delete"] button.confirm-dialog-yes')?.addEventListener('click', function () {
		deleteBook();
	});

	document.getElementById('reorder-backlog')?.addEventListener('click', function () {
		openReorderConfirmation();
	});

	document.querySelector('dialog.confirm-dialog[dialog-type="confirm-reorder"] button.confirm-dialog-no')?.addEventListener('click', function () {
		document.querySelector('dialog.confirm-dialog[dialog-type="confirm-reorder"]').close();
	});

	document.querySelector('dialog.confirm-dialog[dialog-type="confirm-reorder"] button.confirm-dialog-yes')?.addEventListener('click', function () {
		reorderBooks();
	});

	document.querySelector('#open-book-filter')?.addEventListener('click', function () {
		document.querySelector('dialog#filter-book').showModal();
	});

	document.querySelector('#book-filter-cancel')?.addEventListener('click', function () {
		document.querySelector('dialog#filter-book').close();
	});

	document.querySelector('#clear-filters')?.addEventListener('click', function () {
		clearFilters();
	});

	document.querySelector('form[name="filter-book"]')?.addEventListener('submit', function (e) {
		e.preventDefault();

		applyFilters();
	});

	loadBooks();
	loadGenres();
	loadSeries();
});

async function loadGenres() {
	const [data, error] = await Api.Get("book/genre");

	if (error) {
		showPageError(error);
		return;
	}

	genres = data;

	document.getElementById("book-genre")?.appendChild(buildSelectList(genres, 'bookGenreId', 'name'));
	document.getElementById("filter-book-genre")?.appendChild(buildSelectList(genres, 'bookGenreId', 'name'));
}

async function loadSeries() {
	const [data, error] = await Api.Get("book/series");

	if (error) {
		showPageError(error);
		return;
	}

	systems = data;

	document.getElementById("book-series")?.appendChild(buildSelectList(systems, 'bookSeriesId', 'name'));
	document.getElementById("filter-book-series")?.appendChild(buildSelectList(systems, 'bookSeriesId', 'name'));
}

function loadBacklogBookRows(data) {
	const fragment = document.createDocumentFragment();

	data.forEach((book) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const sortCell = document.createElement('td');
		sortCell.classList.add('center-align');
		sortCell.textContent = book.sortOrder ?? '';

		tr.appendChild(sortCell);

		const titleCell = document.createElement('td');

		titleCell.appendChild(createLinkElement(book.fullTitle, book.link, true));

		tr.appendChild(titleCell);

		const authorCell = document.createElement('td');
		authorCell.textContent = book.author;

		tr.appendChild(authorCell);

		const typeCell = document.createElement('td');
		typeCell.classList.add('center-align');

		const typeTag = document.createElement('div');
		typeTag.classList.add('tag');
		typeTag.setAttribute('style', `background: ${book.type.colorCode};`);
		typeTag.textContent = book.type.name;

		typeCell.appendChild(typeTag);

		tr.appendChild(typeCell);

		const seriesCell = document.createElement('td');

		if (book.series) {
			seriesCell.classList.add('center-align');

			const seriesTag = document.createElement('div');
			seriesTag.classList.add('tag');
			seriesTag.setAttribute('style', `background: ${book.series.colorCode};`);
			seriesTag.textContent = book.series.name;

			seriesCell.appendChild(seriesTag);
		} else {
			seriesCell.textContent = '';
		}

		tr.appendChild(seriesCell);

		const genreCell = document.createElement('td');

		if (book.genres.length > 0) {
			const genreList = buildTagList();

			for (const genre of book.genres) {
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
			editBook(book);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(book);
		});

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	return fragment;
}

function loadCurrentBookRows(data) {
	const fragment = document.createDocumentFragment();

	data.forEach((book) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const titleCell = document.createElement('td');

		titleCell.appendChild(createLinkElement(book.fullTitle, book.link, true));

		tr.appendChild(titleCell);

		const authorCell = document.createElement('td');
		authorCell.textContent = book.author;

		tr.appendChild(authorCell);

		const typeCell = document.createElement('td');
		typeCell.classList.add('center-align');

		const typeTag = document.createElement('div');
		typeTag.classList.add('tag');
		typeTag.setAttribute('style', `background: ${book.type.colorCode};`);
		typeTag.textContent = book.type.name;

		typeCell.appendChild(typeTag);

		tr.appendChild(typeCell);

		const seriesCell = document.createElement('td');

		if (book.series) {
			seriesCell.classList.add('center-align');

			const seriesTag = document.createElement('div');
			seriesTag.classList.add('tag');
			seriesTag.setAttribute('style', `background: ${book.series.colorCode};`);
			seriesTag.textContent = book.series.name;

			seriesCell.appendChild(seriesTag);
		} else {
			seriesCell.textContent = '';
		}

		tr.appendChild(seriesCell);

		const dateCell = document.createElement('td');
		dateCell.classList.add('center-align');
		dateCell.textContent = book.dateStarted ? displayDate(book.dateStarted) : '';

		tr.appendChild(dateCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');
		editButton.addEventListener('click', function () {
			editBook(book);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(book);
		});

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	return fragment;
}

function loadFinishedBookRows(data) {
	const fragment = document.createDocumentFragment();

	data.forEach((book) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const titleCell = document.createElement('td');

		titleCell.appendChild(createLinkElement(book.fullTitle, book.link, true));

		tr.appendChild(titleCell);

		const authorCell = document.createElement('td');
		authorCell.textContent = book.author;

		tr.appendChild(authorCell);

		const typeCell = document.createElement('td');
		typeCell.classList.add('center-align');

		const typeTag = document.createElement('div');
		typeTag.classList.add('tag');
		typeTag.setAttribute('style', `background: ${book.type.colorCode};`);
		typeTag.textContent = book.type.name;

		typeCell.appendChild(typeTag);

		tr.appendChild(typeCell);

		const seriesCell = document.createElement('td');

		if (book.series) {
			seriesCell.classList.add('center-align');

			const seriesTag = document.createElement('div');
			seriesTag.classList.add('tag');
			seriesTag.setAttribute('style', `background: ${book.series.colorCode};`);
			seriesTag.textContent = book.series.name;

			seriesCell.appendChild(seriesTag);
		} else {
			seriesCell.textContent = '';
		}

		tr.appendChild(seriesCell);

		const dateCell = document.createElement('td');
		dateCell.classList.add('center-align');
		dateCell.textContent = book.dateCompleted ? displayDate(book.dateCompleted) : '';

		tr.appendChild(dateCell);

		const ratingCell = document.createElement('td');
		ratingCell.classList.add('center-align');

		const ratingDisplay = document.createElement('rating-display');
		ratingDisplay.setAttribute('data-rating', book.rating);
		ratingDisplay.setAttribute('data-size', 'md');
		ratingCell.appendChild(ratingDisplay);

		tr.appendChild(ratingCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');
		editButton.addEventListener('click', function () {
			editBook(book);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(book);
		});

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	return fragment;
}

function loadAbandonedBookRows(data) {
	const fragment = document.createDocumentFragment();

	data.forEach((book) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const titleCell = document.createElement('td');

		titleCell.appendChild(createLinkElement(book.fullTitle, book.link, true));

		tr.appendChild(titleCell);

		const authorCell = document.createElement('td');
		authorCell.textContent = book.author;

		tr.appendChild(authorCell);

		const typeCell = document.createElement('td');
		typeCell.classList.add('center-align');

		const typeTag = document.createElement('div');
		typeTag.classList.add('tag');
		typeTag.setAttribute('style', `background: ${book.type.colorCode};`);
		typeTag.textContent = book.type.name;

		typeCell.appendChild(typeTag);

		tr.appendChild(typeCell);

		const seriesCell = document.createElement('td');

		if (book.series) {
			seriesCell.classList.add('center-align');

			const seriesTag = document.createElement('div');
			seriesTag.classList.add('tag');
			seriesTag.setAttribute('style', `background: ${book.series.colorCode};`);
			seriesTag.textContent = book.series.name;

			seriesCell.appendChild(seriesTag);
		} else {
			seriesCell.textContent = '';
		}

		tr.appendChild(seriesCell);

		const genreCell = document.createElement('td');

		if (book.genres.length > 0) {
			const genreList = buildTagList();

			for (const genre of book.genres) {
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
			editBook(book);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(book);
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

	const data = filtersActive ? filteredBooks : books;

	if (data.length === 0) {
		document.querySelector("tr.loading")?.classList.add("hidden");
		document.querySelector("tr.no-content")?.classList.remove("hidden");
		return;
	}

	let fragment = document.createDocumentFragment();

	switch (bookStatusId) {
		case 1:
			fragment = loadBacklogBookRows(data.sort((a, b) => sortBySortOrder(a.sortOrder, b.sortOrder)));
			break;
		case 2:
			fragment = loadCurrentBookRows(data.sort((a, b) => sortByTitle(a.title, b.title)));
			break;
		case 3:
			fragment = loadFinishedBookRows(data.sort((a, b) => sortByDate(a.dateCompleted, b.dateCompleted)));
			break;
		case 4:
			fragment = loadAbandonedBookRows(data.sort((a, b) => sortByDate(a.dateCompleted, b.dateCompleted)));
			break;
		default:
			document.querySelector("tr.loading")?.classList.add("hidden");
			document.querySelector("tr.no-content")?.classList.remove("hidden");
			return;
	}

	document.querySelector("tr.no-content")?.classList.add("hidden");
	document.querySelector("tr.loading")?.classList.add("hidden");

	document.getElementById("book-table-body").appendChild(fragment);
}

async function loadBooks() {
	const [data, error] = await Api.Get("book");

	if (error) {
		showPageError(error);
		document.querySelector("tr.loading")?.classList.add("hidden");
		document.querySelector("tr.no-content")?.classList.remove("hidden");
		return;
	}

	books = data.filter((b) => b.bookStatusId === bookStatusId);

	loadRowsIntoTable();
}

function openAddForm() {
	const sortOrderValues = books.map((b) => b.sortOrder);

	const maxSortOrder = Math.max(...sortOrderValues)

	document.querySelector('#add-book h2').textContent = 'Add Book';
	document.querySelector('input#book-sort').value = maxSortOrder + 10;
	document.querySelector('input#book-current-page').value = 1;
	document.querySelector('input#book-page-count').value = 1;
	document.querySelector('dialog#add-book').showModal();
}

function buildBookFiltersFromForm() {
	return {
		title: document.querySelector('#filter-book-title').value,
		genreId: parseInt(document.querySelector('#filter-book-genre').value),
		typeId: parseInt(document.querySelector('#filter-book-type').value),
		seriesId: parseInt(document.querySelector('#filter-book-series').value),
		isPurchased: document.querySelector('#filter-is-purchased').checked,
		isAtLibrary: document.querySelector('#filter-at-library').checked,
	};
}

function clearFilters() {
	filtersActive = false;
	loadRowsIntoTable();
	document.querySelector('form[name="filter-book"]').reset();
	document.querySelector('#clear-filters').classList.add('hidden');
	document.querySelector('dialog#filter-book').close();
}

function applyFilters() {
	const { title, genreId, typeId, seriesId, isAtLibrary, isPurchased } = buildBookFiltersFromForm();

	if (title === '' && genreId === 0 && typeId === 0 && seriesId === 0 && !isAtLibrary && !isPurchased) {
		clearFilters();
		return;
	}

	filtersActive = true;

	let data = [...books];

	if (title !== '') {
		data = data.filter((b) => b.title.toLocaleLowerCase().includes(title.toLocaleLowerCase())
			|| b.subTitle.toLocaleLowerCase().includes(title.toLocaleLowerCase())
			|| b.author.toLocaleLowerCase().includes(title.toLocaleLowerCase()));
	}

	if (genreId > 0) {
		data = data.filter((bg) => bg.genres.map((g) => g.bookGenreId).includes(genreId));
	}

	if (typeId > 0) {
		data = data.filter((b) => b.bookTypeId === typeId);
	}

	if (seriesId > 0) {
		data = data.filter((b) => b.bookSeriesId === seriesId);
	}

	if (isPurchased) {
		data = data.filter((b) => b.isPurchased);
	}

	if (isAtLibrary) {
		data = data.filter((b) => b.isAtLibrary);
	}

	filteredBooks = [...data];

	loadRowsIntoTable();

	document.querySelector('#clear-filters').classList.remove('hidden');

	document.querySelector('dialog#filter-book').close();
}

function closeAddBookForm() {
	document.querySelector('form[name="add-book"]').reset();

	resetMultiselect('select#book-genre');
	resetMultiselect('select#book-format');

	document.querySelector('dialog#add-book').close();
}

function editBook(b) {
	if (b) {
		document.querySelector('#add-book h2').textContent = 'Edit Book';
		document.querySelector('input#bookId').value = b.bookId;
		document.querySelector('input#book-title').value = b.title;
		document.querySelector('input#book-subtitle').value = b.subTitle;
		document.querySelector('input#book-author').value = b.author;
		document.querySelector('select#book-status').value = b.bookStatusId;
		document.querySelector('select#book-type').value = b.bookTypeId;
		document.querySelector('select#book-series').value = b.bookSeriesId;
		document.querySelector('input#book-link').value = b.link;
		document.querySelector('input#book-cover-url').value = b.coverImageUrl;
		document.querySelector('input#book-sort').value = b.sortOrder;
		document.querySelector('input#book-current-page').value = b.currentPage ?? 1;
		document.querySelector('input#book-page-count').value = b.pageCount;
		document.querySelector('input#is-purchased').checked = b.isPurchased;
		document.querySelector('input#at-library').checked = b.isAtLibrary;

		if (b.dateStarted) {
			document.querySelector('input#book-date-started').value = displayDate(b.dateStarted, 'YYYY-MM-DD');
		}

		if (b.dateCompleted) {
			document.querySelector('input#book-date-completed').value = displayDate(b.dateCompleted, 'YYYY-MM-DD');
		}

		document.querySelector('#book-rating').setAttribute('rating', b.rating);
		document.querySelector('textarea#book-thoughts').value = b.thoughts;
		document.querySelector('input#book-notes-url').value = b.bookNotesUrl;

		setMultiselectValues('select#book-genre', b.genres.map((g) => g.bookGenreId));
		setMultiselectValues('select#book-format', b.formats.map((s) => s.bookFormatId));

		document.querySelector('dialog#add-book').showModal();
	}
}

function buildBookFromForm() {
	const currentPage = getNumericValueFromInput('#book-current-page', 1);
	const pageCount = getNumericValueFromInput('#book-page-count', 1);

	return {
		bookId: parseInt(document.querySelector('#bookId').value),
		title: document.querySelector('#book-title').value,
		subTitle: document.querySelector('#book-subtitle').value,
		author: document.querySelector('#book-author').value,
		bookStatusId: parseInt(document.querySelector('#book-status').value),
		bookTypeId: parseInt(document.querySelector('#book-type').value),
		bookSeriesId: parseInt(document.querySelector('#book-series').value),
		link: document.querySelector('#book-link').value,
		coverImageUrl: document.querySelector('#book-cover-url').value,
		sortOrder: parseInt(document.querySelector('#book-sort').value),
		isPurchased: document.querySelector('#is-purchased').checked,
		isAtLibrary: document.querySelector('#at-library').checked,
		genres: getValuesFromMultiSelect('#book-genre'),
		formats: getValuesFromMultiSelect('#book-format'),
		dateStarted: document.querySelector('#book-date-started').value,
		dateCompleted: document.querySelector('#book-date-completed').value,
		rating: parseInt(document.querySelector('#book-rating-value').value),
		thoughts: document.querySelector('#book-thoughts').value,
		bookNotesUrl: document.querySelector('#book-notes-url').value,
		currentPage,
		pageCount,
	};
}

async function addBook(values) {
	const [, error] = await Api.Post('book', {
		data: values,
	});

	return error;
}

async function updateBook(values) {
	const [, error] = await Api.Put(`book/${values?.bookId}`, {
		data: values,
	});

	return error;
}

async function saveBook() {
	hideModalError('add-book-modal-error');

	const values = buildBookFromForm();

	const error = values.bookId > 0 ? await updateBook(values) : await addBook(values);

	if (error) {
		showModalError(error, 'add-book-modal-error');
		return;
	}

	clearFilters();

	await loadBooks();

	closeAddBookForm();
}

function openDeleteConfirmation(book) {
	document.getElementById('delete-book-id').value = book.bookId;

	document.querySelector('dialog.confirm-dialog[dialog-type="confirm-delete"] .text').textContent = `Are you sure you want to delete the book "${book.title}"?`;
	document.querySelector('dialog.confirm-dialog[dialog-type="confirm-delete"]').showModal();
}

async function deleteBook() {
	const id = parseInt(document.getElementById('delete-book-id').value);

	const [, error] = await Api.Delete(`book/${id}`);

	if (error) {
		showPageError(error);
		document.querySelector('dialog.confirm-dialog[dialog-type="confirm-delete"]').close();
		return;
	}

	clearFilters();

	await loadBooks();

	document.getElementById('delete-book-id').value = '0';
	document.querySelector('dialog.confirm-dialog[dialog-type="confirm-delete"]').close();
}

function openReorderConfirmation() {
	document.querySelector('dialog.confirm-dialog[dialog-type="confirm-reorder"] .text').textContent = 'Are you sure you want to reorder the backlog?';
	document.querySelector('dialog.confirm-dialog[dialog-type="confirm-reorder"]').showModal();
}

async function reorderBooks() {
	document.querySelector('dialog.confirm-dialog[dialog-type="confirm-reorder"] .confirm-dialog-yes').setAttribute('disabled', true);
	document.querySelector('dialog.confirm-dialog[dialog-type="confirm-reorder"] .confirm-dialog-yes').textContent = 'Reordering Backlog...';
	document.querySelector('dialog.confirm-dialog[dialog-type="confirm-reorder"] .confirm-dialog-no').setAttribute('disabled', true);

	const [, error] = await Api.Post(`book/reorder`);

	if (error) {
		showPageError(error);
		document.querySelector('dialog.confirm-dialog[dialog-type="confirm-reorder"]').close();
		document.querySelector('dialog.confirm-dialog[dialog-type="confirm-reorder"] .confirm-dialog-yes').removeAttribute('disabled');
		document.querySelector('dialog.confirm-dialog[dialog-type="confirm-reorder"] .confirm-dialog-yes').textContent = 'Yes';
		document.querySelector('dialog.confirm-dialog[dialog-type="confirm-reorder"] .confirm-dialog-no').removeAttribute('disabled');
		return;
	}

	setTimeout(async () => {
		await loadBooks();
		document.querySelector('dialog.confirm-dialog[dialog-type="confirm-reorder"]').close();
		document.querySelector('dialog.confirm-dialog[dialog-type="confirm-reorder"] .confirm-dialog-yes').removeAttribute('disabled');
		document.querySelector('dialog.confirm-dialog[dialog-type="confirm-reorder"] .confirm-dialog-yes').textContent = 'Yes';
		document.querySelector('dialog.confirm-dialog[dialog-type="confirm-reorder"] .confirm-dialog-no').removeAttribute('disabled');
	}, 5000);
}