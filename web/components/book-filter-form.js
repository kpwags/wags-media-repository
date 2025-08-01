class BookFilterForm extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<dialog id="filter-book" class="form-dialog">
				<h2 class="modal-title">Filter Books</h2>
			
				<div class="container">
					<form name="filter-book">
						<div class="form-field">
							<label for="filter-book-title">
								Title / Author
								<input type="text" name="book-title" id="filter-book-title" />
							</label>
						</div>

						<div class="form-field">
							<label for="filter-book-genre">
								Genre
								<select name="book-genre" id="filter-book-genre">
									<option value="0">All</option>
								</select>
							</label>
						</div>

						<div class="form-field">
							<label for="filter-book-series">
								Series
								<select name="book-series" id="filter-book-series">
									<option value="0">All</option>
								</select>
							</label>
						</div>

						<div class="form-field">
							<label for="filter-book-type">
								Type
								<select name="book-type" id="filter-book-type">
									<option value="0">All</option>
									<option value="1">Fiction</option>
									<option value="2">Non-Fiction</option>
									<option value="3">Reference</option>
								</select>
							</label>
						</div>

						<div class="form-field">
							<label for="filter-is-purchased">
								<input type="checkbox" name="filter-is-purchased" id="filter-is-purchased" value="true" switch />
								Purchased
							</label>
						</div>

						<div class="form-field">
							<label for="filter-at-library">
								<input type="checkbox" name="filter-at-library" id="filter-at-library" value="true" switch />
								At Library
							</label>
						</div>

						<div class="actions">
							<button type="submit" class="btn-primary">Filter</button>
							<button type="button" class="btn-ghost" id="book-filter-cancel">Cancel</button>
						</div>
					</form>
				</div>
			</dialog>
		`;
	}
}

customElements.define('book-filter-form', BookFilterForm);
