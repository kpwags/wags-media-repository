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

	document.querySelector('form[name="update-progress"]').addEventListener('submit', function (e) {
		e.preventDefault();

		updateProgress();
	});

	document.querySelector('form[name="finish-book"]').addEventListener('submit', function (e) {
		e.preventDefault();

		markBookAsFinished();
	});

	document.querySelector('button#mark-finished-dialog-cancel').addEventListener('click', function () {
		closeMarkFinishedForm();
	});

	document.querySelector('form[name="add-link"]').addEventListener('submit', function (e) {
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
	const template = document.querySelector('template#current-book-template');

	data.forEach((d) => {
		const li = template.content.cloneNode(true);

		li.querySelector('img').setAttribute('src', d.coverImageUrl);
		li.querySelector('img').setAttribute('alt', `${d.fullTitle} by ${d.author}`);


		li.querySelector('h3 a').setAttribute('href', d.link);
		li.querySelector('h3 a').textContent = d.fullTitle;

		li.querySelector('h4').textContent = d.author;

		li.querySelector('progress-bar').setAttribute('progress', d.progress);

		li.querySelector('button.btn-primary')?.addEventListener('click', function () {
			loadUpdateProgressForm('book', d.bookId);
		});

		li.querySelector('button.btn-ghost')?.addEventListener('click', function () {
			loadFinishBookModal(d.bookId);
		});

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
	const template = document.querySelector('template#current-tv-template');

	currentTvData.forEach((tv) => {
		const li = template.content.cloneNode(true);

		li.querySelector('img').setAttribute('src', tv.coverImageUrl);
		li.querySelector('img').setAttribute('alt', tv.title);


		li.querySelector('h3 a').setAttribute('href', tv.imdbLink);
		li.querySelector('h3 a').textContent = tv.title;

		li.querySelector('progress-bar').setAttribute('progress', tv.progress);

		li.querySelector('button.btn-primary')?.addEventListener('click', function () {
			loadUpdateProgressForm('tv', tv.televisionShowId);
		});

		fragment.appendChild(li);
	});

	document.querySelector('ul#currently-watching li.currently-loading')?.classList.add('hidden');

	document.getElementById('currently-watching').appendChild(fragment);
}

async function loadRecentBooks() {
	clearTableRows('ul#recent-books li.current-item');
	document.querySelector('ul#recent-books li.currently-loading')?.classList.remove('hidden');
	document.querySelector('ul#recent-books li.no-content')?.classList.add('hidden');

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
		const recentBook = document.createElement('recent-book');

		recentBook.setAttribute('data-cover', book.coverImageUrl);
		recentBook.setAttribute('data-title', book.fullTitle);
		recentBook.setAttribute('data-author', book.author);
		recentBook.setAttribute('data-link', book.link);
		recentBook.setAttribute('data-rating', book.rating);
		recentBook.setAttribute('data-datefinished', displayDate(book.dateCompleted, 'MMMM D, YYYY'));

		fragment.appendChild(recentBook);
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
		const videoGame = document.createElement('current-game');

		videoGame.setAttribute('data-cover-art', game.coverImageUrl);
		videoGame.setAttribute('data-title', game.title);
		videoGame.setAttribute('data-link', game.link);

		fragment.appendChild(videoGame);
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

	currentMusic = data;

	if (data.length === 0) {
		document.querySelector('ul#currently-listening-to li.currently-loading')?.classList.add('hidden');
		document.querySelector('ul#currently-listening-to li.no-content')?.classList.remove('hidden');
		return;
	}

	const fragment = document.createDocumentFragment();

	currentMusic.forEach((album) => {
		const musicAlbum = document.createElement('music-album');

		musicAlbum.setAttribute('data-album-art', album.coverImageUrl);
		musicAlbum.setAttribute('data-artist', album.artist);
		musicAlbum.setAttribute('data-title', album.title);

		fragment.appendChild(musicAlbum);
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
		const recentMovie = document.createElement('recent-movie');

		recentMovie.setAttribute('data-cover', movie.posterImageUrl);
		recentMovie.setAttribute('data-title', movie.title);
		recentMovie.setAttribute('data-link', movie.imdbLink);
		recentMovie.setAttribute('data-rating', movie.rating);
		recentMovie.setAttribute('data-datewatched', displayDate(movie.dateWatched, 'MMMM D, YYYY'));

		fragment.appendChild(recentMovie);
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
	document.querySelector('dialog#update-progress h2.item-title').textContent = title;
	document.querySelector('dialog#update-progress input#progress').value = currentValue;
	document.querySelector('dialog#update-progress input#total-count').value = totalValue;
	document.querySelector('dialog#update-progress .label-text').textContent = labelText;
	document.querySelector('dialog#update-progress input#object-type').value = mediaType;
	document.querySelector('dialog#update-progress input#object-id').value = id;

	document.querySelector('dialog#update-progress').showModal();
}

function loadFinishBookModal(bookId) {
	const book = currentBookData.find((b) => b.bookId === bookId);

	if (book) {
		document.querySelector('dialog#mark-book-finished input#finish-book-id').value = bookId;
		document.querySelector('dialog#mark-book-finished img').setAttribute('src', book.coverImageUrl);
		document.querySelector('dialog#mark-book-finished img').setAttribute('alt', book.fullTitle);
		document.querySelector('dialog#mark-book-finished .book-information h2').textContent = book.fullTitle;
		document.querySelector('dialog#mark-book-finished .book-information h3').textContent = `by ${book.author}`;
		document.querySelector('dialog#mark-book-finished .book-information dd.book-type').textContent = book.type?.name ?? 'Unspecified';
		document.querySelector('dialog#mark-book-finished .book-information dd.book-format').textContent = book.formats[0]?.name ?? 'Unspecified';
		document.querySelector('dialog#mark-book-finished .book-information dd.book-started').textContent = dayjs(book.dateStarted).format('MMMM DD, YYYY');
		document.querySelector('dialog#mark-book-finished input#book-date-completed').value = dayjs().format('YYYY-MM-DD');
		document.querySelector('#book-rating').setAttribute('rating', 0);

		document.querySelector('dialog#mark-book-finished').showModal();
	}
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
	setButtonProcessing(true, 'submit-form-button.update-progress', 'Updating...', 'update-progress');

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

	setButtonProcessing(false, 'submit-form-button.update-progress', 'Update', 'update-progress');
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

function closeMarkFinishedForm() {
	document.querySelector('form[name="finish-book"]').reset()
	document.querySelector('dialog#mark-book-finished').close();
}

async function markBookAsFinished() {
	setButtonProcessing(true, 'submit-form-button.finish-book', 'Finishing...', 'finish-book');
	hideModalError('finish-book-modal-error');

	const bookId = parseInt(document.querySelector('#finish-book-id').value);
	const rating = parseInt(document.querySelector('#book-rating-value').value);
	const thoughts = document.querySelector('#book-thoughts').value;
	const dateCompleted = document.querySelector('#book-date-completed').value;

	const [, error] = await Api.Put(`book/mark-finished/${bookId}`, {
		data: {
			rating,
			thoughts,
			dateCompleted
		},
	});

	if (error) {
		showModalError(error, 'finish-book-modal-error');
		return;
	}

	await Promise.all([loadCurrentBooks(), loadRecentBooks()]);

	closeMarkFinishedForm();
	setButtonProcessing(false, 'submit-form-button.finish-book', 'Finish Book', 'finish-book');
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
