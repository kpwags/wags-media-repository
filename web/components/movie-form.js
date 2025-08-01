class MovieForm extends HTMLElement {
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
			<dialog id="add-movie" class="form-dialog">
				<h2 class="modal-title">Add Movie</h2>
			
				<div class="container">
					<div id="add-movie-modal-error" class="alert error hidden"></div>

					<form name="add-movie">
						<input type="hidden" id="movieId" name="movieId" value="0" />

						<div class="form-field">
							<label for="movie-title">
								<span class="required">*</span>Title
								<input type="text" name="movie-title" id="movie-title" required
								/>
							</label>
						</div>

						<div class="form-field">
							<label for="movie-status">
								<span class="required">*</span>Status
								<select name="movie-status" id="movie-status" required>
									<option></option>
									<option value="1" ${this.status === 1 ? 'selected' : ''}>Personal Backlog</option>
									<option value="2" ${this.status === 2 ? 'selected' : ''}>Joint Backlog</option>
									<option value="3" ${this.status === 3 ? 'selected' : ''}>Finished</option>
									<option value="4" ${this.status === 4 ? 'selected' : ''}>Abandoned</option>
								</select>
							</label>
						</div>

						<div class="form-field">
							<label for="movie-imdblink">
								<span class="required">*</span>IMDb Link
								<input type="url" name="movie-imdblink" id="movie-imdblink" required />
							</label>
						</div>

						<div class="form-field">
							<label for="movie-cover-url">
								Cover URL
								<input type="url" name="movie-cover-url" id="movie-cover-url" />
							</label>
						</div>

						<div class="form-field">
							<label for="movie-sort">
								Sort Order
								<input type="text" name="movie-sort" id="movie-sort" />
							</label>
						</div>

						<div class="form-field">
							<label for="movie-genre">
								Genre(s)
								<select id="movie-genre" name="genres" multiple></select>
							</label>
						</div>

						<div class="form-field">
							<label for="movie-service">
								Service(s)
								<select id="movie-service" name="services" multiple></select>
							</label>
						</div>

						<div class="form-field">
							<label for="movie-date">
								Date Watched
								<input type="date" name="movie-date" id="movie-date" />
							</label>
						</div>

						<div class="form-field">
							<label>
								Rating
								<star-rating id="movie-rating" fieldid="movie-rating" rating="0"></star-rating>
							</label>
						</div>

						<div class="form-field">
							<label for="movie-thoughts">
								Thoughts
								<textarea id="movie-thoughts" name="movie-thoughts"></textarea>
							</label>
						</div>

						<div class="actions">
							<button type="submit" class="btn-primary">Save</button>
							<button type="button" class="btn-ghost" id="movie-form-dialog-cancel">Cancel</button>
						</div>
					</form>
				</div>
			</dialog>
		`;
	}
}

customElements.define('movie-form', MovieForm);
