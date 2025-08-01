let systems = [];

window.addEventListener('load', function () {
	loadSystems();

	document.querySelector('#video-game-system-form-dialog-cancel').addEventListener('click', function () {
		closeAddForm();
	});

	document.querySelector('button#add-new-system').addEventListener('click', function() {
		openAddDialog();
	});

	document.querySelector('form[name="add-system"]').addEventListener('submit', function(e) {
		e.preventDefault();

		saveSystem();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-no').addEventListener('click', function() {
		cancelOutOfConfirm();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-yes').addEventListener('click', function() {
		confirmDeletionOfSystem();
	});
});

async function loadSystems() {
	const [data, error] = await Api.Get('video-game/system');

	if (error) {
		showPageError(error);
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	systems = data;

	if (data.length === 0) {
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	const fragment = document.createDocumentFragment();

	systems.forEach((system) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const nameCell = document.createElement('td');
		nameCell.textContent = system.name;

		tr.appendChild(nameCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');
		editButton.addEventListener('click', function () {
			editSystem(system);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');

		if (system.videoGameCount > 0) {
			deleteButton.setAttribute('disabled', true);
		} else {
			deleteButton.addEventListener('click', function () {
				openDeleteConfirmation(system);
			});
		}

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	document.querySelector('tr.loading')?.classList.add('hidden');

	document.getElementById('system-table-body').appendChild(fragment);
}

function openAddDialog() {
	document.querySelector('dialog#add-video-game-system h2').textContent = 'Add System';
	document.querySelector('dialog#add-video-game-system').showModal();
}

function editSystem(system) {
	const colorCode = system.colorCode.includes('rgb') ? rgbToHex(system.colorCode) : system.colorCode;

	document.querySelector('dialog#add-video-game-system h2').textContent = 'Edit System';
	document.querySelector('dialog#add-video-game-system input#videoGameSystemId').value = system.videoGameSystemId;
	document.querySelector('dialog#add-video-game-system input#name').value = system.name;
	document.querySelector('dialog#add-video-game-system input#colorCode').value = colorCode;

	document.querySelector('dialog#add-video-game-system').showModal();
}

function openDeleteConfirmation(system) {
	document.getElementById('delete-system-id').value = system.videoGameSystemId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the system "${system.name}"?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

async function addSystem(name, colorCode) {
	const [, error] = await Api.Post('video-game/system', {
        data: {
            name,
            colorCode,
        },
    });

    return error;
}

async function updateSystem(videoGameSystemId, name, colorCode) {
	const [, error] = await Api.Put(`video-game/system/${videoGameSystemId}`, {
        data: {
            name,
            colorCode,
        },
    });

    return error;
}

async function saveSystem() {
	hideModalError('add-video-game-system-modal-error');

	const videoGameSystemId = parseInt(document.querySelector('dialog#add-video-game-system input#videoGameSystemId').value);
	const name = document.querySelector('dialog#add-video-game-system input#name').value;
	const colorCode = document.querySelector('dialog#add-video-game-system input#colorCode').value;

	const error = videoGameSystemId > 0
		? await updateSystem(videoGameSystemId, name, colorCode)
		: await addSystem(name, colorCode);

	if (error) {
    	showModalError(error, 'add-video-game-system-modal-error');
        return;
    }

	refreshTable();
	closeAddForm();
}

function refreshTable() {
	clearTableRows();
	document.querySelector('tr.loading')?.classList.add('hidden');
	loadSystems();
}

async function deleteSystem(videoGameSystemId) {
	const [, error] = await Api.Delete(`video-game/system/${videoGameSystemId}`);

    if (error) {
        showPageError(error);
        return;
    }

    refreshTable();
}

function confirmDeletionOfSystem() {
	const id = parseInt(document.getElementById('delete-system-id').value);

	deleteSystem(id);

	document.querySelector('dialog.confirm-dialog').close();
}

function cancelOutOfConfirm() {
	document.getElementById('delete-system-id').value = 0;
	document.querySelector('dialog.confirm-dialog').close();
}

function closeAddForm() {
	document.querySelector('form[name="add-system"]').reset();
	document.querySelector('dialog#add-video-game-system').close();
}
