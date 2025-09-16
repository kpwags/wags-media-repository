class MusicAlbum extends HTMLElement {
	static observedAttributes = [
		'data-album-art',
		'data-artist',
		'data-title',
	];

	constructor() {
		super();

		this['data-album-art'] = '';
		this['data-artist'] = '';
		this['data-title'] = '';
	}

	attributeChangedCallback(property, _, newValue) {
		this[property] = newValue;
	}

	connectedCallback() {
		this.innerHTML = `
			<li>
				<div class="content">
					<img src="${this['data-album-art']}" alt="${this['data-artist']} - ${this['data-title']}" width="150" height="225" />
					<h3>${this['data-title']}</h3>
					<h4>${this['data-artist']}</h4>
				</div>
			</li>
		`;
	}
}

customElements.define('music-album', MusicAlbum);
