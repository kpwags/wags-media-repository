let allCategories = [];

window.addEventListener('load', function () {
	loadCategories();

	document.querySelector('#podcast-category-form-dialog-cancel').addEventListener('click', function () {
		closeAddForm();
	});

	document.querySelector('button#add-new-category').addEventListener('click', function() {
		openAddDialog();
	});

	document.querySelector('form[name="add-category"]').addEventListener('submit', function(e) {
		e.preventDefault();

		saveCategory();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-no').addEventListener('click', function() {
		cancelOutOfConfirm();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-yes').addEventListener('click', function() {
		confirmDeletionOfCategory();
	});
});

async function loadCategories() {
	const [data, error] = await Api.Get('podcast/category');

	if (error) {
		showPageError(error);
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	allCategories = data;

	if (data.length === 0) {
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	const fragment = document.createDocumentFragment();

	data.forEach((category) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');
		
		const nameCell = document.createElement('td');
		nameCell.textContent = category.name;

		tr.appendChild(nameCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');

		editButton.addEventListener('click', function () {
			editCategory(category);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');

		if (category.podcastCount > 0) {
			deleteButton.setAttribute('disabled', true);
		} else {
			deleteButton.addEventListener('click', function () {
				openDeleteConfirmation(category);
			});
		}

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	document.querySelector('tr.loading')?.classList.add('hidden');

	document.getElementById('category-table-body').appendChild(fragment);
}

function openAddDialog() {
	document.querySelector('dialog#add-podcast-category h2').textContent = 'Add Category';
	document.querySelector('dialog#add-podcast-category').showModal();
}

function editCategory(category) {
	document.querySelector('dialog#add-podcast-category h2').textContent = 'Edit Category';
	document.querySelector('dialog#add-podcast-category input#podcastCategoryId').value = category.podcastCategoryId;
	document.querySelector('dialog#add-podcast-category input#name').value = category.name;
	document.querySelector('dialog#add-podcast-category input#colorCode').value = category.colorCode;

	document.querySelector('dialog#add-podcast-category').showModal();
}

function openDeleteConfirmation(category) {
	document.getElementById('delete-podcast-category-id').value = category.podcastCategoryId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the category "${category.name}"?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

async function addCategory(name, colorCode) {
	const [, error] = await Api.Post('podcast/category', {
        data: {
            name,
            colorCode,
        },
    });

    return error;
}

async function updateCategory(podcastCategoryId, name, colorCode) {
	const [, error] = await Api.Put(`podcast/category/${podcastCategoryId}`, {
        data: {
            name,
            colorCode,
        },
    });

    return error;
}

async function saveCategory() {
	hideModalError('add-podcast-category-modal-error');

	const podcastCategoryId = parseInt(document.querySelector('dialog#add-podcast-category input#podcastCategoryId').value);
	const name = document.querySelector('dialog#add-podcast-category input#name').value;
	const colorCode = document.querySelector('dialog#add-podcast-category input#colorCode').value;

	const error = podcastCategoryId > 0
		? await updateCategory(podcastCategoryId, name, colorCode)
		: await addCategory(name, colorCode);

	if (error) {
    	showModalError(error, 'add-podcast-category-modal-error');
        return;
    }

	refreshTable();
	closeAddForm();
}

function refreshTable() {
	clearTableRows();
	document.querySelector('tr.loading')?.classList.add('hidden');
	loadCategories();
}

async function deleteCategory(podcastCategoryId) {
	const [, error] = await Api.Delete(`podcast/category/${podcastCategoryId}`);

    if (error) {
        showPageError(error);
        return;
    }

    refreshTable();
}

function confirmDeletionOfCategory() {
	const id = parseInt(document.getElementById('delete-podcast-category-id').value);

	deleteCategory(id);

	document.querySelector('dialog.confirm-dialog').close();
}

function cancelOutOfConfirm() {
	document.getElementById('delete-podcast-category-id').value = 0;
	document.querySelector('dialog.confirm-dialog').close();
}

function closeAddForm() {
	document.querySelector('form[name="add-category"]').reset();
	document.querySelector('dialog#add-podcast-category').close();
}
