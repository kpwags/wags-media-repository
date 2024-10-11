const apiUrl = 'http://localhost:3010';
// const apiUrl = 'http://192.168.1.232:3010';

window.addEventListener('load', () => {
    const mainMenu = document.querySelector('header button.menu-button');

    mainMenu?.addEventListener('click', toggleSidebar);
});

function toggleSidebar() {
    const sidebar = document.querySelector('aside#sidebar');
    const mainContent = document.querySelector('main');

    if (sidebar.hasAttribute('data-collapsed')) {
        sidebar.removeAttribute('data-collapsed');
    } else {
        sidebar.setAttribute('data-collapsed', true);
    }
}

function showPageError(error) {
    const pageError = document.getElementById('page-error');

    if (pageError) {
        pageError.textContent = error;
        pageError.classList.remove('hidden');
    }
}

function hidePageError(error) {
    const pageError = document.getElementById('page-error');

    if (pageError) {
        pageError.classList.add('hidden');
    }
}

function showModalError(error) {
    const pageError = document.getElementById('modal-error');

    if (pageError) {
        pageError.textContent = error;
        pageError.classList.remove('hidden');
    }
}

function hideModalError(error) {
    const pageError = document.getElementById('modal-error');

    if (pageError) {
        pageError.classList.add('hidden');
    }
}

function disableFieldset() {
    document.querySelector('fieldset')?.setAttribute('disabled', true);
}

function enableFieldset() {
    document.querySelector('fieldset')?.removeAttribute('disabled');
}

function clearTableRows(rowSelector = 'tr.data-row') {
    const rows = document.querySelectorAll(rowSelector);
    rows.forEach((row) => row.remove());
}