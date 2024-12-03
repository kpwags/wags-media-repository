const linksPerPage = 25;
let allLinks = [];
let linkCategories = [];
let pageCount = 1;
let currentPage = 1;
let filtersActive = false;
let filteredLinks = [];

window.addEventListener('load', function () {
	loadLinks();
	loadLinkCategories();

	document.querySelector('button.next-page')?.addEventListener('click', function () {
		if (currentPage < pageCount) {
			currentPage += 1;
			loadRowsIntoTable();
		}
	});

	document.querySelector('button.previous-page')?.addEventListener('click', function () {
		if (currentPage > 1) {
			currentPage -= 1;
			loadRowsIntoTable();
		}
	});

	document.querySelector('#add-new-link').addEventListener('click', function () {
		document.querySelector('dialog#add-link input#linkId').value = '0';
		document.querySelector('dialog#add-link input#link-issue-number').value = allLinks[0].readingLogIssueNumber;
		document.querySelector('dialog#add-link input#link-date').value = dayjs().format('YYYY-MM-DD');
		document.querySelector('dialog#add-link').showModal();
	});

	document.querySelector('#link-form-dialog-cancel').addEventListener('click', function () {
		closeAddLinkForm();
	});

	document.querySelector('#open-links-filter').addEventListener('click', function () {
		document.querySelector('dialog#filter-links').showModal();
	});

	document.querySelector('#link-filter-cancel').addEventListener('click', function () {
		document.querySelector('dialog#filter-links').close();
	});

	document.querySelector('#clear-filters').addEventListener('click', function () {
		clearFilters();
	});

	document.querySelector('form[name="add-link"]').addEventListener('submit', function(e) {
		e.preventDefault();

		saveLink();
	});

	document.querySelector('form[name="filter-links"]').addEventListener('submit', function(e) {
		e.preventDefault();

		applyFilters();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-no').addEventListener('click', function() {
		cancelOutOfConfirmDialog('#delete-link-id');
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-yes').addEventListener('click', function() {
		deleteLink();
	});
});

async function loadLinks() {
	clearTableRows('ul#recent-links li[data-link]');

	const [data, error] = await Api.Get('link');

	if (error) {
		showPageError(error);
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		document.querySelector('button.previous-page')?.classList.add('hidden');
		document.querySelector('button.next-page')?.classList.add('hidden');
		return;
	}

	if (data.length === 0) {
		document.querySelector('tr.loading')?.classList.add('hidden');
		document.querySelector('tr.no-content')?.classList.remove('hidden');
		document.querySelector('button.previous-page')?.classList.add('hidden');
		document.querySelector('button.next-page')?.classList.add('hidden');
		return;
	}

	allLinks = data;

	pageCount = Math.floor(data.length / linksPerPage) + 1;

	loadRowsIntoTable();
}

async function loadLinkCategories() {
	const [data, error] = await Api.Get('link/category');

	if (error) {
		showPageError(error);
		return;
	}

	linkCategories = data;

	document.getElementById('link-category').appendChild(buildLinkCategorySelectList(linkCategories));
	document.getElementById('filter-link-category').appendChild(buildLinkCategorySelectList(linkCategories));
}

function buildLinkCategorySelectList(linkCategories) {
	const fragment = document.createDocumentFragment();

	linkCategories.forEach((category) => {
		const opt = document.createElement('option');
		opt.setAttribute('value', category.linkCategoryId);
		opt.textContent = category.name;

		fragment.appendChild(opt);
	});

	return fragment;
}

function loadRowsIntoTable() {
	clearTableRows();

	const startingIndex = (currentPage - 1) * linksPerPage;
	
	const links = filtersActive
		? filteredLinks
		: [...allLinks].slice(startingIndex, startingIndex + linksPerPage);

	const fragment = document.createDocumentFragment();

	links.forEach((link) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');
		
		const titleCell = document.createElement('td');

		const linkAnchor = document.createElement('a');
		linkAnchor.textContent = link.title;
		linkAnchor.setAttribute('href', link.url);
		linkAnchor.setAttribute('target', '_blank');
		linkAnchor.setAttribute('rel', 'noreferrer nofollow');

		titleCell.appendChild(linkAnchor);

		tr.appendChild(titleCell);

		const authorCell = document.createElement('td');
		authorCell.textContent = link.author;

		tr.appendChild(authorCell);

		const dateCell = document.createElement('td');
		dateCell.classList.add('center-align');
		dateCell.textContent = dayjs(link.linkDate).format('MM/DD/YYYY');

		tr.appendChild(dateCell);

		const issueCell = document.createElement('td');
		issueCell.classList.add('center-align');
		issueCell.textContent = link.readingLogIssueNumber;

		tr.appendChild(issueCell);

		const typeCell = document.createElement('td');
		typeCell.classList.add('center-align');

		const typeTag = document.createElement('div');
		typeTag.classList.add('tag');
		typeTag.setAttribute('style', `background: ${link.type.colorCode};`);
		typeTag.textContent = link.type.name;

		typeCell.appendChild(typeTag);

		tr.appendChild(typeCell);

		const categoryCell = document.createElement('td');
		categoryCell.classList.add('center-align');
		
		const categoryTag = document.createElement('div');
		categoryTag.classList.add('tag');
		categoryTag.setAttribute('style', `background: ${link.category.colorCode};`);
		categoryTag.textContent = link.category.name;

		categoryCell.appendChild(categoryTag);

		tr.appendChild(categoryCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');
		editButton.addEventListener('click', function () {
			editLink(link.linkId);
		})

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.setAttribute('data-action', 'delete');
		deleteButton.setAttribute('data-linkid', link.linkId);
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(link);
		});

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		fragment.appendChild(tr);
	});

	document.querySelector('tr.loading')?.classList.add('hidden');

	document.getElementById('link-table-body').appendChild(fragment);

	if (currentPage === 1 || filtersActive) {
		document.querySelector('button.previous-page')?.classList.add('hidden');
	} else {
		document.querySelector('button.previous-page')?.classList.remove('hidden');
	}

	if (currentPage === pageCount || filtersActive) {
		document.querySelector('button.next-page')?.classList.add('hidden');
	} else {
		document.querySelector('button.next-page')?.classList.remove('hidden');
	}
}

