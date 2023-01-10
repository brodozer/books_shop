export class View {
	getTemplateBooks(books) {
		return books.reduce((tmpl, book) => {
			return (tmpl += `
			<div class="col-12 col-sm-6 col-md-4 col-lg-3">
				<div class="card card-book h-100 text-center">
					<div class="responsive">
						<img
							src="${book.imageLink}"
							class="card-img-top"
							alt="${book.imageLink.slice(7, -4)}"
						/>
					</div>	
					<div class="card-body">
						<h5 class="card-title">${book.title}</h5>
						<h6 class="card-subtitle mb-2 text-muted">
							by ${book.author}
						</h6>
						<p class="book-price">$ ${book.price}</p>
						<button
							type="button"
							class="btn btn-primary btn-add-to-cart w-100"
							data-card-id="${book.id}"
						>
							add to cart
						</button>
					</div>
				</div>
			</div>		
		`);
		}, "");
	}
	getTemplateSelectBookQty(id, qty = 1, btn = false) {
		let select = '<select class="form-select" id="inputGroupSelect">';
		for (let i = 1; i < 6; i += 1) {
			if (qty === i) {
				select += `<option value="${i}" selected>${i}</option>`;
			} else {
				select += `<option value="${i}">${i}</option>`;
			}
		}
		select += "</select>";
		if (btn) {
			select +=
				'<button type="button" class="btn btn-danger btn-delete"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></button>';
		}
		return `
		<div class="input-group select-qty" data-book-id="${id}">
			<label class="input-group-text" for="inputGroupSelect">Qty:</label>
			${select}
		</div>
		
		`;
	}
	getTemplateCartItems(cart) {
		return cart.reduce((tmpl, book) => {
			const select = this.getTemplateSelectBookQty(
				book.id,
				book.qty,
				true
			);
			return (tmpl += `
				<div class="card cart-item pb-3 mb-3 red">
					<div class="row g-0">
						<div class="col-12 col-md-3 col-lg-4">
							<div class="responsive">
								<img
									src="${book.imageLink}"
									class="img-fluid rounded-start"
									alt="${book.imageLink.slice(7, -4)}"
								/>
							</div>
						</div>
						<div class="col d-flex flex-column">
							<div class="card-body">
								<h4 class="card-title">${book.title}</h4>
								<h6 class="card-subtitle">${book.author}</h6>
							</div>
							<div class="card-footer">
								${select}
								<div class="book-price">$ ${book.price}</div>
							</div>
						</div>
					</div>
				</div>
			`);
		}, "");
	}
}
