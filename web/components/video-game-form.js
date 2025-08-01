class VideoGameForm extends HTMLElement {
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
			<dialog id="add-video-game" class="form-dialog">
				<h2 class="modal-title">Add Game</h2>

				<div class="container">
					<div id="add-video-game-modal-error" class="alert error hidden"></div>

					<form name="add-video-game">
						<input type="hidden" id="videoGameId" name="videoGameId" value="0" />

						<div class="form-field">
							<label for="video-game-title">
								<span class="required">*</span>Title
								<input type="text" name="video-game-title" id="video-game-title" required />
							</label>
						</div>

						<div class="form-field">
							<label for="video-game-status">
								<span class="required">*</span>Status
								<select name="video-game-status" id="video-game-status" required>
									<option value="1" ${this.status === 1 ? 'selected' : ''}>Backlog</option>
									<option value="2" ${this.status === 2 ? 'selected' : ''}>Currently Playing</option>
									<option value="3" ${this.status === 3 ? 'selected' : ''}>Finished</option>
								</select>
							</label>
						</div>

						<div class="form-field">
							<label for="video-game-completion-status">
								<span class="required">*</span>Completion Status
								<select name="video-game-completion-status" id="video-game-completion-status" required>
									<option value="1">N/A</option>
									<option value="2">Yes</option>
									<option value="3">No</option>
								</select>
							</label>
						</div>

						<div class="form-field">
							<label for="video-game-link">
								<span class="required">*</span>Link
								<input type="url" name="video-game-link" id="video-game-link" required />
							</label>
						</div>

						<div class="form-field">
							<label for="video-game-cover-url">
								Cover
								<input type="url" name="video-game-cover-url" id="video-game-cover-url" />
							</label>
						</div>

						<div class="form-field">
							<label for="video-game-sort">
								Sort Order
								<input type="text" name="video-game-sort" id="video-game-sort" />
							</label>
						</div>

						<div class="form-field">
							<label for="video-game-genre">
								Genre(s)
								<select id="video-game-genre" name="video-game-genre" multiple></select>
							</label>
						</div>

						<div class="form-field">
							<label for="video-game-system">
								System(s)
								<select id="video-game-system" name="video-game-system" multiple></select>
							</label>
						</div>

						<div class="form-field dual">
							<label for="video-game-date-started">
								Date Started
								<input type="date" name="video-game-date-started" id="video-game-date-started" />
							</label>
							<label for="video-game-date-completed">
								Date Completed
								<input type="date" name="video-game-date-started" id="video-game-date-completed" />
							</label>
						</div>

						<div class="form-field">
							<label>
								Rating
								<star-rating id="video-game-rating" fieldid="video-game-rating" rating="0"></star-rating>
							</label>
						</div>

						<div class="form-field">
							<label for="video-game-thoughts">
								Thoughts
								<textarea id="video-game-thoughts" name="video-game-thoughts"></textarea>
							</label>
						</div>

						<div class="actions">
							<button type="submit" class="btn-primary">Save</button>
							<button type="button" class="btn-ghost" id="video-game-form-dialog-cancel">Cancel</button>
						</div>
					</form>
				</div>
			</dialog>
		`;
	}
}

customElements.define('video-game-form', VideoGameForm);
