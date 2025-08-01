let genres = [];

window.addEventListener('load', function () {
	loadGenres();

	document.querySelector('#music-genre-form-dialog-cancel').addEventListener('click', function () {
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
	const [data, error] = await Api.Get('music/genre');

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

		if (genre.albumCount > 0) {
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
	document.querySelector('dialog#add-music-genre h2').textContent = 'Add Genre';
	document.querySelector('dialog#add-music-genre').showModal();
}

function editGenre(genre) {
	const colorCode = genre.colorCode.includes('rgb') ? rgbToHex(genre.colorCode) : genre.colorCode;

	document.querySelector('dialog#add-music-genre h2').textContent = 'Edit Genre';
	document.querySelector('dialog#add-music-genre input#musicGenreId').value = genre.musicGenreId;
	document.querySelector('dialog#add-music-genre input#name').value = genre.name;
	document.querySelector('dialog#add-music-genre input#colorCode').value = colorCode;

	document.querySelector('dialog#add-music-genre').showModal();
}

function openDeleteConfirmation(genre) {
	document.getElementById('delete-genre-id').value = genre.musicGenreId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the genre "${genre.name}"?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

async function addGenre(name, colorCode) {
	const [, error] = await Api.Post('music/genre', {
        data: {
            name,
            colorCode,
        },
    });

    return error;
}

async function updateGenre(musicGenreId, name, colorCode) {
	const [, error] = await Api.Put(`music/genre/${musicGenreId}`, {
        data: {
            name,
            colorCode,
        },
    });

    return error;
}

async function saveGenre() {
	hideModalError('add-music-genre-modal-error');

	const musicGenreId = parseInt(document.querySelector('dialog#add-music-genre input#musicGenreId').value);
	const name = document.querySelector('dialog#add-music-genre input#name').value;
	const colorCode = document.querySelector('dialog#add-music-genre input#colorCode').value;

	const error = musicGenreId > 0
		? await updateGenre(musicGenreId, name, colorCode)
		: await addGenre(name, colorCode);

	if (error) {
    	showModalError(error, 'add-music-genre-modal-error');
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

async function deleteGenre(musicGenreId) {
	const [, error] = await Api.Delete(`music/genre/${musicGenreId}`);

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
	document.querySelector('dialog#add-music-genre').close();
}
