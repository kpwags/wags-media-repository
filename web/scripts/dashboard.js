let recentLinkData = [];
let currentBookData = [];
let currentTvData = [];
let recentBookData = [];
let currentVideoGameData = [];
let currentMusic = [];
let recentMovies = [];
let linkCategories = [];

window.addEventListener('load', function () {
	initializePage();

	document.getElementById('progress-form-dialog-cancel').addEventListener('click', function () {
		document.querySelector('dialog#update-progress').close();
	});

	document.querySelector('dialog#update-progress input#progress').addEventListener('keyup', function (e) {
		const newValue = parseInt(e.target.value);
		updateProgressBar(newValue);
	});

	document.querySelector('form[name="update-progress"]').addEventListener('submit', function(e) {
		e.preventDefault();

		updateProgress();
	});

	document.querySelector('form[name="add-link"]').addEventListener('submit', function(e) {
		e.preventDefault();

		saveLink();
	});

	document.querySelector('#dashboard-add-link').addEventListener('click', function () {
		document.querySelector('dialog#add-link input#link-issue-number').value = recentLinkData[0].readingLogIssueNumber;
		document.querySelector('dialog#add-link input#link-date').value = dayjs().format('YYYY-MM-DD');
		document.querySelector('dialog#add-link').showModal();
	});

	document.querySelector('#link-form-dialog-cancel').addEventListener('click', function () {
		closeAddLinkForm();
	});
});

async function loadCurrentBooks() {
	clearTableRows('ul#currently-reading li.current-item');

	const [data, error] = await Api.Get('book/current');

	if (error) {
		showPageError(error);
		document.querySelector('ul#currently-reading li.currently-loading')?.classList.add('hidden');
		document.querySelector('ul#currently-reading li.no-content')?.classList.remove('hidden');
		return;
	}

	currentBookData = data;

	if (data.length === 0) {
		document.querySelector('ul#currently-reading li.currently-loading')?.classList.add('hidden');
		document.querySelector('ul#currently-reading li.no-content')?.classList.remove('hidden');
		return;
	}

	const fragment = document.createDocumentFragment();

	data.forEach((d) => {
		const li = document.createElement('li');
		li.classList.add('current-item');

		const bookImage = document.createElement('img');
		bookImage.setAttribute('src', d.coverImageUrl);
		bookImage.setAttribute('alt', `${d.fullTitle} by ${d.author}`);
		bookImage.setAttribute('width', '150');
		bookImage.setAttribute('height', '225');

		li.appendChild(bookImage);

		const detailsDiv = document.createElement('div');
		detailsDiv.classList.add('details');

		const titleHeading = document.createElement('h3');
		const link = createLinkElement(d.fullTitle, d.link, true);
		titleHeading.appendChild(link);
		detailsDiv.appendChild(titleHeading);

		const authorHeading = document.createElement('h4');
		authorHeading.textContent = d.author;
		detailsDiv.appendChild(authorHeading);

		const progressBar = document.createElement('progress-bar');
		progressBar.setAttribute('progress', d.progress);
		detailsDiv.appendChild(progressBar);

		const updateProgressButton = document.createElement('button');
		updateProgressButton.textContent = 'Update progress';
		updateProgressButton.classList.add('btn-primary');
		updateProgressButton.setAttribute('type', 'button');
		updateProgressButton.addEventListener('click', function(e) {
			loadUpdateProgressForm('book', d.bookId);
		});
		detailsDiv.appendChild(updateProgressButton);

		li.appendChild(detailsDiv);

		fragment.appendChild(li);
	});

	document.querySelector('ul#currently-reading li.currently-loading')?.classList.add('hidden');

	document.getElementById('currently-reading').appendChild(fragment);
}

