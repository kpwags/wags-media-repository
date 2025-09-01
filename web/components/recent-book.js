class RecentBook extends HTMLElement {
	static observedAttributes = [
		'data-cover',
		'data-title',
		'data-author',
		'data-link',
		'data-rating',
		'data-datefinished'
	];

	constructor() {
		super();

		this['data-cover'] = '';
		this['data-title'] = '';
		this['data-author'] = '';
		this['data-link'] = '';
		this['data-datefinished'] = '';
		this['data-rating'] = 0;
	}

	attributeChangedCallback(property, _, newValue) {
		this[property] = newValue;
	}

	connectedCallback() {
		this.innerHTML = `
			<li class="current-item">
				<div class="image"><img src="${this['data-cover']}" alt="${this['data-title']} by ${this['data-author']}" width="150" height="225" /></div>
				<div class="details">
					<h3><a href="${this['data-link']}" target="_blank" rel="noreferrer nofollow">${this['data-title']}</a></h3>
					<h4>${this['data-author']}</h4>
					<p class="metadata">${this['data-datefinished']}</p>
					<rating-display data-rating="${this['data-rating']}" data-size="md"></rating-display>
				</div>
			</li>
		`;
	}
}

customElements.define('recent-book', RecentBook);
