export class View {
	getTemplateBooks(books) {
		return books.reduce((tmpl, book) => {
			return (tmpl += `
			<div class="col-12 col-sm-6 col-md-4 col-lg-3">
				<div class="card h-100 text-center">
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
}