async function loadRecentLinks() {
	clearTableRows('ul#recent-links li[data-link]');

	const [data, error] = await Api.Get('link/limit/10');

	if (error) {
		showPageError(error);
		document.querySelector('ul#recent-links li.currently-loading')?.classList.add('hidden');
		document.querySelector('ul#recent-links li.no-content')?.classList.remove('hidden');
		return;
	}

	recentLinkData = data;

	if (data.length === 0) {
		document.querySelector('ul#recent-links li.currently-loading')?.classList.add('hidden');
		document.querySelector('ul#recent-links li.no-content')?.classList.remove('hidden');
		return;
	}

	const recentLinks = data;

	const fragment = document.createDocumentFragment();

	recentLinks.forEach((link) => {
		const li = document.createElement('li');
		li.setAttribute('data-link', true);

		const linkAnchor = document.createElement('a');
		linkAnchor.textContent = link.title;
		linkAnchor.setAttribute('href', link.url);
		linkAnchor.setAttribute('target', '_blank');
		linkAnchor.setAttribute('rel', 'noreferrer noopener');

		li.appendChild(linkAnchor);

		fragment.appendChild(li);
	});

	document.querySelector('ul#recent-links li.currently-loading')?.classList.add('hidden');

	document.getElementById('recent-links').appendChild(fragment);
}

async function loadCurrentTv() {
	clearTableRows('ul#currently-watching li.current-item');

	const [data, error] = await Api.Get('tv/current');

	if (error) {
		showPageError(error);
		document.querySelector('ul#currently-watching li.currently-loading')?.classList.add('hidden');
		document.querySelector('ul#currently-watching li.no-content')?.classList.remove('hidden');
		return;
	}

	currentTvData = data.sort((a, b) => sortByTitle(a.title, b.title));

	if (data.length === 0) {
		document.querySelector('ul#currently-watching li.currently-loading')?.classList.add('hidden');
		document.querySelector('ul#currently-watching li.no-content')?.classList.remove('hidden');
		return;
	}

	const fragment = document.createDocumentFragment();

	currentTvData.forEach((tv) => {
		const li = document.createElement('li');
		li.classList.add('current-item');

		const tvImage = document.createElement('img');
		tvImage.setAttribute('src', tv.coverImageUrl);
		tvImage.setAttribute('alt', tv.title);
		tvImage.setAttribute('width', '150');
		tvImage.setAttribute('height', '225');

		li.appendChild(tvImage);

		const detailsDiv = document.createElement('div');
		detailsDiv.classList.add('details');

		const titleHeading = document.createElement('h3');
		titleHeading.appendChild(createLinkElement(tv.title, tv.imdbLink, true));
		detailsDiv.appendChild(titleHeading);

		const progressBar = document.createElement('progress-bar');
		progressBar.setAttribute('progress', tv.progress);
		detailsDiv.appendChild(progressBar);

		const updateProgressButton = document.createElement('button');
		updateProgressButton.textContent = 'Update progress';
		updateProgressButton.classList.add('btn-primary');
		updateProgressButton.setAttribute('type', 'button');
		updateProgressButton.addEventListener('click', function(e) {
			loadUpdateProgressForm('tv', tv.televisionShowId);
		});
		detailsDiv.appendChild(updateProgressButton);

		li.appendChild(detailsDiv);

		fragment.appendChild(li);
	});

	document.querySelector('ul#currently-watching li.currently-loading')?.classList.add('hidden');

	document.getElementById('currently-watching').appendChild(fragment);
}

