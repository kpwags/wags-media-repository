let series = [];

window.addEventListener('load', function () {
	loadSeries();

	document.querySelector('#book-series-form-dialog-cancel').addEventListener('click', function () {
		closeAddForm();
	});

	document.querySelector('button#add-new-series').addEventListener('click', function() {
		openAddDialog();
	});

	document.querySelector('form[name="add-series"]').addEventListener('submit', function(e) {
		e.preventDefault();

		saveGenre();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-no').addEventListener('click', function() {
		cancelOutOfConfirm();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-yes').addEventListener('click', function() {
		confirmDeletionOfSeries();
	});
});

async function loadSeries() {
	const [data, error] = await Api.Get('book/series');

	if (error) {
		showPageError(error);
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	series = data;

	if (data.length === 0) {
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	const fragment = document.createDocumentFragment();

	series.forEach((s) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const nameCell = document.createElement('td');
		nameCell.textContent = s.name;

		tr.appendChild(nameCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');

		editButton.addEventListener('click', function () {
			editSeries(s);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');

		if (s.bookCount > 0) {
			deleteButton.setAttribute('disabled', true);
		} else {
			deleteButton.addEventListener('click', function () {
				openDeleteConfirmation(s);
			});
		}

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	document.querySelector('tr.loading')?.classList.add('hidden');

	document.getElementById('series-table-body').appendChild(fragment);
}

function openAddDialog() {
	document.querySelector('dialog#add-book-series h2').textContent = 'Add Series';
	document.querySelector('dialog#add-book-series').showModal();
}

function editSeries(bookSeries) {
	const colorCode = bookSeries.colorCode.includes('rgb') ? rgbToHex(bookSeries.colorCode) : bookSeries.colorCode;

	document.querySelector('dialog#add-book-series h2').textContent = 'Edit Series';
	document.querySelector('dialog#add-book-series input#bookSeriesId').value = bookSeries.bookSeriesId;
	document.querySelector('dialog#add-book-series input#name').value = bookSeries.name;
	document.querySelector('dialog#add-book-series input#colorCode').value = colorCode;

	document.querySelector('dialog#add-book-series').showModal();
}

function openDeleteConfirmation(bookSeries) {
	document.getElementById('delete-series-id').value = bookSeries.bookSeriesId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the series "${bookSeries.name}"?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

async function addSeries(name, colorCode) {
	const [, error] = await Api.Post('book/series', {
        data: {
            name,
            colorCode,
        },
    });

    return error;
}

async function updateSeries(bookSeriesId, name, colorCode) {
	const [, error] = await Api.Put(`book/series/${bookSeriesId}`, {
        data: {
            name,
            colorCode,
        },
    });

    return error;
}

async function saveGenre() {
	hideModalError('add-book-series-modal-error');

	const bookSeriesId = parseInt(document.querySelector('dialog#add-book-series input#bookSeriesId').value);
	const name = document.querySelector('dialog#add-book-series input#name').value;
	const colorCode = document.querySelector('dialog#add-book-series input#colorCode').value;

	const error = bookSeriesId > 0
		? await updateSeries(bookSeriesId, name, colorCode)
		: await addSeries(name, colorCode);

	if (error) {
    	showModalError(error, 'add-book-series-modal-error');
        return;
    }

	refreshTable();
	closeAddForm();
}

function refreshTable() {
	clearTableRows();
	document.querySelector('tr.loading')?.classList.add('hidden');
	loadSeries();
}

async function deleteSeries(id) {
	const [, error] = await Api.Delete(`book/series/${id}`);

    if (error) {
        showPageError(error);
        return;
    }

    refreshTable();
}

function confirmDeletionOfSeries() {
	const id = parseInt(document.getElementById('delete-series-id').value);

	deleteSeries(id);

	document.querySelector('dialog.confirm-dialog').close();
}

function cancelOutOfConfirm() {
	document.getElementById('delete-series-id').value = 0;
	document.querySelector('dialog.confirm-dialog').close();
}

function closeAddForm() {
	document.querySelector('form[name="add-series"]').reset();
	document.querySelector('dialog#add-book-series').close();
}
