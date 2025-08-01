class MovieFilterForm extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<dialog id="filter-movie" class="form-dialog">
				<h2 class="modal-title">Filter Movies</h2>

				<div class="container">
					<form name="filter-movie">
						<div class="form-field">
							<label for="filter-movie-title">
								Title
								<input
									type="text"
									name="movie-title"
									id="filter-movie-title"
								/>
							</label>
						</div>

						<div class="form-field">
							<label for="filter-movie-genre">
								Genre
								<select name="movie-genre" id="filter-movie-genre">
									<option value="0">All</option>
								</select>
							</label>
						</div>

						<div class="form-field">
							<label for="filter-movie-service">
								Service
								<select name="movie-service" id="filter-movie-service">
									<option value="0">All</option>
								</select>
							</label>
						</div>

						<div class="actions">
							<button type="submit" class="btn-primary">
								Filter
							</button>
							<button type="button" class="btn-ghost" id="movie-filter-cancel">
								Cancel
							</button>
						</div>
					</form>
				</div>
			</dialog>
		`;
	}
}

customElements.define('movie-filter-form', MovieFilterForm);
