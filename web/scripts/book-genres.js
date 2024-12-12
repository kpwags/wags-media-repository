let genres = [];

window.addEventListener('load', function () {
	loadGenres();

	document.querySelector('#book-genre-form-dialog-cancel').addEventListener('click', function () {
		closeAddForm();
	});

	document.querySelector('button#add-new-genre').addEventListener('click', function() {
		openAddDialog();
	});

	document.querySelector('form[name="add-genre"]').addEventListener('submit', function(e) {
		e.preventDefault();

		saveGenre();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-no').addEventListener('click', function() {
		cancelOutOfConfirm();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-yes').addEventListener('click', function() {
		confirmDeletionOfGenre();
	});
});

async function loadGenres() {
	const [data, error] = await Api.Get('book/genre');

	if (error) {
		showPageError(error);
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	genres = data;

	if (data.length === 0) {
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	const fragment = document.createDocumentFragment();

	genres.forEach((genre) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const nameCell = document.createElement('td');
		nameCell.textContent = genre.name;

		tr.appendChild(nameCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');

		editButton.addEventListener('click', function () {
			editGenre(genre);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');

		if (genre.bookCount > 0) {
			deleteButton.setAttribute('disabled', true);
		} else {
			deleteButton.addEventListener('click', function () {
				openDeleteConfirmation(genre);
			});
		}

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	document.querySelector('tr.loading')?.classList.add('hidden');

	document.getElementById('genre-table-body').appendChild(fragment);
}

function openAddDialog() {
	document.querySelector('dialog#add-book-genre h2').textContent = 'Add Genre';
	document.querySelector('dialog#add-book-genre').showModal();
}

function editGenre(genre) {
	document.querySelector('dialog#add-book-genre h2').textContent = 'Edit Genre';
	document.querySelector('dialog#add-book-genre input#bookGenreId').value = genre.bookGenreId;
	document.querySelector('dialog#add-book-genre input#name').value = genre.name;
	document.querySelector('dialog#add-book-genre input#colorCode').value = genre.colorCode;

	document.querySelector('dialog#add-book-genre').showModal();
}

function openDeleteConfirmation(genre) {
	document.getElementById('delete-genre-id').value = genre.bookGenreId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the genre "${genre.name}"?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

async function addGenre(name, colorCode) {
	const [, error] = await Api.Post('book/genre', {
        data: {
            name,
            colorCode,
        },
    });

    return error;
}

async function updateGenre(bookGenreId, name, colorCode) {
	const [, error] = await Api.Put(`book/genre/${bookGenreId}`, {
        data: {
            name,
            colorCode,
        },
    });

    return error;
}

async function saveGenre() {
	hideModalError('add-book-genre-modal-error');

	const bookGenreId = parseInt(document.querySelector('dialog#add-book-genre input#bookGenreId').value);
	const name = document.querySelector('dialog#add-book-genre input#name').value;
	const colorCode = document.querySelector('dialog#add-book-genre input#colorCode').value;

	const error = bookGenreId > 0
		? await updateGenre(bookGenreId, name, colorCode)
		: await addGenre(name, colorCode);

	if (error) {
    	showModalError(error, 'add-book-genre-modal-error');
        return;
    }

	refreshTable();
	closeAddForm();
}

function refreshTable() {
	clearTableRows();
	document.querySelector('tr.loading')?.classList.add('hidden');
	loadGenres();
}

async function deleteGenre(bookGenreId) {
	const [, error] = await Api.Delete(`book/genre/${bookGenreId}`);

    if (error) {
        showPageError(error);
        return;
    }

    refreshTable();
}

function confirmDeletionOfGenre() {
	const id = parseInt(document.getElementById('delete-genre-id').value);

	deleteGenre(id);

	document.querySelector('dialog.confirm-dialog').close();
}

function cancelOutOfConfirm() {
	document.getElementById('delete-genre-id').value = 0;
	document.querySelector('dialog.confirm-dialog').close();
}

function closeAddForm() {
	document.querySelector('form[name="add-genre"]').reset();
	document.querySelector('dialog#add-book-genre').close();
}
