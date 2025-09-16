class CurrentGame extends HTMLElement {
	static observedAttributes = [
		'data-cover-art',
		'data-title',
		'data-link',
	];

	constructor() {
		super();

		this['data-cover-art'] = '';
		this['data-title'] = '';
		this['data-link'] = '';
	}

	attributeChangedCallback(property, _, newValue) {
		this[property] = newValue;
	}

	connectedCallback() {
		this.innerHTML = `
			<li>
				<div class="content">
					<img src="${this['data-cover-art']}" alt="" width="150" height="225" />
					<h3>
						<a href="${this['data-link']}" target="_blank" rel="noreferrer nofollow">
							${this['data-title']}
						</a>
					</h3>
				</div>
			</li>
		`;
	}
}

customElements.define('current-game', CurrentGame);
