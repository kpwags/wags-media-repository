class Sidebar extends HTMLElement {
    constructor() {
        super();
    }

    get activeLink() {
        if (!this.getAttribute('activeLink')) {
            return 'home';
        }

        return this.getAttribute('activeLink');
    }

    connectedCallback() {
        this.innerHTML = `
			<aside id="sidebar" ${window.innerWidth <= 500 ? 'data-collapsed' : ''}>
                <ul>
                    <li class="${this.activeLink === 'home' ? 'active' : ''}">
                        <a href="#">Home</a>
                    </li>
                    <li>
                        <details ${this.activeLink.startsWith('books') ? 'open' : ''}">
                            <summary><span>Books</span></summary>
                            <ul class="sub-list">
                                <li class="${this.activeLink === 'books-backlog' ? 'active' : ''}"><a href="/books/backlog.html">Backlog</a></li>
                                <li class="${this.activeLink === 'books-current' ? 'active' : ''}"><a href="/books/current.html">Currently Reading</a></li>
                                <li class="${this.activeLink === 'books-finished' ? 'active' : ''}"><a href="/books/finished.html">Finished</a></li>
                                <li class="${this.activeLink === 'books-abandoned' ? 'active' : ''}"><a href="/books/abandoned.html">Abandoned</a></li>
                            </ul>
                        </details>
                    </li>
                    <li class="${this.activeLink === 'links' ? 'active' : ''}"><a href="#">Links</a></li>
                    <li>
                        <details ${this.activeLink.startsWith('movies') ? 'open' : ''}">
                            <summary><span>Movies</span></summary>
                            <ul class="sub-list">
                                <li class="${this.activeLink === 'movies-personal' ? 'active' : ''}"><a href="/movies/personal.html">Personal List</a></li>
                                <li class="${this.activeLink === 'movies-joint' ? 'active' : ''}"><a href="/movies/joint.html">Joint List</a></li>
                                <li class="${this.activeLink === 'movies-finished' ? 'active' : ''}"><a href="/movies/finished.html">Finished</a></li>
                                <li class="${this.activeLink === 'movies-abandoned' ? 'active' : ''}"><a href="/movies/abandoned.html">Abandoned</a></li>
                            </ul>
                        </details>
                    </li>
                    <li class="${this.activeLink === 'music' ? 'active' : ''}"><a href="#">Music</a></li>
                    <li>
                        <details ${this.activeLink.startsWith('tv') ? 'open' : ''}">
                            <summary><span>TV</span></summary>
                            <ul class="sub-list">
                                <li class="${this.activeLink === 'tv-personal' ? 'active' : ''}"><a href="/tv/personal.html">Personal List</a></li>
                                <li class="${this.activeLink === 'tv-joint' ? 'active' : ''}"><a href="/tv/joint.html">Joint List</a></li>
                                <li class="${this.activeLink === 'tv-current' ? 'active' : ''}"><a href="/tv/current.html">Currently Watching</a></li>
                                <li class="${this.activeLink === 'tv-between-seasons' ? 'active' : ''}"><a href="/tv/between-seasons.html">In-Between Seasons</a></li>
                                <li class="${this.activeLink === 'tv-finished' ? 'active' : ''}"><a href="/tv/finished.html">Finished</a></li>
                                <li class="${this.activeLink === 'tv-abandoned' ? 'active' : ''}"><a href="/tv/abandoned.html">Abandoned</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details ${this.activeLink.startsWith('video-games') ? 'open' : ''}">
                            <summary><span>Video Games</span></summary>
                            <ul class="sub-list">
                                <li class="${this.activeLink === 'video-games-backlog' ? 'active' : ''}"><a href="/video-games/backlog.html">Backlog</a></li>
                                <li class="${this.activeLink === 'video-games-current' ? 'active' : ''}"><a href="/video-games/current.html">Currently Playing</a></li>
                                <li class="${this.activeLink === 'video-games-finished' ? 'active' : ''}"><a href="/video-games/finished.html">Finished</a></li>
                                <li class="${this.activeLink === 'video-games-abandoned' ? 'active' : ''}"><a href="/video-games/abandoned.html">Abandoned</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details ${this.activeLink.startsWith('system') ? 'open' : ''}">
                            <summary><span>System</span></summary>
                            <ul class="sub-list">
                                <li class="${this.activeLink === 'system-video-genres' ? 'active' : ''}"><a href="/system/video-genres.html">Video Genres</a></li>
                                <li class="${this.activeLink === 'system-video-services' ? 'active' : ''}"><a href="/system/video-services.html">Video Services</a></li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </aside>
		`;
    }
}

customElements.define('wags-media-sidebar', Sidebar);