async function loadRecentBooks() {
	const [data, error] = await Api.Get('book/recent/30');

	if (error) {
		showPageError(error);
		document.querySelector('ul#recent-books li.currently-loading')?.classList.add('hidden');
		document.querySelector('ul#recent-books li.no-content')?.classList.remove('hidden');
		return;
	}

	recentBookData = data.sort((a, b) => sortByDate((a.dateCompleted).toString(), (b.dateCompleted).toString())) ?? [];

	if (data.length === 0) {
		document.querySelector('ul#recent-books li.currently-loading')?.classList.add('hidden');
		document.querySelector('ul#recent-books li.no-content')?.classList.remove('hidden');
		return;
	}

	const fragment = document.createDocumentFragment();

	recentBookData.forEach((book) => {
		const li = document.createElement('li');
		li.classList.add('current-item');

		const bookImage = document.createElement('img');
		bookImage.setAttribute('src', book.coverImageUrl);
		bookImage.setAttribute('alt', `${book.fullTitle} by ${book.author}`);
		bookImage.setAttribute('width', '150');
		bookImage.setAttribute('height', '225');

		li.appendChild(bookImage);

		const detailsDiv = document.createElement('div');
		detailsDiv.classList.add('details');

		const titleHeading = document.createElement('h3');
		const link = createLinkElement(book.fullTitle, book.link, true);
		titleHeading.appendChild(link);

		detailsDiv.appendChild(titleHeading);

		const authorHeading = document.createElement('h4');
		authorHeading.textContent = book.author;
		detailsDiv.appendChild(authorHeading);

		const dateCompleted = document.createElement('p');
		dateCompleted.classList.add('metadata');
		dateCompleted.textContent = dayjs(book.dateCompleted).format('MMMM D, YYYY');
		detailsDiv.appendChild(dateCompleted);

		const ratingDisplay = document.createElement('rating-display');
		ratingDisplay.setAttribute('data-rating', book.rating);
		ratingDisplay.setAttribute('data-size', 'md');
		detailsDiv.appendChild(ratingDisplay);

		li.appendChild(detailsDiv);

		fragment.appendChild(li);
	});

	document.querySelector('ul#recent-books li.currently-loading')?.classList.add('hidden');

	document.getElementById('recent-books').appendChild(fragment);
}

async function loadCurrentVideoGames() {
	const [data, error] = await Api.Get('video-game/current');

	if (error) {
		showPageError(error);
		document.querySelector('ul#currently-playing li.currently-loading')?.classList.add('hidden');
		document.querySelector('ul#currently-playing li.no-content')?.classList.remove('hidden');
		return;
	}

	currentVideoGameData = data.sort((a, b) => sortByTitle(a.title, b.title));

	if (data.length === 0) {
		document.querySelector('ul#currently-playing li.currently-loading')?.classList.add('hidden');
		document.querySelector('ul#currently-playing li.no-content')?.classList.remove('hidden');
		return;
	}

	const fragment = document.createDocumentFragment();

	currentVideoGameData.forEach((game) => {
		const li = document.createElement('li');

		const divContent = document.createElement('div');
		divContent.classList.add('content');

		const coverImage = document.createElement('img');
		coverImage.setAttribute('src', game.coverImageUrl);
		coverImage.setAttribute('alt', game.title);
		coverImage.setAttribute('width', '150');
		coverImage.setAttribute('height', '225');

		divContent.appendChild(coverImage);

		const titleHeading = document.createElement('h3');
		titleHeading.appendChild(createLinkElement(game.title, game.link, true));
		divContent.appendChild(titleHeading);

		li.appendChild(divContent);

		fragment.appendChild(li);
	});

	document.querySelector('ul#currently-playing li.currently-loading')?.classList.add('hidden');

	document.getElementById('currently-playing').appendChild(fragment);
}

async function loadCurrentMusic() {
	const [data, error] = await Api.Get('music/now');

	if (error) {
		showPageError(error);
		document.querySelector('ul#currently-listening-to li.currently-loading')?.classList.add('hidden');
		document.querySelector('ul#currently-listening-to li.no-content')?.classList.remove('hidden');
		return;
	}

	currentMusic = data.sort((a, b) => sortByTitle(a.title, b.title));

	if (data.length === 0) {
		document.querySelector('ul#currently-listening-to li.currently-loading')?.classList.add('hidden');
		document.querySelector('ul#currently-listening-to li.no-content')?.classList.remove('hidden');
		return;
	}

	const fragment = document.createDocumentFragment();

	currentMusic.forEach((album) => {
		const li = document.createElement('li');

		const divContent = document.createElement('div');
		divContent.classList.add('content');

		const coverImage = document.createElement('img');
		coverImage.setAttribute('src', album.coverImageUrl);
		coverImage.setAttribute('alt', `${album.artist} - ${album.title}`);
		coverImage.setAttribute('width', '150');
		coverImage.setAttribute('height', '225');

		divContent.appendChild(coverImage);

		const titleHeading = document.createElement('h3');
		titleHeading.textContent = `${album.artist} - ${album.title}`;
		divContent.appendChild(titleHeading);

		li.appendChild(divContent);

		fragment.appendChild(li);
	});

	document.querySelector('ul#currently-listening-to li.currently-loading')?.classList.add('hidden');

	document.getElementById('currently-listening-to').appendChild(fragment);
}

