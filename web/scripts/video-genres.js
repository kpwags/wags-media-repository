let videoGenreData = [];

window.addEventListener('load', function () {
	loadVideoGenres();

	document.querySelector('#form-dialog-cancel').addEventListener('click', function () {
		document.querySelector('dialog.form-dialog').close();
		resetForm();
	});

	document.querySelector('button#add-new-video-genre').addEventListener('click', function() {
		openAddDialog();
	});

	document.querySelector('form').addEventListener('submit', function(e) {
		e.preventDefault();

		saveVideoGenre();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-no').addEventListener('click', function() {
		cancelOutOfConfirm();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-yes').addEventListener('click', function() {
		confirmDeletionOfGenre();
	});
});

async function loadVideoGenres() {
	const [data, error] = await Api.Get('system/video-genre');

	if (error) {
		showPageError(error);
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	videoGenreData = data;

	if (data.length === 0) {
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	const fragment = document.createDocumentFragment();

	data.forEach((d) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');
		
		const nameCell = document.createElement('td');
		nameCell.textContent = d.name;

		tr.appendChild(nameCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');
		editButton.setAttribute('data-action', 'edit');
		editButton.setAttribute('data-videogenreid', d.videoGenreId);

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.setAttribute('data-action', 'delete');
		deleteButton.setAttribute('data-videogenreid', d.videoGenreId);

		if ((d.tvShowCount + d.movieCount) > 0) {
			deleteButton.setAttribute('disabled', true);
		}

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	document.querySelector('tr.loading')?.classList.add('hidden');

	document.getElementById('video-genre-table-body').appendChild(fragment);

	addEventListeners();
}

function openAddDialog() {
	document.querySelector('dialog.form-dialog h2').textContent = 'Add Video Genre';

	document.querySelector('dialog.form-dialog').showModal();
}

function editVideoGenre(e) {
	const btn = e.target;
	const videoGenreId = parseInt(btn.getAttribute('data-videogenreid'));

	const videoGenre = videoGenreData.find((vg) => vg.videoGenreId === videoGenreId);

	const colorCode = videoGenre.colorCode.includes('rgb') ? rgbToHex(videoGenre.colorCode) : videoGenre.colorCode;

	document.querySelector('dialog.form-dialog h2').textContent = 'Edit Video Genre';
	document.querySelector('dialog.form-dialog input#videoGenreId').value = videoGenre.videoGenreId;
	document.querySelector('dialog.form-dialog input#name').value = videoGenre.name;
	document.querySelector('dialog.form-dialog input#colorCode').value = colorCode;

	document.querySelector('dialog.form-dialog').showModal();
}

function deleteVideoGenre(e) {
	const btn = e.target;
	const videoGenreId = parseInt(btn.getAttribute('data-videogenreid'));

	const videoGenre = videoGenreData.find((vg) => vg.videoGenreId === videoGenreId);

	document.getElementById('delete-video-genre-id').value = videoGenreId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the video genre "${videoGenre.name}"?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

function addEventListeners() {
	const editButtons = document.querySelectorAll('button[data-action="edit"]');
	const deleteButtons = document.querySelectorAll('button[data-action="delete"]');

	editButtons.forEach((editButton) => {
		editButton.addEventListener('click', editVideoGenre);
	});

	deleteButtons.forEach((deleteButton) => {
		deleteButton.addEventListener('click', deleteVideoGenre);
	});
};

function resetForm() {
	document.querySelector('dialog.form-dialog h2').textContent = 'Edit Video Genre';
	document.querySelector('dialog.form-dialog input#name').value = '';
	document.querySelector('dialog.form-dialog input#colorCode').value = '';
	document.querySelector('dialog.form-dialog input#videoGenreId').value = 0;
    enableFieldset();
}

async function addVideoGenre(name, colorCode) {
	const [, error] = await Api.Post('system/video-genre', {
        data: {
            name,
            colorCode,
        },
    });

    return error;
}

async function updateVideoGenre(videoGenreId, name, colorCode) {
	const [, error] = await Api.Put(`system/video-genre/${videoGenreId}`, {
        data: {
            name,
            colorCode,
        },
    });

    return error;
}

async function saveVideoGenre() {
	disableFieldset();
	hideModalError();

	const videoGenreId = parseInt(document.querySelector('dialog.form-dialog input#videoGenreId').value);
	const name = document.querySelector('dialog.form-dialog input#name').value;
	const colorCode = document.querySelector('dialog.form-dialog input#colorCode').value;

	const error = videoGenreId > 0
		? await updateVideoGenre(videoGenreId, name, colorCode)
		: await addVideoGenre(name, colorCode);

	if (error) {
    	showModalError(error);
        enableFieldset();
        return;
    }

    document.querySelector('dialog.form-dialog').close();
	resetForm();
	refreshTable();
}

function refreshTable() {
	clearTableRows();
	document.querySelector('tr.loading')?.classList.add('hidden');
	loadVideoGenres();
}

async function deleteGenre(videoGenreId) {
	const [, error] = await Api.Delete(`system/video-genre/${videoGenreId}`);

    if (error) {
        showPageError(error);
        return;
    }

    refreshTable();
}

function confirmDeletionOfGenre() {
	const id = parseInt(document.getElementById('delete-video-genre-id').value);
	deleteGenre(id);
	document.querySelector('dialog.confirm-dialog').close();
}

function cancelOutOfConfirm() {
	document.getElementById('delete-video-genre-id').value = 0;
	document.querySelector('dialog.confirm-dialog').close();
}
