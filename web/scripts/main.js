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

function showModalError(error, elementId = 'modal-error') {
    const modalError = document.getElementById(elementId);

    if (modalError) {
        modalError.textContent = error;
        modalError.classList.remove('hidden');
    }
}

function hideModalError(elementId = 'modal-error') {
    const modalError = document.getElementById(elementId);

    if (modalError) {
        modalError.classList.add('hidden');
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

function calculateProgress(current, final) {
    const currentNumber = current ?? 0;
    const finalNumber = final ?? 0;

    if (finalNumber === 0) {
        return 0;
    }

    return Math.round((currentNumber / finalNumber) * 100);
}

function sortByTitle(a, b) {
    const articles = ['a', 'an', 'the'],
        re = new RegExp('^(?:(' + articles.join('|') + ') )(.*)$'), // e.g. /^(?:(foo|bar) )(.*)$/
        replacor = function (_, $1, $2) {
            return $2 + ', ' + $1;
        };
    a = a.toLowerCase().replace(re, replacor);
    b = b.toLowerCase().replace(re, replacor);

    return a === b ? 0 : a < b ? -1 : 1;
}

function sortByDate(a, b) {
    try {
        const date1 = new Date(a ?? '1/1/1900');
        const date2 = new Date(b ?? '1/1/1900');

        return date2.getTime() - date1.getTime();
    } catch {
        return 0;
    }
}

function sortByDateAsc(a, b) {
    try {
        const date1 = new Date(a ?? '1/1/1900');
        const date2 = new Date(b ?? '1/1/1900');

        return date1.getTime() - date2.getTime();
    } catch {
        return 0;
    }
}

function sortBySortOrder(a, b) {
    return (a ?? Number.MAX_SAFE_INTEGER) - (b ?? Number.MAX_SAFE_INTEGER);
}

function cancelOutOfConfirmDialog(keyFieldSelector = undefined) {
    if (keyFieldSelector) {
        document.querySelector(keyFieldSelector).value = 0;
    }

    document.querySelector('dialog.confirm-dialog').close();
}

function buildTagList() {
    const ul = document.createElement('ul');
    ul.classList.add('tag-list');

    return ul;
}

function buildTagListItem(text, color) {
    const li = document.createElement('li');
    li.setAttribute('style', `background: ${color};`);
    li.textContent = text;

    return li;
}

function getValuesFromMultiSelect(querySelector) {
    const selectedOptions = document.querySelector(querySelector).selectedOptions;

    const values = [];

    for (const option of selectedOptions) {
        values.push(parseInt(option.value));
    }

    return values;
}

function setMultiselectValues(querySelector, values) {
    const options = document.querySelectorAll(`${querySelector} option`);

    for (const option of options) {
        if (values.includes(parseInt(option.value))) {
            option.setAttribute('selected', true);
        }
    }
}

function resetMultiselect(querySelector) {
    const options = document.querySelectorAll(`${querySelector} option`);

    for (const option of options) {
        option.removeAttribute('selected');
    }
}
