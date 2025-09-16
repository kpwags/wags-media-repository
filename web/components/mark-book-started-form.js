class MarkBookStartedForm extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<dialog id="mark-book-started" class="form-dialog start-book-modal">
				<h2 class="modal-title">Mark Book Started</h2>
				<div class="container">

					<div id="start-book-modal-error" class="alert error hidden"></div>

					<div class="book-information">
						<img src="" alt="" width="200" height="300" />
						<div class="cover-placeholder"></div>

						<div class="details">
							<h2></h2>
							<h3></h3>
							<dl>
								<div>
									<dt>Type</dt>
									<dd class="book-type"></dd>
								</div>
							</dl>
						</div>
					</div>

					<form class="start-book-form" name="start-book">
						<input type="hidden" name="start-book-id" id="start-book-id" />

						<div class="form-field">
							<label for="book-format">
								<span class="required">*</span>Format(s)
								<select id="book-format" name="book-format" multiple required>
									<option value="1">Harcover</option>
									<option value="2">Paperback</option>
									<option value="3">eBook</option>
									<option value="4">Audiobook</option>
								</select>
							</label>
						</div>

						<div class="form-field">
							<label for="book-date-start">
								<span class="required">*</span>Date Started
								<input type="date" name="book-date-started" id="book-date-started" required />
							</label>
						</div>

						<div class="form-field">
							<label for="book-cover-url">
								Cover
								<input type="url" name="book-cover-url" id="book-cover-url" />
							</label>
						</div>

						<div class="form-field">
							<label for="book-page-count">
								<span class="required">*</span>Page Count
								<input type="text" id="book-page-count" name="book-page-count" required />
							</label>
						</div>

						<div class="actions">
							<button type="button" class="btn-ghost" id="mark-started-dialog-cancel">Cancel</button>
							<submit-form-button class="start-book-save">
								<button type="submit" class="btn-primary">
									<span class="btn-processing-content">
										<span class="loader" style="display:none"></span>
										<span class="button-text">Start Book</span>
									</span>
								</button>
							</submit-form-button>
						</div>
					</form>
				</div>
			</dialog>
		`;
	}
}

customElements.define('mark-book-started-form', MarkBookStartedForm);
