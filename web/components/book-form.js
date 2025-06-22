class BookForm extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<dialog id="add-book" class="standard-modal">
				<div class="container">
					<h2>Add Book</h2>

					<div id="add-book-modal-error" class="alert error hidden"></div>

					<form name="add-book">
						<input type="hidden" id="bookId" name="bookId" value="0" />

						<div class="form-field">
							<label for="book-title">
								<span class="required">*</span>Title
								<input type="text" name="book-title" id="book-title" required />
							</label>
						</div>

						<div class="form-field">
							<label for="book-subtitle">
								Subtitle
								<input type="text" name="book-subtitle" id="book-subtitle" />
							</label>
						</div>

						<div class="form-field">
							<label for="book-author">
								<span class="required">*</span>Author
								<input type="text" name="book-author" id="book-author" required />
							</label>
						</div>

						<div class="form-field">
							<label for="book-status">
								<span class="required">*</span>Status
								<select name="book-status" id="book-status" required>
									<option value="1" selected>Backlog</option>
									<option value="2">Currently Reading</option>
									<option value="3">Finished</option>
									<option value="4">Abandoned</option>
								</select>
							</label>
						</div>

						<div class="form-field">
							<label for="book-type">
								<span class="required">*</span>Type
								<select name="book-type" id="book-type" required>
									<option></option>
									<option value="1">Fiction</option>
									<option value="2">Non-Fiction</option>
									<option value="3">Reference</option>
								</select>
							</label>
						</div>

						<div class="form-field">
							<label for="book-series">
								Series
								<select id="book-series" name="book-series">
									<option></option>
								</select>
							</label>
						</div>

						<div class="form-field">
							<label for="book-link">
								<span class="required">*</span>Link
								<input type="url" name="book-link" id="book-link" required />
							</label>
						</div>

						<div class="form-field">
							<label for="book-cover-url">
								Cover
								<input type="url" name="book-cover-url" id="book-cover-url" />
							</label>
						</div>

						<div class="form-field">
							<label for="book-sort">
								Sort Order
								<input type="text" name="book-sort" id="book-sort" />
							</label>
						</div>

						<div class="form-field dual">
							<label for="is-purchased">
								<input type="checkbox" name="is-purchased" id="is-purchased" value="true" switch />
								Purchased
							</label>
							<label for="at-library">
								<input type="checkbox" name="at-library" id="at-library" value="true" switch />
								At Library
							</label>
						</div>

						<div class="form-field">
							<label for="book-genre">
								Genre(s)
								<select id="book-genre" name="book-genre" multiple></select>
							</label>
						</div>

						<div class="form-field">
							<label for="book-format">
								Format(s)
								<select id="book-format" name="book-format" multiple>
									<option value="1">Harcover</option>
									<option value="2">Paperback</option>
									<option value="3">eBook</option>
									<option value="4">Audiobook</option>
								</select>
							</label>
						</div>

						<div class="form-field">
							<label for="book-heard-about-from">
								Heard About From
								<input type="text" name="book-heard-about-from" id="book-heard-about-from" />
							</label>
						</div>

						<div class="form-field dual">
							<label for="book-date-started">
								Date Started
								<input type="date" name="book-date-started" id="book-date-started" />
							</label>
							<label for="book-date-completed">
								Date Completed
								<input type="date" name="book-date-started" id="book-date-completed" />
							</label>
						</div>

						<div class="form-field dual">
							<label for="book-current-page">
								Current Page
								<input type="text" name="book-current-page" id="book-current-page" />
							</label>
							<label for="book-page-count">
								Page Count
								<input type="text" id="book-page-count" name="book-page-count" />
							</label>
						</div>

						<div class="form-field">
							<label>
								Rating
								<star-rating id="book-rating" fieldid="book-rating" rating="0"></star-rating>
							</label>
						</div>

						<div class="form-field">
							<label for="book-thoughts">
								Thoughts
								<textarea id="book-thoughts" name="book-thoughts"></textarea>
							</label>
						</div>

						<div class="form-field">
							<label for="book-notes-url">
								Notes URL
								<input type="text" name="book-notes-url" id="book-notes-url" />
							</label>
						</div>

						<div class="actions">
							<button type="submit" class="btn-primary">Save</button>
							<button type="button" class="btn-ghost" id="book-form-dialog-cancel">Cancel</button>
						</div>
					</form>
				</div>
			</dialog>
		`;
	}
}

customElements.define('book-form', BookForm);