async function loadRecentMovies() {
	const [data, error] = await Api.Get('movie/recent/30');

	if (error) {
		showPageError(error);
		document.querySelector('ul#recent-movies li.currently-loading')?.classList.add('hidden');
		document.querySelector('ul#recent-movies li.no-content')?.classList.remove('hidden');
		return;
	}

	recentMovies = data.sort((a, b) => sortByDate((a.dateWatched).toString(), (b.dateWatched).toString())) ?? [];

	if (data.length === 0) {
		document.querySelector('ul#recent-movies li.currently-loading')?.classList.add('hidden');
		document.querySelector('ul#recent-movies li.no-content')?.classList.remove('hidden');
		return;
	}

	const fragment = document.createDocumentFragment();

	recentMovies.forEach((movie) => {
		const li = document.createElement('li');
		li.classList.add('current-item');

		const movieImage = document.createElement('img');
		movieImage.setAttribute('src', movie.posterImageUrl);
		movieImage.setAttribute('alt', movie.title);
		movieImage.setAttribute('width', '150');
		movieImage.setAttribute('height', '225');

		li.appendChild(movieImage);

		const detailsDiv = document.createElement('div');
		detailsDiv.classList.add('details');

		const titleHeading = document.createElement('h3');
		titleHeading.appendChild(createLinkElement(movie.title, movie.imdbLink, true));
		detailsDiv.appendChild(titleHeading);

		const dateWatched = document.createElement('p');
		dateWatched.classList.add('metadata');
		dateWatched.textContent = dayjs(movie.dateWatched).format('MMMM D, YYYY');
		detailsDiv.appendChild(dateWatched);

		const ratingDisplay = document.createElement('rating-display');
		ratingDisplay.setAttribute('data-rating', movie.rating);
		ratingDisplay.setAttribute('data-size', 'md');
		detailsDiv.appendChild(ratingDisplay);

		li.appendChild(detailsDiv);

		fragment.appendChild(li);
	});

	document.querySelector('ul#recent-movies li.currently-loading')?.classList.add('hidden');

	document.getElementById('recent-movies').appendChild(fragment);
}

async function loadLinkCategories() {
	const [data, error] = await Api.Get('link/category');

	if (error) {
		showPageError(error);
		return;
	}

	linkCategories = data;

	const fragment = document.createDocumentFragment();

	linkCategories.forEach((category) => {
		const opt = document.createElement('option');
		opt.setAttribute('value', category.linkCategoryId);
		opt.textContent = category.name;

		fragment.appendChild(opt);
	});

	document.getElementById('link-category').appendChild(fragment);
}

