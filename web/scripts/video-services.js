let videoServiceData = [];

window.addEventListener('load', function () {
	loadVideoServices();

	document.querySelector('#form-dialog-cancel').addEventListener('click', function () {
		document.querySelector('dialog.form-dialog').close();
		resetForm();
	});

	document.querySelector('button#add-new-video-service').addEventListener('click', function() {
		openAddDialog();
	});

	document.querySelector('form').addEventListener('submit', function(e) {
		e.preventDefault();

		saveVideoService();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-no').addEventListener('click', function() {
		cancelOutOfConfirm();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-yes').addEventListener('click', function() {
		confirmDeletionOfService();
	});
});

async function loadVideoServices() {
	const [data, error] = await Api.Get('system/video-service');

	if (error) {
		showPageError(error);
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	videoServiceData = data;

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
		editButton.setAttribute('data-videoserviceid', d.videoServiceId);

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.setAttribute('data-action', 'delete');
		deleteButton.setAttribute('data-videoserviceid', d.videoServiceId);

		if ((d.tvShowCount + d.movieCount) > 0) {
			deleteButton.setAttribute('disabled', true);
		}

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	document.querySelector('tr.loading')?.classList.add('hidden');

	document.getElementById('video-service-table-body').appendChild(fragment);

	addEventListeners();
}

function openAddDialog() {
	document.querySelector('dialog.form-dialog h2').textContent = 'Add Video Service';

	document.querySelector('dialog.form-dialog').showModal();
}

function editVideoService(e) {
	const btn = e.target;
	const videoServiceId = parseInt(btn.getAttribute('data-videoserviceid'));

	const videoService = videoServiceData.find((vs) => vs.videoServiceId === videoServiceId);

	const colorCode = videoService.colorCode.includes('rgb') ? rgbToHex(videoService.colorCode) : videoService.colorCode;

	document.querySelector('dialog.form-dialog h2').textContent = 'Edit Video Service';
	document.querySelector('dialog.form-dialog input#videoServiceId').value = videoService.videoServiceId;
	document.querySelector('dialog.form-dialog input#name').value = videoService.name;
	document.querySelector('dialog.form-dialog input#colorCode').value = colorCode;

	document.querySelector('dialog.form-dialog').showModal();
}

function deleteVideoService(e) {
	const btn = e.target;
	const videoServiceId = parseInt(btn.getAttribute('data-videoserviceid'));

	const videoService = videoServiceData.find((vs) => vs.videoServiceId === videoServiceId);

	document.getElementById('delete-video-service-id').value = videoServiceId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the video service "${videoService.name}"?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

function addEventListeners() {
	const editButtons = document.querySelectorAll('button[data-action="edit"]');
	const deleteButtons = document.querySelectorAll('button[data-action="delete"]');

	editButtons.forEach((editButton) => {
		editButton.addEventListener('click', editVideoService);
	});

	deleteButtons.forEach((deleteButton) => {
		deleteButton.addEventListener('click', deleteVideoService);
	});
};

function resetForm() {
	document.querySelector('dialog.form-dialog h2').textContent = 'Edit Video Service';
	document.querySelector('dialog.form-dialog input#name').value = '';
	document.querySelector('dialog.form-dialog input#colorCode').value = '';
	document.querySelector('dialog.form-dialog input#videoServiceId').value = 0;
    enableFieldset();
}

async function addVideoService(name, colorCode) {
	const [, error] = await Api.Post('system/video-service', {
        data: {
            name,
            colorCode,
        },
    });

    return error;
}

async function updateVideoService(videoServiceId, name, colorCode) {
	const [, error] = await Api.Put(`system/video-service/${videoServiceId}`, {
        data: {
            name,
            colorCode,
        },
    });

    return error;
}

async function saveVideoService() {
	disableFieldset();
	hideModalError();

	const videoServiceId = parseInt(document.querySelector('dialog.form-dialog input#videoServiceId').value);
	const name = document.querySelector('dialog.form-dialog input#name').value;
	const colorCode = document.querySelector('dialog.form-dialog input#colorCode').value;

	const error = videoServiceId > 0
		? await updateVideoService(videoServiceId, name, colorCode)
		: await addVideoService(name, colorCode);

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
	loadVideoServices();
}

async function deleteService(videoServiceId) {
	const [, error] = await Api.Delete(`system/video-service/${videoServiceId}`);

    if (error) {
        showPageError(error);
        return;
    }

    refreshTable();
}

function confirmDeletionOfService() {
	const id = parseInt(document.getElementById('delete-video-service-id').value);
	deleteService(id);
	document.querySelector('dialog.confirm-dialog').close();
}

function cancelOutOfConfirm() {
	document.getElementById('delete-video-service-id').value = 0;
	document.querySelector('dialog.confirm-dialog').close();
}
