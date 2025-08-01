class TvForm extends HTMLElement {
	static observedAttributes = ['status'];

	constructor() {
		super();

		this.status = 1;
	}

	attributeChangedCallback(property, _, newValue) {
		this[property] = parseInt(newValue);
	}

	connectedCallback() {
		this.innerHTML = `
			<dialog id="add-tv-show" class="form-dialog">
				<h2 class="modal-title">Add TV Show</h2>

				<div class="container">
					<div id="add-tv-modal-error" class="alert error hidden"></div>

					<form name="add-tv-show">
						<input type="hidden" id="televisionShowId" name="televisionShowId" value="0" />

						<div class="form-field">
							<label for="tv-title">
								<span class="required">*</span>Title
								<input type="text" name="tv-title" id="tv-title" required />
							</label>
						</div>

						<div class="form-field">
							<label for="tv-status">
								<span class="required">*</span>Status
								<select name="tv-status" id="tv-status" required>
									<option></option>
									<option value="1" ${this.status === 1 ? 'selected' : ''}>Personal Backlog</option>
									<option value="2" ${this.status === 2 ? 'selected' : ''}>Joint Backlog</option>
									<option value="3" ${this.status === 3 ? 'selected' : ''}>Watching</option>
									<option value="4" ${this.status === 4 ? 'selected' : ''}>Between Seasons</option>
									<option value="5" ${this.status === 5 ? 'selected' : ''}>Finished</option>
									<option value="6" ${this.status === 6 ? 'selected' : ''}>Abandoned</option>
								</select>
							</label>
						</div>

						<div class="form-field">
							<label for="tv-imdblink">
								<span class="required">*</span>IMDb Link
								<input type="url" name="tv-imdblink" id="tv-imdblink" required />
							</label>
						</div>

						<div class="form-field">
							<label for="tv-cover-url">
								Cover URL
								<input type="url" name="tv-cover-url" id="tv-cover-url" />
							</label>
						</div>

						<div class="form-field">
							<label for="tv-sort">
								Sort Order
								<input type="text" name="tv-sort" id="tv-sort" />
							</label>
						</div>

						<div class="form-field">
							<label for="tv-genre">
								Genre(s)
								<select id="tv-genre" name="genres" multiple></select>
							</label>
						</div>

						<div class="form-field">
							<label for="tv-service">
								Service(s)
								<select id="tv-service" name="services" multiple></select>
							</label>
						</div>

						<div class="form-field dual">
							<label for="tv-current-episode">
								Current Episode/Season
								<input type="text" name="tv-current-episode" id="tv-current-episode" />
							</label>
							<label for="tv-episode-count">
								Episode/Season Count
								<input type="text" id="tv-episode-count" name="tv-episode-count" />
							</label>
						</div>

						<div class="form-field">
							<label>
								Rating
								<star-rating id="tv-rating" fieldid="tv-rating" rating="0"></star-rating>
							</label>
						</div>

						<div class="form-field">
							<label for="tv-thoughts">
								Thoughts
								<textarea id="tv-thoughts" name="tv-thoughts"></textarea>
							</label>
						</div>

						<div class="actions">
							<button type="submit" class="btn-primary">Save</button>
							<button type="button" class="btn-ghost" id="tv-form-dialog-cancel">Cancel</button>
						</div>
					</form>
				</div>
			</dialog>
		`;
	}
}

customElements.define('tv-form', TvForm);