function loadUpdateProgressForm(mediaType, id) {
	let isFound = false;
	let imageUrl = '';
	let title = '';
	let progress = 0;
	let totalValue = 0;
	let currentValue = '';
	let labelText = '';

	if (mediaType === 'book') {
		const book = currentBookData.find((b) => b.bookId === id);
		if (book) {
			isFound = true;
			imageUrl = book.coverImageUrl;
			title = book.fullTitle;
			progress = book.progress;
			currentValue = book.currentPage;
			totalValue = book.pageCount;
			labelText = 'Current Page';
		}
	} else {
		const tvShow = currentTvData.find((t) => t.televisionShowId === id);
		if (tvShow) {
			isFound = true;
			imageUrl = tvShow.coverImageUrl;
			title = tvShow.title;
			progress = tvShow.progress;
			currentValue = tvShow.currentSeasonEpisode;
			totalValue = tvShow.seasonEpisodeCount;
			labelText = 'Current Season or Episode';
		}
	}

	if (!isFound) {
		alert(`Unable to find specified ${mediaType}`);
		return;
	}

	document.querySelector('dialog#update-progress img').setAttribute('src', imageUrl);
	document.querySelector('dialog#update-progress img').setAttribute('alt', title);
	document.querySelector('dialog#update-progress progress-bar').setAttribute('progress', progress);
	document.querySelector('dialog#update-progress progress-bar .inner-bar').textContent = `${progress}%`;
	document.querySelector('dialog#update-progress h2').textContent = title;
	document.querySelector('dialog#update-progress input#progress').value = currentValue;
	document.querySelector('dialog#update-progress input#total-count').value = totalValue;
	document.querySelector('dialog#update-progress .label-text').textContent = labelText;
	document.querySelector('dialog#update-progress input#object-type').value = mediaType;
	document.querySelector('dialog#update-progress input#object-id').value = id;

	document.querySelector('dialog#update-progress').showModal();
}

function updateProgressBar(newValue) {
	const totalValue = parseInt(document.querySelector('dialog#update-progress input#total-count').value);
	const updatedProgress = calculateProgress(newValue, totalValue);

	document.querySelector('dialog#update-progress progress-bar').setAttribute('progress', updatedProgress);
	document.querySelector('dialog#update-progress progress-bar .inner-bar').textContent = `${updatedProgress}%`;
}

async function updateBookProgress(bookId, currentPage) {
	const [, error] = await Api.Put(`book/update-progress/${bookId}`, {
		data: {
			currentPage,
		},
	});

	if (error === null) {
		loadCurrentBooks();
	}

	return error;
}

async function updateTvShowProgress(televisionShowId, currentSeasonEpisode) {
	const [, error] = await Api.Put(`tv/update-progress/${televisionShowId}`, {
		data: {
			currentSeasonEpisode,
		},
	});

	if (error === null) {
		loadCurrentTv();
	}

	return error;
}

async function updateProgress() {
	document.querySelector('dialog#update-progress button[type="submit"]').setAttribute('disabled', true);

	hideModalError();
	const objectType = document.querySelector('dialog#update-progress input#object-type').value
	const objectId = parseInt(document.querySelector('dialog#update-progress input#object-id').value);
	const currentValue = parseInt(document.querySelector('dialog#update-progress input#progress').value);

	const error = objectType === 'book'
		? await updateBookProgress(objectId, currentValue)
		: await updateTvShowProgress(objectId, currentValue);

	document.querySelector('dialog#update-progress button[type="submit"]').removeAttribute('disabled');

	if (error) {
		showModalError(error);
		return;
	}

	document.querySelector('dialog#update-progress').close();
}

async function saveLink() {
	hideModalError('add-link-modal-error');

	const title = document.querySelector('#link-title').value;
	const url = document.querySelector('#link-url').value;
	const author = document.querySelector('#link-author').value;
	const date = document.querySelector('#link-date').value;
	const issue = document.querySelector('#link-issue-number').value;
	const linkType = document.querySelector('#link-type').value;
	const linkCategory = document.querySelector('#link-category').value;

	const [, error] = await Api.Post('link', {
        data: {
            linkTypeId: parseInt(linkType),
            linkCategoryId: parseInt(linkCategory),
            title,
            author,
            url,
            linkDate: date,
            readingLogIssueNumber: issue,
        }
    });

	if (error) {
		showModalError(error, 'add-link-modal-error');
		return;
	}

	await loadRecentLinks();

	closeAddLinkForm();
}

function closeAddLinkForm() {
	document.querySelector('form[name="add-link"]').reset()
	document.querySelector('dialog#add-link').close();
}

async function initializePage() {
	await Promise.all([
        loadCurrentBooks(),
        loadRecentLinks(),
        loadCurrentTv(),
        loadRecentBooks(),
        loadCurrentVideoGames(),
        loadCurrentMusic(),
        loadRecentMovies(),
        loadLinkCategories(),
    ]);
}
