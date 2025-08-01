let linkCategoryData = [];

window.addEventListener('load', function () {
	loadLinkCategories();

	document.querySelector('#form-dialog-cancel').addEventListener('click', function () {
		document.querySelector('dialog.form-dialog').close();
		resetForm();
	});

	document.querySelector('button#add-new-category').addEventListener('click', function() {
		openAddDialog();
	});

	document.querySelector('form').addEventListener('submit', function(e) {
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

async function loadLinkCategories() {
	const [data, error] = await Api.Get('link/category');

	if (error) {
		showPageError(error);
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		return;
	}

	linkCategoryData = data;

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
			editCategory(category.linkCategoryId);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');

		if (category.linkCount > 0) {
			deleteButton.setAttribute('disabled', true);
		} else {
			deleteButton.addEventListener('click', function () {
				deleteCategory(category.linkCategoryId);
			});
		}

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	document.querySelector('tr.loading')?.classList.add('hidden');

	document.getElementById('link-category-table-body').appendChild(fragment);
}

function openAddDialog() {
	document.querySelector('dialog.form-dialog h2').textContent = 'Add Category';

	document.querySelector('dialog.form-dialog').showModal();
}

function editCategory(linkCategoryId) {
	const category = linkCategoryData.find((c) => c.linkCategoryId === linkCategoryId);

	const colorCode = category.colorCode.includes('rgb') ? rgbToHex(category.colorCode) : category.colorCode;

	document.querySelector('dialog.form-dialog h2').textContent = 'Edit Category';
	document.querySelector('dialog.form-dialog input#linkCategoryId').value = category.linkCategoryId;
	document.querySelector('dialog.form-dialog input#name').value = category.name;
	document.querySelector('dialog.form-dialog input#colorCode').value = colorCode;

	document.querySelector('dialog.form-dialog').showModal();
}

function deleteCategory(linkCategoryId) {
	const category = linkCategoryData.find((c) => c.linkCategoryId === linkCategoryId);

	document.getElementById('delete-link-category-id').value = linkCategoryId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the link "${category.name}"?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

function resetForm() {
	document.querySelector('dialog.form-dialog h2').textContent = 'Edit Category';
	document.querySelector('dialog.form-dialog input#name').value = '';
	document.querySelector('dialog.form-dialog input#colorCode').value = '';
	document.querySelector('dialog.form-dialog input#linkCategoryId').value = 0;
    enableFieldset();
}

async function addCategory(name, colorCode) {
	const [, error] = await Api.Post('link/category', {
        data: {
            name,
            colorCode,
        },
    });

    return error;
}

async function updateCategory(linkCategoryId, name, colorCode) {
	const [, error] = await Api.Put(`link/category/${linkCategoryId}`, {
        data: {
            name,
            colorCode,
        },
    });

    return error;
}

async function saveCategory() {
	disableFieldset();
	hideModalError();

	const linkCategoryId = parseInt(document.querySelector('dialog.form-dialog input#linkCategoryId').value);
	const name = document.querySelector('dialog.form-dialog input#name').value;
	const colorCode = document.querySelector('dialog.form-dialog input#colorCode').value;

	const error = linkCategoryId > 0
		? await updateCategory(linkCategoryId, name, colorCode)
		: await addCategory(name, colorCode);

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
	loadLinkCategories();
}

async function deleteLinkCategory(linkCategoryId) {
	const [, error] = await Api.Delete(`link/category/${linkCategoryId}`);

    if (error) {
        showPageError(error);
        return;
    }

    refreshTable();
}

function confirmDeletionOfCategory() {
	const id = parseInt(document.getElementById('delete-link-category-id').value);

	deleteLinkCategory(id);
	document.querySelector('dialog.confirm-dialog').close();
}

function cancelOutOfConfirm() {
	document.getElementById('delete-link-category-id').value = 0;

	document.querySelector('dialog.confirm-dialog').close();
}