function closeAddLinkForm() {
	document.querySelector('form[name="add-link"]').reset();
	document.querySelector('dialog#add-link').close();
}

function editLink(linkId) {
	const link = allLinks.find((l) => l.linkId === linkId);

	if (link) {
		document.querySelector('#add-link h2').textContent = 'Edit Link';
		document.querySelector('input#linkId').value = link.linkId;
		document.querySelector('input#link-title').value = link.title;
		document.querySelector('input#link-url').value = link.url;
		document.querySelector('input#link-author').value = link.author;
		document.querySelector('input#link-date').value = dayjs(link.linkDate).format('YYYY-MM-DD');
		document.querySelector('input#link-issue-number').value = link.readingLogIssueNumber;
		document.querySelector('select#link-type').value = link.type.linkTypeId;
		document.querySelector('select#link-category').value = link.category.linkCategoryId;

		document.querySelector('dialog#add-link').showModal();
	}
}

function buildLinkFromForm() {
	return {
		linkId: parseInt(document.querySelector('#linkId').value),
		title: document.querySelector('#link-title').value,
		url: document.querySelector('#link-url').value,
		author: document.querySelector('#link-author').value,
		date: document.querySelector('#link-date').value,
		issue: document.querySelector('#link-issue-number').value,
		linkTypeId: parseInt(document.querySelector('#link-type').value),
		linkCategoryId: parseInt(document.querySelector('#link-category').value),
	};
}

async function addNewLink(link) {
	const [, error] = await Api.Post('link', {
		data: {
			linkTypeId: link.linkTypeId,
			linkCategoryId: link.linkCategoryId,
			title: link.title,
			author: link.author,
			url: link.url,
			linkDate: link.date,
			readingLogIssueNumber: link.issue,
		}
	});

	return error;
}

async function updateExistingLink(link) {
	const [, error] = await Api.Put(`link/${link.linkId}`, {
		data: {
			linkTypeId: link.linkTypeId,
			linkCategoryId: link.linkCategoryId,
			title: link.title,
			author: link.author,
			url: link.url,
			linkDate: link.date,
			readingLogIssueNumber: link.issue,
		}
	});

	return error;
}

async function saveLink() {
	hideModalError('add-link-modal-error');

	const link = buildLinkFromForm();

	const error = link.linkId > 0
		? await updateExistingLink(link)
		: await addNewLink(link);

	if (error) {
		showModalError(error, 'add-link-modal-error');
		return;
	}

	currentPage = 1;

	await loadLinks();

	closeAddLinkForm();
}

function buildLinkFiltersFromForm() {
	return {
		title: document.querySelector('#filter-link-title').value,
		issue: document.querySelector('#filter-link-issue-number').value,
		linkTypeId: parseInt(document.querySelector('#filter-link-type').value),
		linkCategoryId: parseInt(document.querySelector('#filter-link-category').value),
	};
}

function clearFilters() {
	filtersActive = false;
	currentPage = 1;
	loadRowsIntoTable();
	document.querySelector('#clear-filters').classList.add('hidden');
	document.querySelector('dialog#filter-links').close();
}

function applyFilters() {
	const { title, issue, linkTypeId, linkCategoryId } = buildLinkFiltersFromForm();

	if (title === '' && issue === '' && linkTypeId === 0 && linkCategoryId === 0) {
		clearFilters();
		return;
	}

	filtersActive = true;

	let links = [...allLinks];

	if (title !== '') {
		links = links.filter((l) => l.title.toLocaleLowerCase().includes(title.toLocaleLowerCase()) || l.author.toLocaleLowerCase().includes(title.toLocaleLowerCase()));
	}

	if (issue !== '') {
		const issueNumber = parseInt(issue);

		if (!Number.isNaN(issueNumber)) {
			links = links.filter((l) => l.readingLogIssueNumber === issueNumber);
		}
	}

	if (linkTypeId > 0) {
		links = links.filter((l) => l.linkTypeId === linkTypeId);
	}

	if (linkCategoryId > 0) {
		links = links.filter((l) => l.linkCategoryId === linkCategoryId);
	}

	filteredLinks = [...links];

	loadRowsIntoTable();

	document.querySelector('#clear-filters').classList.remove('hidden');

	document.querySelector('dialog#filter-links').close();
}

function openDeleteConfirmation(link) {
	document.getElementById('delete-link-id').value = link.linkId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the link "${link.title}"?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

async function deleteLink() {
	const linkId = parseInt(document.getElementById('delete-link-id').value);

	const [, error] = await Api.Delete(`link/${linkId}`);

	if (error) {
		showPageError(error);
		document.querySelector('dialog.confirm-dialog').close();
		return;
	}

	await loadLinks();
	
	document.querySelector('dialog.confirm-dialog').close();
}
