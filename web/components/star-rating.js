const emptyStar = (id, hidden) => `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" id="${id}" class="${hidden ? 'hidden' : ''}"">
  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
</svg>
`;

const filledStar = (id, hidden) => `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" id="${id}" class="${hidden ? 'hidden' : ''}"">
  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
</svg>
`;

class StarRating extends HTMLElement {
    static observedAttributes = ["fieldid", "rating"];

    constructor() {
        super();

        this.fieldid = "star-rating";
        this.rating = 0;
    }

    get inputId() {
        return this.getAttribute('inputId');
    }

    refreshRating(rating) {
        if (document.querySelector(`#${this.fieldid}-value`)) {
            document.querySelector(`#${this.fieldid}-value`).value = rating;
        }

        for (let i = 1; i <= 5; i += 1) {
            if (i > rating) {
                document.querySelector(`#${this.fieldid}-${i}-filled`)?.classList.remove('hidden');
                document.querySelector(`#${this.fieldid}-${i}-empty`)?.classList.add('hidden');
            } else {
                document.querySelector(`#${this.fieldid}-${i}-filled`)?.classList.add('hidden');
                document.querySelector(`#${this.fieldid}-${i}-empty`)?.classList.remove('hidden');
            }
        }
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue !== newValue && property === 'rating') {
            this.refreshRating(parseInt(newValue));
        }

        this[property] = newValue;
    }

    connectedCallback() {
        this.innerHTML = `
			<div class="star-controls">
                <input type="hidden" name="${this.fieldid}-value" id="${this.fieldid}-value" value="${this.rating}" />
                
                <button type="button" class="btn-icon padding-none" data-field="${this.fieldid}" data-type="star-rating" data-rating="1">
                    ${emptyStar(`${this.fieldid}-1-filled`, this.rating >= 1)}
                    ${filledStar(`${this.fieldid}-1-empty`, this.rating < 1)}
                </button>

                <button type="button" class="btn-icon padding-none" data-field="${this.fieldid}" data-type="star-rating" data-rating="2">
                    ${emptyStar(`${this.fieldid}-2-filled`, this.rating >= 2)}
                    ${filledStar(`${this.fieldid}-2-empty`, this.rating < 2)}
                </button>

                <button type="button" class="btn-icon padding-none" data-field="${this.fieldid}" data-type="star-rating" data-rating="3">
                    ${emptyStar(`${this.fieldid}-3-filled`, this.rating >= 3)}
                    ${filledStar(`${this.fieldid}-3-empty`, this.rating < 3)}
                </button>

                <button type="button" class="btn-icon padding-none" data-field="${this.fieldid}" data-type="star-rating" data-rating="4">
                    ${emptyStar(`${this.fieldid}-4-filled`, this.rating >= 4)}
                    ${filledStar(`${this.fieldid}-4-empty`, this.rating < 4)}
                </button>

                <button type="button" class="btn-icon padding-none" data-field="${this.fieldid}" data-type="star-rating" data-rating="5">
                    ${emptyStar(`${this.fieldid}-5-filled`, this.rating >= 5)}
                    ${filledStar(`${this.fieldid}-5-empty`, this.rating < 5)}
                </button>

                <button type="button" class="btn-icon padding-none clear-rating" data-field="${this.fieldid}" data-type="star-rating" data-rating="0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </button>
            </div>
		`;
    }
}

customElements.define('wags-media-star-rating', StarRating);