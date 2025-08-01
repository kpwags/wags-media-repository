class VideoGameFilterForm extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<dialog id="filter-video-game" class="form-dialog">
				<h2 class="modal-title">Filter Games</h2>

				<div class="container">
					<form name="filter-video-game">
						<div class="form-field">
							<label for="filter-video-game-title">
								Title
								<input type="text" name="video-game-title" id="filter-video-game-title" />
							</label>
						</div>

						<div class="form-field">
							<label for="filter-video-game-genre">
								Genre
								<select name="video-game-genre" id="filter-video-game-genre">
									<option value="0">All</option>
								</select>
							</label>
						</div>

						<div class="form-field">
							<label for="filter-video-game-system">
								System
								<select name="video-game-system" id="filter-video-game-system">
									<option value="0">All</option>
								</select>
							</label>
						</div>

						<div class="actions">
							<button type="submit" class="btn-primary">Filter</button>
							<button type="button" class="btn-ghost" id="video-game-filter-cancel">Cancel</button>
						</div>
					</form>
				</div>
			</dialog>
		`;
	}
}

customElements.define('video-game-filter-form', VideoGameFilterForm);
