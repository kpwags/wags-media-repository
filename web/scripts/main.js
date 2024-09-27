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