class TvFilterForm extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<dialog id="filter-tv" class="form-dialog">
				<h2 class="modal-title">Filter TV Shows</h2>

				<div class="container">
					<form name="filter-tv">
						<div class="form-field">
							<label for="filter-tv-title">
								Title
								<input type="text" name="tv-title" id="filter-tv-title" />
							</label>
						</div>

						<div class="form-field">
							<label for="filter-tv-genre">
								Genre
								<select name="tv-genre" id="filter-tv-genre">
									<option value="0">All</option>
								</select>
							</label>
						</div>

						<div class="form-field">
							<label for="filter-tv-service">
								Service
								<select name="tv-service" id="filter-tv-service">
									<option value="0">All</option>
								</select>
							</label>
						</div>

						<div class="actions">
							<button type="submit" class="btn-primary">Filter</button>
							<button type="button" class="btn-ghost" id="tv-filter-cancel">Cancel</button>
						</div>
					</form>
				</div>
			</dialog>
		`;
	}
}

customElements.define('tv-filter-form', TvFilterForm);
